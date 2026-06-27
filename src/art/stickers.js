// Sticker stamps. Each returns a fresh SVG element centered on (x, y), sized in
// the picture's user units (templates use a ~0..400 coordinate space, so ~40 is
// a chunky, kid-friendly stamp). Color comes from the current palette swatch.

const SVG_NS = 'http://www.w3.org/2000/svg'
const SIZE = 38

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name)
  for (const k in attrs) node.setAttribute(k, attrs[k])
  return node
}

// Build a regular star path (5 points) around the origin.
function starPath(r) {
  const inner = r * 0.42
  let d = ''
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner
    const a = (Math.PI / 5) * i - Math.PI / 2
    const px = Math.cos(a) * rad
    const py = Math.sin(a) * rad
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `
  }
  return d + 'Z'
}

const builders = {
  star(color) {
    return el('path', {
      d: starPath(SIZE / 2),
      fill: color,
      stroke: '#00000033',
      'stroke-width': 1.5,
    })
  },
  heart(color) {
    const s = SIZE / 2
    const d =
      `M 0 ${s * 0.75} ` +
      `C ${-s * 1.3} ${-s * 0.35}, ${-s * 0.5} ${-s} , 0 ${-s * 0.35} ` +
      `C ${s * 0.5} ${-s}, ${s * 1.3} ${-s * 0.35}, 0 ${s * 0.75} Z`
    return el('path', { d, fill: color, stroke: '#00000033', 'stroke-width': 1.5 })
  },
  flower(color) {
    const g = el('g', {})
    const r = SIZE * 0.24
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i
      g.appendChild(
        el('circle', {
          cx: (Math.cos(a) * SIZE) / 4,
          cy: (Math.sin(a) * SIZE) / 4,
          r,
          fill: color,
          stroke: '#00000022',
          'stroke-width': 1,
        }),
      )
    }
    g.appendChild(el('circle', { cx: 0, cy: 0, r: r * 0.9, fill: '#fff4b8' }))
    return g
  },
  dot(color) {
    return el('circle', {
      r: SIZE / 2.6,
      fill: color,
      stroke: '#00000033',
      'stroke-width': 1.5,
    })
  },
}

export const STICKERS = ['star', 'heart', 'flower', 'dot']

export function makeSticker(type, x, y, color) {
  const build = builders[type] || builders.star
  const node = build(color)
  const wrap = el('g', { transform: `translate(${x} ${y})` })
  wrap.appendChild(node)
  return wrap
}
