// Template registry. Vite's import.meta.glob pulls every category's .svg files
// in as raw strings at build time, so adding art is just dropping a new .svg
// into the right folder — no manual list to maintain.

const modules = import.meta.glob('./{animals,vehicles,houses,princess,gymnastics}/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// Coloring-book pages are big detailed scenes, so they're lazy: each page is
// its own chunk fetched only when tapped, and the picker shows a small JPEG.
const lazyModules = import.meta.glob('./{farm,wild}/*.svg', { query: '?raw', import: 'default' })
const thumbs = import.meta.glob('./{farm,wild}/thumbs/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const CATEGORIES = [
  { id: 'animals', label: 'Animals', icon: '🐱' },
  { id: 'farm', label: 'Farm', icon: '🐮' },
  { id: 'wild', label: 'Wild', icon: '🦁' },
  { id: 'vehicles', label: 'Vehicles', icon: '🚂' },
  { id: 'houses', label: 'Houses', icon: '🏠' },
  { id: 'princess', label: 'Princess', icon: '👑' },
  { id: 'gymnastics', label: 'Gymnastics', icon: '🤸' },
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

function add(path, extra) {
  const m = /\.\/(\w+)\/([\w-]+)\.svg$/.exec(path)
  if (!m) return
  const [, category, stem] = m
  if (!TEMPLATES[category]) return
  TEMPLATES[category].push({ id: `${category}/${stem}`, name: titleCase(stem), category, ...extra })
}
for (const path in modules) add(path, { svg: modules[path] })
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

// Stable alphabetical order within each category.
for (const cat in TEMPLATES) {
  TEMPLATES[cat].sort((a, b) => a.name.localeCompare(b.name))
}

export function allTemplates() {
  return CATEGORIES.flatMap((c) => TEMPLATES[c.id])
}
