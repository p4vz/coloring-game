// Home screen: big category tabs above a grid of picture thumbnails. Tapping a
// thumbnail opens it on the coloring screen. Thumbnails reuse each picture's own
// SVG, except lazy coloring-book pages, which show a small JPEG instead.

import { CATEGORIES, TEMPLATES } from '../art/index.js'
import { sounds } from '../audio.js'

export function createPicker(onChoose) {
  const screen = document.createElement('div')
  screen.className = 'screen picker'

  // link back to the games hub (landing page)
  const hub = document.createElement('a')
  hub.className = 'hub-btn'
  hub.href = '../index.html'
  hub.textContent = '🎈'
  hub.title = 'All games'

  const title = document.createElement('h1')
  title.className = 'picker-title'
  title.textContent = 'Pick a picture!'

  const tabs = document.createElement('div')
  tabs.className = 'tabs'

  const grid = document.createElement('div')
  grid.className = 'thumb-grid'

  // Monkey Pen's license asks for credit + a link wherever their pages are used
  const credit = document.createElement('div')
  credit.className = 'picker-credit'
  credit.innerHTML =
    'Coloring pages by <a href="https://monkeypen.com/" target="_blank" rel="noopener">Monkey Pen</a>'

  let current = CATEGORIES[0].id

  function renderGrid() {
    grid.innerHTML = ''
    credit.hidden = !TEMPLATES[current].some((t) => t.thumb)
    for (const tpl of TEMPLATES[current]) {
      const card = document.createElement('button')
      card.className = 'thumb'
      card.setAttribute('aria-label', tpl.name)

      const art = document.createElement('div')
      art.className = 'thumb-art'
      if (tpl.svg) {
        art.innerHTML = tpl.svg
      } else {
        const img = document.createElement('img')
        img.src = tpl.thumb
        img.alt = ''
        img.loading = 'lazy'
        art.appendChild(img)
      }

      const name = document.createElement('span')
      name.className = 'thumb-name'
      name.textContent = tpl.name

      card.append(art, name)
      card.addEventListener('click', () => {
        sounds.pick()
        onChoose(tpl)
      })
      grid.appendChild(card)
    }
  }

  const tabButtons = CATEGORIES.map((cat) => {
    const b = document.createElement('button')
    b.className = 'tab'
    b.innerHTML = `<span class="tab-icon">${cat.icon}</span><span class="tab-label">${cat.label}</span>`
    if (cat.id === current) b.classList.add('active')
    b.addEventListener('click', () => {
      current = cat.id
      tabButtons.forEach((t) => t.classList.toggle('active', t === b))
      sounds.pick()
      renderGrid()
    })
    tabs.appendChild(b)
    return b
  })

  renderGrid()
  screen.append(hub, title, tabs, grid, credit)
  return { el: screen }
}
