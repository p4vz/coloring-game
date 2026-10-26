// Template registry. Vite's import.meta.glob pulls every category's .svg files
// in as raw strings at build time, so adding art is just dropping a new .svg
// into the right folder — no manual list to maintain.

import { DOLL_PAGES } from './dolls.js'

const modules = import.meta.glob('./{animals,vehicles,houses}/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// Coloring-book pages are big detailed scenes, so they're lazy: each page is
// its own chunk fetched only when tapped, and the picker shows a small JPEG.
const lazyModules = import.meta.glob('./{farm,wild,princess}/*.svg', { query: '?raw', import: 'default' })
const thumbs = import.meta.glob('./{farm,wild,princess}/thumbs/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const MONKEY_PEN =
  'Coloring pages by <a href="https://monkeypen.com/" target="_blank" rel="noopener">Monkey Pen</a>'
// Disney's free printable pages, used privately for one family. Not for
// publishing or sharing — see ATTRIBUTIONS.md.
const DISNEY =
  'Disney Princess characters © Disney. Pages provided by Disney Publishing Worldwide, ' +
  'used for private family play only. Not affiliated with or endorsed by Disney.'

export const CATEGORIES = [
  { id: 'animals', label: 'Animals', icon: '🐱' },
  { id: 'farm', label: 'Farm', icon: '🐮', credit: MONKEY_PEN },
  { id: 'wild', label: 'Wild', icon: '🦁', credit: MONKEY_PEN },
  { id: 'vehicles', label: 'Vehicles', icon: '🚂' },
  { id: 'houses', label: 'Houses', icon: '🏠' },
  { id: 'princess', label: 'Princess', icon: '👑', credit: DISNEY },
  { id: 'dolls', label: 'Dolls', icon: '👸' },
]

// Turn a file stem into a friendly display name: "fire-engine" -> "Fire Engine".
function titleCase(s) {
  return s
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Build { categoryId: [ {id, name, category, svg | load+thumb}, ... ] }
export const TEMPLATES = {}
for (const cat of CATEGORIES) TEMPLATES[cat.id] = []

// Give every picture a little breathing room so line work that touches the
// edge of its viewBox (ears, antennas, stroke caps) isn't clipped.
function pad(svg) {
  return svg.replace(/viewBox="([-\d.\s]+)"/, (_, vb) => {
    const [x, y, w, h] = vb.trim().split(/\s+/).map(Number)
    const m = Math.max(w, h) * 0.04
    return `viewBox="${x - m} ${y - m} ${w + 2 * m} ${h + 2 * m}"`
  })
}

function add(path, extra) {
  const m = /\.\/(\w+)\/([\w-]+)\.svg$/.exec(path)
  if (!m) return
  const [, category, stem] = m
  if (!TEMPLATES[category]) return
  TEMPLATES[category].push({ id: `${category}/${stem}`, name: titleCase(stem), category, ...extra })
}
for (const path in modules) add(path, { svg: pad(modules[path]) })
for (const p of DOLL_PAGES) add(`./dolls/${p.stem}.svg`, { svg: pad(p.svg), name: p.name })
for (const path in lazyModules) {
  add(path, {
    load: lazyModules[path],
    thumb: thumbs[path.replace(/\/([\w-]+)\.svg$/, '/thumbs/$1.jpg')],
  })
}

// Resolve a template's SVG markup, fetching lazy pages on demand.
export function loadSvg(tpl) {
  return tpl.svg ? Promise.resolve(tpl.svg) : tpl.load()
}

// Stable alphabetical order within each category (dolls keep their hand-picked
// order so the princess comes first).
for (const cat in TEMPLATES) {
  if (cat === 'dolls') continue
  TEMPLATES[cat].sort((a, b) => a.name.localeCompare(b.name))
}

export function allTemplates() {
  return CATEGORIES.flatMap((c) => TEMPLATES[c.id])
}
