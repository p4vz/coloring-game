// Dress Up! — pick a doll (girl or boy), dress them from a slot-based
// wardrobe, then recolor any part by choosing a palette color and tapping it,
// or doodle and stamp stickers on top. Reuses the coloring game's palette,
// tools, sounds, and PNG exporter.

import './style.css'
import { state, loadPrefs, setMuted, TOOLS } from '../state.js'
import { unlockAudio, sounds } from '../audio.js'
import { exportPng } from '../engine/exporter.js'
import { createPalette } from '../ui/palette.js'
import { createToolbar } from '../ui/toolbar.js'
import { createHistory } from '../engine/history.js'
import { createStroke } from '../engine/brush.js'
import { makeSticker } from '../art/stickers.js'
import { dollSvg, WARDROBES, DEFAULTS_BY_DOLL, SLOTS_BY_DOLL, DOLLS } from './wardrobe.js'

const app = document.getElementById('app')
loadPrefs()
window.addEventListener('pointerdown', unlockAudio, { once: true })

const screen = document.createElement('div')
screen.className = 'du-screen'

// ---------- top bar ----------
const topbar = document.createElement('div')
topbar.className = 'du-topbar'

const hubBtn = document.createElement('a')
hubBtn.className = 'du-icon-btn'
hubBtn.href = '../index.html'
hubBtn.innerHTML = '🎈'
hubBtn.title = 'All games'

const titleEl = document.createElement('div')
titleEl.className = 'du-title'
titleEl.textContent = 'Dress Up!'

const right = document.createElement('div')
right.className = 'du-top-right'

const muteBtn = document.createElement('button')
muteBtn.className = 'du-icon-btn'
const renderMute = () => (muteBtn.innerHTML = state.muted ? '🔇' : '🔊')
renderMute()
muteBtn.addEventListener('click', () => {
  setMuted(!state.muted)
  renderMute()
  sounds.pick()
})

const surpriseBtn = document.createElement('button')
surpriseBtn.className = 'du-icon-btn'
surpriseBtn.innerHTML = '🎲'
surpriseBtn.title = 'Surprise outfit!'

const resetBtn = document.createElement('button')
resetBtn.className = 'du-icon-btn'
resetBtn.innerHTML = '🧽'
resetBtn.title = 'Start over'

const saveBtn = document.createElement('button')
saveBtn.className = 'du-icon-btn'
saveBtn.innerHTML = '💾'
saveBtn.title = 'Save picture'

right.append(muteBtn, surpriseBtn, resetBtn, saveBtn)
topbar.append(hubBtn, titleEl, right)

// ---------- stage (the doll) ----------
const stage = document.createElement('div')
stage.className = 'du-stage'

const history = createHistory()
const SVG_NS = 'http://www.w3.org/2000/svg'

// Doodles and stickers live in their own top layer of the doll SVG, so they
// show up in saved pictures. It ignores taps so recoloring still reaches the
// clothes underneath.
function drawLayer() {
  const svg = stage.querySelector('svg')
  let g = svg.querySelector('g.du-drawing')
  if (!g) {
    g = document.createElementNS(SVG_NS, 'g')
    g.setAttribute('class', 'du-drawing')
    g.setAttribute('pointer-events', 'none')
    svg.appendChild(g)
  }
  return g
}

function toSvgPoint(e) {
  const svg = stage.querySelector('svg')
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  return pt.matrixTransform(ctm.inverse())
}

let stroke = null

