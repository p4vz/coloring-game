// Dress Up! — pick a doll (girl or boy), dress them from a slot-based
// wardrobe, then recolor any part by choosing a palette color and tapping it.
// Reuses the coloring game's palette, sounds, and PNG exporter.

import './style.css'
import { state, loadPrefs, setMuted } from '../state.js'
import { unlockAudio, sounds } from '../audio.js'
import { exportPng } from '../engine/exporter.js'
import { createPalette } from '../ui/palette.js'
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
hubBtn.href = '../'
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

// one delegated handler survives doll rebuilds: tap any region to recolor it
stage.addEventListener('pointerdown', (e) => {
  const region = e.target.closest && e.target.closest('.region')
  if (!region) return
  if (region.getAttribute('fill') === state.color) return
  region.setAttribute('fill', state.color)
  sounds.fill()
  saveOutfit()
})

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

function saveOutfit() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      const fills = [...stage.querySelectorAll('.region')].map((r) => r.getAttribute('fill'))
      localStorage.setItem(OUTFIT_KEY, JSON.stringify({ doll: currentDoll, worn, fills }))
    } catch {
      // storage unavailable (private mode) — the game just won't remember
    }
  }, 250)
}

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

function buildDoll(savedWorn = null, savedFills = null) {
  stage.innerHTML = dollSvg(currentDoll)
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

// ---------- palette ----------
const paletteWrap = document.createElement('div')
paletteWrap.className = 'du-palette'
paletteWrap.appendChild(createPalette().el)

// ---------- actions ----------
surpriseBtn.addEventListener('click', () => {
  sounds.stamp()
  for (const slot of Object.keys(wardrobe())) {
    const items = wardrobe()[slot]
    equip(slot, items[Math.floor(Math.random() * items.length)].id)
  }
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

screen.append(topbar, stage, panel, paletteWrap)
app.replaceChildren(screen)

// restore the last outfit (doll, clothes, and colors) if one was saved
const saved = loadOutfit()
if (saved && WARDROBES[saved.doll]) {
  currentDoll = saved.doll
  dollButtons.forEach((b, i) => b.classList.toggle('active', DOLLS[i].id === currentDoll))
  buildDoll(saved.worn, saved.fills)
} else {
  buildDoll()
}
