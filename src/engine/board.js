// The coloring board: mounts a picture's SVG, builds the layer stack, and
// routes pointer events to the active tool (fill / brush / sticker).
//
// Layer order inside the <svg> (back to front):
//   1. .regions   colorable shapes (only these are hit-testable)
//   2. .brush     freehand strokes
//   3. .stickers  stamped shapes
//   4. .outlines  black line art, drawn last so it stays on top
//
// All pointer events are captured on the <svg> root and dispatched by tool.

import { state, TOOLS } from '../state.js'
import { sounds } from '../audio.js'
import { createStroke } from './brush.js'
import { makeSticker } from '../art/stickers.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

export function createBoard(container, history) {
  let svg = null
  let layers = null
  let activeStroke = null
  let drawing = false

  function clearMount() {
    container.innerHTML = ''
    svg = null
    layers = null
    activeStroke = null
    drawing = false
  }

  // Convert a client (screen) coordinate to the SVG's user coordinate system.
  function toSvgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }
    const p = pt.matrixTransform(ctm.inverse())
    return { x: p.x, y: p.y }
  }

  function ensureGroup(cls, insertBeforeEl) {
    let g = svg.querySelector(`g.${cls}`)
    if (!g) {
      g = document.createElementNS(SVG_NS, 'g')
      g.setAttribute('class', cls)
      if (insertBeforeEl) svg.insertBefore(g, insertBeforeEl)
      else svg.appendChild(g)
    }
    return g
  }

  function fillRegion(target) {
    const region = target.closest && target.closest('.region')
    if (!region) return
    const prev = region.getAttribute('fill')
    if (prev === state.color) return
    region.setAttribute('fill', state.color)
    history.push(() => {
      if (prev === null) region.removeAttribute('fill')
      else region.setAttribute('fill', prev)
    })
    sounds.fill()
  }

  function placeSticker(x, y) {
    const el = makeSticker(state.sticker, x, y, state.color)
    layers.stickers.appendChild(el)
    history.push(() => el.remove())
    sounds.stamp()
  }

  function startBrush(x, y) {
    drawing = true
    activeStroke = createStroke(layers.brush, {
      color: state.color,
      size: state.brushSize,
    })
    activeStroke.add(x, y)
  }

  function moveBrush(x, y) {
    if (activeStroke) activeStroke.add(x, y)
  }

  function endBrush() {
    drawing = false
    if (activeStroke && !activeStroke.isEmpty()) {
      const el = activeStroke.el
      history.push(() => el.remove())
      sounds.brush()
    }
    activeStroke = null
  }

  function onPointerDown(e) {
    if (!svg) return
    // Ignore secondary touches / multi-touch to avoid stray marks.
    if (e.button != null && e.button > 0) return
    const { x, y } = toSvgPoint(e.clientX, e.clientY)

    if (state.tool === TOOLS.FILL) {
      fillRegion(e.target)
    } else if (state.tool === TOOLS.STICKER) {
      placeSticker(x, y)
    } else if (state.tool === TOOLS.BRUSH) {
      svg.setPointerCapture?.(e.pointerId)
      startBrush(x, y)
    }
  }

  function onPointerMove(e) {
    if (!drawing) return
    e.preventDefault()
    const { x, y } = toSvgPoint(e.clientX, e.clientY)
    moveBrush(x, y)
  }

  function onPointerUp(e) {
    if (drawing) {
      svg.releasePointerCapture?.(e.pointerId)
      endBrush()
    }
  }

  return {
    // Mount a picture from its raw SVG string and wire up the layers + events.
    load(svgString) {
      clearMount()
      const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml')
      svg = doc.documentElement
      // Make it fill the stage responsively.
      svg.removeAttribute('width')
      svg.removeAttribute('height')
      svg.setAttribute('class', 'board-svg')
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      container.appendChild(document.importNode(svg, true))
      svg = container.querySelector('svg')

      const outlines = svg.querySelector('g.outlines')
      layers = {
        regions: ensureGroup('regions'),
        brush: ensureGroup('brush', outlines),
        stickers: ensureGroup('stickers', outlines),
        outlines,
      }

      // Remember each region's starting fill so Clear can restore it exactly.
      svg.querySelectorAll('.region').forEach((r) => {
        r.dataset.orig = r.getAttribute('fill') || ''
      })

      svg.addEventListener('pointerdown', onPointerDown)
      svg.addEventListener('pointermove', onPointerMove, { passive: false })
      svg.addEventListener('pointerup', onPointerUp)
      svg.addEventListener('pointercancel', onPointerUp)

      history.reset()
    },

    // Reset every region to unfilled and remove all brush + sticker marks.
    // Recorded as one undoable batch so a single undo restores the picture.
    clearAll() {
      if (!svg) return
      const regions = [...svg.querySelectorAll('.region')]
      const prevFills = regions.map((r) => r.getAttribute('fill'))
      const brushKids = [...layers.brush.children]
      const stickerKids = [...layers.stickers.children]

      const hadContent =
        brushKids.length > 0 ||
        stickerKids.length > 0 ||
        regions.some((r, i) => prevFills[i] !== (r.dataset.orig || null))
      if (!hadContent) return

      regions.forEach((r) => {
        if (r.dataset.orig) r.setAttribute('fill', r.dataset.orig)
        else r.removeAttribute('fill')
      })
      layers.brush.replaceChildren()
      layers.stickers.replaceChildren()

      history.push(() => {
        regions.forEach((r, i) => {
          if (prevFills[i] === null) r.removeAttribute('fill')
          else r.setAttribute('fill', prevFills[i])
        })
        brushKids.forEach((k) => layers.brush.appendChild(k))
        stickerKids.forEach((k) => layers.stickers.appendChild(k))
      })
      sounds.undo()
    },

    getSvg() {
      return svg
    },
  }
}
