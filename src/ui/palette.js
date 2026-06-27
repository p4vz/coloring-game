// Color palette: a row of big, bright swatches. Tapping one becomes the active
// color for fill, brush, and stickers. White doubles as an "eraser" for fills.

import { state } from '../state.js'
import { sounds } from '../audio.js'

export const COLORS = [
  '#ff5a5f', '#ff9f1c', '#ffd34e', '#a8e10c', '#6bcb77',
  '#2ec4b6', '#4d96ff', '#5e60ce',
  // purples (light -> deep)
  '#d8b4fe', '#b388eb', '#9b5de5', '#7b2cbf',
  // pinks (light -> hot)
  '#ffd1e8', '#ffb3d1', '#ff70a6', '#ff4da6', '#e0218a',
  // neutrals / skin / brown
  '#ffc6a8', '#a3622d', '#2b2b2b', '#ffffff',
]

export function createPalette(onPick) {
  const wrap = document.createElement('div')
  wrap.className = 'palette'

  const swatches = COLORS.map((color) => {
    const b = document.createElement('button')
    b.className = 'swatch'
    b.style.setProperty('--c', color)
    b.setAttribute('aria-label', `color ${color}`)
    if (color === state.color) b.classList.add('selected')
    b.addEventListener('click', () => {
      state.color = color
      swatches.forEach((s) => s.classList.toggle('selected', s === b))
      sounds.pick()
      onPick?.(color)
    })
    wrap.appendChild(b)
    return b
  })

  return { el: wrap }
}