// delegated handlers survive doll rebuilds
stage.addEventListener('pointerdown', (e) => {
  if (!stage.querySelector('svg') || (e.button != null && e.button > 0)) return
  if (state.tool === TOOLS.FILL) {
    const region = e.target.closest && e.target.closest('.region')
    if (!region) return
    const prev = region.getAttribute('fill')
    if (prev === state.color) return
    region.setAttribute('fill', state.color)
    history.push(() => {
      region.setAttribute('fill', prev)
      saveOutfit()
    })
    sounds.fill()
    saveOutfit()
  } else if (state.tool === TOOLS.STICKER) {
    const { x, y } = toSvgPoint(e)
    const el = makeSticker(state.sticker, x, y, state.color)
    drawLayer().appendChild(el)
    history.push(() => {
      el.remove()
      saveOutfit()
    })
    sounds.stamp()
    saveOutfit()
  } else if (state.tool === TOOLS.BRUSH) {
    stage.setPointerCapture?.(e.pointerId)
    // brush sizes are tuned for 400-unit pictures; the doll is a bit smaller
    stroke = createStroke(drawLayer(), { color: state.color, size: state.brushSize * 0.8 })
    const { x, y } = toSvgPoint(e)
    stroke.add(x, y)
  }
})
stage.addEventListener(
  'pointermove',
  (e) => {
    if (!stroke) return
    e.preventDefault()
    const { x, y } = toSvgPoint(e)
    stroke.add(x, y)
  },
  { passive: false },
)
function endStroke(e) {
  if (!stroke) return
  stage.releasePointerCapture?.(e.pointerId)
  const el = stroke.el
  stroke = null
  history.push(() => {
    el.remove()
    saveOutfit()
  })
  sounds.brush()
  saveOutfit()
}
stage.addEventListener('pointerup', endStroke)
stage.addEventListener('pointercancel', endStroke)

// ---------- wardrobe panel ----------
const panel = document.createElement('div')
panel.className = 'du-panel'

const dollRow = document.createElement('div')
dollRow.className = 'du-doll-row'

const slotTabs = document.createElement('div')
slotTabs.className = 'du-slot-tabs'

const itemGrid = document.createElement('div')
itemGrid.className = 'du-items'

let currentDoll = 'girl'
let worn = { ...DEFAULTS_BY_DOLL[currentDoll] }
let activeSlot = 'dress'

const wardrobe = () => WARDROBES[currentDoll]

// ---------- outfit persistence (auto-save so the doll is waiting next visit) --
const OUTFIT_KEY = 'elana.dressup.outfit.v1'
let saveTimer = null

function writeOutfit() {
  clearTimeout(saveTimer)
  saveTimer = null
  try {
    const fills = [...stage.querySelectorAll('.region')].map((r) => r.getAttribute('fill'))
    const drawing = stage.querySelector('g.du-drawing')?.innerHTML || ''
    localStorage.setItem(OUTFIT_KEY, JSON.stringify({ doll: currentDoll, worn, fills, drawing }))
  } catch {
    // storage unavailable (private mode) — the game just won't remember
  }
}

function saveOutfit() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(writeOutfit, 250)
}

// don't lose the last few changes when the page closes or the app is backgrounded
const flushOutfit = () => saveTimer && writeOutfit()
window.addEventListener('pagehide', flushOutfit)
document.addEventListener('visibilitychange', () => document.hidden && flushOutfit())

function loadOutfit() {
  try {
    return JSON.parse(localStorage.getItem(OUTFIT_KEY))
  } catch {
    return null
  }
}

function equip(slot, itemId) {
  const item = wardrobe()[slot]?.find((i) => i.id === itemId)
  const anchor = stage.querySelector(`[data-slot="${slot}"]`)
  if (!item || !anchor) return
  anchor.innerHTML = item.svg
  worn[slot] = itemId
  saveOutfit()
}

function renderItems() {
  itemGrid.innerHTML = ''
  for (const item of wardrobe()[activeSlot] || []) {
    const card = document.createElement('button')
    card.className = 'du-item'
    if (worn[activeSlot] === item.id) card.classList.add('worn')
    card.title = item.name
    card.innerHTML = item.svg
      ? `<svg viewBox="${item.thumbBox}" xmlns="http://www.w3.org/2000/svg">${item.svg}</svg>`
      : '<span class="du-none">🚫</span>'
    card.addEventListener('click', () => {
      sounds.stamp()
      equip(activeSlot, item.id)
      renderItems()
    })
    itemGrid.appendChild(card)
  }
}

function renderSlotTabs() {
  slotTabs.innerHTML = ''
  for (const slot of SLOTS_BY_DOLL[currentDoll]) {
    const b = document.createElement('button')
    b.className = 'du-slot-tab'
    b.innerHTML = `<span>${slot.icon}</span><span class="du-slot-label">${slot.label}</span>`
    if (slot.id === activeSlot) b.classList.add('active')
    b.addEventListener('click', () => {
      activeSlot = slot.id
      sounds.pick()
      renderSlotTabs()
      renderItems()
    })
    slotTabs.appendChild(b)
  }
}

