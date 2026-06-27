// App entry point. Two screens — the picture Picker and the Coloring board —
// swapped inside #app. No router, no framework; just show/hide.

import './style.css'
import { state, loadPrefs, setMuted } from './state.js'
import { unlockAudio, sounds } from './audio.js'
import { createHistory } from './engine/history.js'
import { createBoard } from './engine/board.js'
import { exportPng } from './engine/exporter.js'
import { createPalette } from './ui/palette.js'
import { createToolbar } from './ui/toolbar.js'
import { createPicker } from './ui/picker.js'

const app = document.getElementById('app')
loadPrefs()

// First touch/click anywhere unlocks WebAudio on mobile browsers.
window.addEventListener('pointerdown', unlockAudio, { once: true })

function show(el) {
  app.replaceChildren(el)
}

function openPicker() {
  const picker = createPicker((tpl) => openColoring(tpl))
  show(picker.el)
}

function openColoring(tpl) {
  const screen = document.createElement('div')
  screen.className = 'screen coloring'

  // ----- top bar -----
  const topbar = document.createElement('div')
  topbar.className = 'topbar'

  const backBtn = document.createElement('button')
  backBtn.className = 'icon-btn back-btn'
  backBtn.innerHTML = '🏠'
  backBtn.title = 'Pick another picture'
  backBtn.addEventListener('click', () => {
    sounds.pick()
    openPicker()
  })

  const titleEl = document.createElement('div')
  titleEl.className = 'coloring-title'
  titleEl.textContent = tpl.name

  const rightGroup = document.createElement('div')
  rightGroup.className = 'top-right'

  const muteBtn = document.createElement('button')
  muteBtn.className = 'icon-btn mute-btn'
  const renderMute = () => (muteBtn.innerHTML = state.muted ? '🔇' : '🔊')
  muteBtn.title = 'Sound on/off'
  renderMute()
  muteBtn.addEventListener('click', () => {
    setMuted(!state.muted)
    renderMute()
    sounds.pick()
  })

  const saveBtn = document.createElement('button')
  saveBtn.className = 'icon-btn save-btn'
  saveBtn.innerHTML = '💾'
  saveBtn.title = 'Save picture'

  rightGroup.append(muteBtn, saveBtn)
  topbar.append(backBtn, titleEl, rightGroup)

  // ----- stage (the SVG board) -----
  const stage = document.createElement('div')
  stage.className = 'stage'

  // ----- bottom controls -----
  const controls = document.createElement('div')
  controls.className = 'controls'

  const history = createHistory()
  const board = createBoard(stage, history)

  const toolbar = createToolbar({
    onUndo: () => history.undo(),
    onClear: () => board.clearAll(),
  })
  history.onChange((size) => toolbar.setUndoEnabled(size > 0))

  const palette = createPalette()

  saveBtn.addEventListener('click', async () => {
    sounds.pick()
    saveBtn.disabled = true
    try {
      await exportPng(board.getSvg(), `${tpl.name.toLowerCase()}-coloring.png`)
    } catch (err) {
      console.error(err)
    } finally {
      saveBtn.disabled = false
    }
  })

  controls.append(palette.el, toolbar.el)
  screen.append(topbar, stage, controls)
  show(screen)

  board.load(tpl.svg)
}

openPicker()
