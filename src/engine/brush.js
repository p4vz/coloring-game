// Freehand brush: turns a stream of pointer points into a single smoothed SVG
// <path>. We sample sparingly (skip points that are too close together) and use
// quadratic smoothing so strokes look soft without producing huge path data —
// important for keeping things light on weak tablets.

const SVG_NS = 'http://www.w3.org/2000/svg'
const MIN_DIST = 3 // px in SVG coords between sampled points

export function createStroke(group, { color, size }) {
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', color)
  path.setAttribute('stroke-width', String(size))
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('stroke-linejoin', 'round')
  group.appendChild(path)

  const pts = []

  function rebuild() {
    if (pts.length === 0) return
    if (pts.length === 1) {
      // A single tap = a dot. Draw a tiny line so linecap renders a circle.
      const p = pts[0]
      path.setAttribute('d', `M ${p.x} ${p.y} L ${p.x + 0.01} ${p.y}`)
      return
    }
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2
      const my = (pts[i].y + pts[i + 1].y) / 2
      d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`
    }
    const last = pts[pts.length - 1]
    d += ` L ${last.x} ${last.y}`
    path.setAttribute('d', d)
  }

  return {
    el: path,
    add(x, y) {
      const prev = pts[pts.length - 1]
      if (prev) {
        const dx = x - prev.x
        const dy = y - prev.y
        if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return false
      }
      pts.push({ x, y })
      rebuild()
      return true
    },
    isEmpty() {
      return pts.length === 0
    },
  }
}
