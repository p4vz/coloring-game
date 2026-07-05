// Template registry. Vite's import.meta.glob pulls every category's .svg files
// in as raw strings at build time, so adding art is just dropping a new .svg
// into the right folder — no manual list to maintain.

const modules = import.meta.glob('./{animals,vehicles,houses,princess,gymnastics}/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const CATEGORIES = [
  { id: 'animals', label: 'Animals', icon: '🐱' },
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

// Build { categoryId: [ {id, name, category, svg}, ... ] }
export const TEMPLATES = {}
for (const cat of CATEGORIES) TEMPLATES[cat.id] = []

for (const path in modules) {
  const m = /\.\/(\w+)\/([\w-]+)\.svg$/.exec(path)
  if (!m) continue
  const [, category, stem] = m
  if (!TEMPLATES[category]) continue
  TEMPLATES[category].push({
    id: `${category}/${stem}`,
    name: titleCase(stem),
    category,
    svg: modules[path],
  })
}

// Stable alphabetical order within each category.
for (const cat in TEMPLATES) {
  TEMPLATES[cat].sort((a, b) => a.name.localeCompare(b.name))
}

export function allTemplates() {
  return CATEGORIES.flatMap((c) => TEMPLATES[c.id])
}
