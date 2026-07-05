// Dress Up! — pick clothes for the doll, then recolor any part by choosing a
// palette color and tapping it. Reuses the coloring game's palette, sounds,
// and PNG exporter so both games feel like one family.

import './style.css'
import { state, loadPrefs, setMuted } from '../state.js'
import { unlockAudio, sounds } from '../audio.js'
import { exportPng } from '../engine/exporter.js'
import { createPalette } from '../ui/palette.js'
import { dollSvg, WARDROBE, DEFAULTS, SLOTS } from './wardrobe.js'

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

const resetBtn = document.createElement('button')
resetBtn.className = 'du-icon-btn'
resetBtn.innerHTML = '🧽'
resetBtn.title = 'Start over'

const saveBtn = document.createElement('button')
saveBtn.className = 'du-icon-btn'
saveBtn.innerHTML = '💾'
saveBtn.title = 'Save picture'

right.append(muteBtn, resetBtn, saveBtn)
topbar.append(hubBtn, titleEl, right)

// ---------- stage (the doll) ----------
const stage = document.createElement('div')
stage.className = 'du-stage'
stage.innerHTML = dollSvg()
const doll = stage.querySelector('svg')

// tap any region (clothes, hair, skin, cheeks) to recolor it
doll.addEventListener('pointerdown', (e) => {
  const region = e.target.closest && e.target.closest('.region')
  if (!region) return
  if (region.getAttribute('fill') === state.color) return
  region.setAttribute('fill', state.color)
  sounds.fill()
})

// ---------- wardrobe panel ----------
const panel = document.createElement('div')
panel.className = 'du-panel'

const slotTabs = document.createElement('div')
slotTabs.className = 'du-slot-tabs'

const itemGrid = document.createElement('div')
itemGrid.className = 'du-items'

const worn = { ...DEFAULTS }
let activeSlot = 'dress'

function equip(slot, itemId) {
  const item = WARDROBE[slot].find((i) => i.id === itemId)
  const anchor = doll.querySelector(`[data-slot="${slot}"]`)
  if (!item || !anchor) return
  anchor.innerHTML = item.svg
  worn[slot] = itemId
  renderItems()
}

function renderItems() {
  itemGrid.innerHTML = ''
  for (const item of WARDROBE[activeSlot]) {
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
    })
    itemGrid.appendChild(card)
  }
}

const tabButtons = SLOTS.map((slot) => {
  const b = document.createElement('button')
  b.className = 'du-slot-tab'
  b.innerHTML = `<span>${slot.icon}</span><span class="du-slot-label">${slot.label}</span>`
  if (slot.id === activeSlot) b.classList.add('active')
  b.addEventListener('click', () => {
    activeSlot = slot.id
    tabButtons.forEach((t) => t.classList.toggle('active', t === b))
    sounds.pick()
    renderItems()
  })
  slotTabs.appendChild(b)
  return b
})

panel.append(slotTabs, itemGrid)

// ---------- palette ----------
const paletteWrap = document.createElement('div')
paletteWrap.className = 'du-palette'
paletteWrap.appendChild(createPalette().el)

// ---------- actions ----------
resetBtn.addEventListener('click', () => {
  sounds.undo()
  window.location.reload() // fresh doll, default outfit — simplest "start over"
})

saveBtn.addEventListener('click', async () => {
  sounds.pick()
  saveBtn.disabled = true
  try {
    await exportPng(doll, 'my-doll.png')
  } catch (err) {
    console.error(err)
  } finally {
    saveBtn.disabled = false
  }
})

screen.append(topbar, stage, panel, paletteWrap)
app.replaceChildren(screen)

// wear the defaults
for (const slot of Object.keys(DEFAULTS)) equip(slot, DEFAULTS[slot])
renderItems()