function buildDoll(savedWorn = null, savedFills = null, savedDrawing = '') {
  stage.innerHTML = dollSvg(currentDoll)
  history.reset()
  worn = { ...DEFAULTS_BY_DOLL[currentDoll] }
  if (savedWorn) {
    // only restore item ids that still exist in the wardrobe
    for (const [slot, id] of Object.entries(savedWorn)) {
      if (wardrobe()[slot]?.some((i) => i.id === id)) worn[slot] = id
    }
  }
  for (const slot of Object.keys(worn)) equip(slot, worn[slot])
  // re-apply saved colors; only safe when the region list matches exactly
  if (savedFills) {
    const regions = [...stage.querySelectorAll('.region')]
    if (regions.length === savedFills.length) {
      regions.forEach((r, i) => savedFills[i] && r.setAttribute('fill', savedFills[i]))
    }
  }
  if (typeof savedDrawing === 'string' && savedDrawing) drawLayer().innerHTML = savedDrawing
  if (!wardrobe()[activeSlot]) activeSlot = 'dress'
  renderSlotTabs()
  renderItems()
  saveOutfit()
}

const dollButtons = DOLLS.map((d) => {
  const b = document.createElement('button')
  b.className = 'du-doll-btn'
  b.innerHTML = `${d.icon} ${d.label}`
  if (d.id === currentDoll) b.classList.add('active')
  b.addEventListener('click', () => {
    if (currentDoll === d.id) return
    currentDoll = d.id
    dollButtons.forEach((x) => x.classList.toggle('active', x === b))
    sounds.pick()
    buildDoll()
  })
  dollRow.appendChild(b)
  return b
})

panel.append(dollRow, slotTabs, itemGrid)

// ---------- drawing tools + palette ----------
const toolbar = createToolbar({ onUndo: () => history.undo() })
history.onChange((size) => toolbar.setUndoEnabled(size > 0))
const toolsWrap = document.createElement('div')
toolsWrap.className = 'du-tools'
toolsWrap.appendChild(toolbar.el)

const paletteWrap = document.createElement('div')
paletteWrap.className = 'du-palette'
paletteWrap.appendChild(createPalette().el)

const side = document.createElement('div')
side.className = 'du-side'
side.append(panel, toolsWrap, paletteWrap)

// ---------- actions ----------
surpriseBtn.addEventListener('click', () => {
  sounds.stamp()
  for (const slot of Object.keys(wardrobe())) {
    const items = wardrobe()[slot]
    equip(slot, items[Math.floor(Math.random() * items.length)].id)
  }
  history.reset()
  renderItems()
})

resetBtn.addEventListener('click', () => {
  sounds.undo()
  try {
    localStorage.removeItem(OUTFIT_KEY)
  } catch {
    // ignore
  }
  buildDoll()
})

saveBtn.addEventListener('click', async () => {
  saveBtn.disabled = true
  // little "ta-da!" celebration over the doll before the picture downloads
  const tada = document.createElement('div')
  tada.className = 'du-tada'
  tada.innerHTML = '<span class="du-tada-star s1">🌟</span><b>Ta-da!</b><span class="du-tada-star s2">🌟</span>'
  stage.appendChild(tada)
  sounds.tada()
  setTimeout(() => tada.remove(), 1100)
  try {
    await exportPng(stage.querySelector('svg'), 'my-doll.png')
  } catch (err) {
    console.error(err)
  } finally {
    saveBtn.disabled = false
  }
})

screen.append(topbar, stage, side)
app.replaceChildren(screen)

// restore the last outfit (doll, clothes, and colors) if one was saved
const saved = loadOutfit()
if (saved && WARDROBES[saved.doll]) {
  currentDoll = saved.doll
  dollButtons.forEach((b, i) => b.classList.toggle('active', DOLLS[i].id === currentDoll))
  buildDoll(saved.worn, saved.fills, saved.drawing)
} else {
  buildDoll()
}
