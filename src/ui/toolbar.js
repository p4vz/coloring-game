// The tool controls shown on the coloring screen: pick a tool (fill / brush /
// sticker) plus undo and clear. Brush reveals size dots; sticker reveals stamp
// choices. Big icon buttons, minimal text — friendly for a 4-year-old.

import { state, TOOLS } from '../state.js'
import { sounds } from '../audio.js'
import { STICKERS } from '../art/stickers.js'

const BRUSH_SIZES = [3, 6, 10, 16, 24]
const STICKER_ICONS = { star: '⭐', heart: '❤️', flower: '🌸', dot: '🔵' }

export function createToolbar({ onUndo, onClear }) {
  const wrap = document.createElement('div')
  wrap.className = 'toolbar'

  const tools = document.createElement('div')
  tools.className = 'tool-row'

  // contextual options (brush sizes / sticker choices)
  const options = document.createElement('div')
  options.className = 'tool-options'

  function makeBtn(cls, label, title) {
    const b = document.createElement('button')
    b.className = `tool-btn ${cls}`
    b.innerHTML = label
    b.title = title
    b.setAttribute('aria-label', title)
    return b
  }

  const fillBtn = makeBtn('t-fill', '🪣', 'Fill')
  const brushBtn = makeBtn('t-brush', '🖌️', 'Brush')
  const stickerBtn = makeBtn('t-sticker', '✨', 'Stickers')
  const undoBtn = makeBtn('t-undo', '↩️', 'Undo')
  const clearBtn = makeBtn('t-clear', '🧽', 'Start over')

  const toolButtons = { [TOOLS.FILL]: fillBtn, [TOOLS.BRUSH]: brushBtn, [TOOLS.STICKER]: stickerBtn }

  function renderOptions() {
    options.innerHTML = ''
    if (state.tool === TOOLS.BRUSH) {
      BRUSH_SIZES.forEach((size) => {
        const b = document.createElement('button')
        b.className = 'opt-btn size-opt'
        if (state.brushSize === size) b.classList.add('selected')
        const dot = document.createElement('span')
        dot.className = 'size-dot'
        dot.style.width = dot.style.height = `${size + 6}px`
        b.appendChild(dot)
        b.addEventListener('click', () => {
          state.brushSize = size
          sounds.pick()
          renderOptions()
        })
        options.appendChild(b)
      })
    } else if (state.tool === TOOLS.STICKER) {
      STICKERS.forEach((name) => {
        const b = document.createElement('button')
        b.className = 'opt-btn sticker-opt'
        if (state.sticker === name) b.classList.add('selected')
        b.textContent = STICKER_ICONS[name] || '⭐'
        b.addEventListener('click', () => {
          state.sticker = name
          sounds.pick()
          renderOptions()
        })
        options.appendChild(b)
      })
    }
  }

  function selectTool(tool) {
    state.tool = tool
    Object.entries(toolButtons).forEach(([t, b]) =>
      b.classList.toggle('active', t === tool),
    )
    renderOptions()
    sounds.pick()
  }

  fillBtn.addEventListener('click', () => selectTool(TOOLS.FILL))
  brushBtn.addEventListener('click', () => selectTool(TOOLS.BRUSH))
  stickerBtn.addEventListener('click', () => selectTool(TOOLS.STICKER))
  undoBtn.addEventListener('click', () => {
    if (onUndo()) sounds.undo()
  })
  clearBtn.addEventListener('click', () => onClear())

  tools.append(fillBtn, brushBtn, stickerBtn, undoBtn, clearBtn)
  wrap.append(options, tools)

  // initial state
  selectTool(state.tool)

  return {
    el: wrap,
    setUndoEnabled(enabled) {
      undoBtn.disabled = !enabled
      clearBtn.disabled = !enabled
    },
  }
}
