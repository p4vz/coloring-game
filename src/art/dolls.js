// "Dolls" coloring pages, composed from the Dress Up game's doll and wardrobe
// so both games share one friendly art style. Each page is the doll in a
// themed outfit, turned into a coloring page: every region starts white. The
// shapes carry their own strokes and stay in paint order (so clothes cover
// the body), which means the outline layer is just an empty top marker.

import { dollSvg, WARDROBES, DEFAULTS_BY_DOLL } from '../dressup/wardrobe.js'

const PAGES = [
  { name: 'Princess', doll: 'girl', worn: { hair: 'long', dress: 'ballgown', hat: 'crown', necklace: 'pearls', shoes: 'sparkle-heels', scene: 'castle' } },
  { name: 'Ballerina', doll: 'girl', worn: { hair: 'bun', dress: 'tutu', hat: 'tiara', shoes: 'ballet', scene: 'stage' } },
  { name: 'Mermaid', doll: 'girl', worn: { hair: 'curls', dress: 'mermaid', hat: 'star-tiara', earrings: 'star-earrings', scene: 'beach' } },
  { name: 'Snow Day', doll: 'girl', worn: { hair: 'pigtails', dress: 'winter-coat', hat: 'winter-hat', necklace: 'scarf', gloves: 'mittens', shoes: 'boots', scene: 'snow' } },
  { name: 'Unicorn Friend', doll: 'girl', worn: { hair: 'long', dress: 'rainbow', hat: 'flowers', shoes: 'flats', pet: 'unicorn', scene: 'park' } },
  { name: 'Kitty Picnic', doll: 'girl', worn: { hair: 'pigtails', dress: 'sundress', hat: 'sunhat', shoes: 'sandals', pet: 'kitty', scene: 'park' } },
  { name: 'Party Time', doll: 'girl', worn: { hair: 'curls', dress: 'party', hat: 'party-hat', necklace: 'beads', shoes: 'sneakers', glasses: 'heart-glasses' } },
  { name: 'Superhero', doll: 'boy', worn: { hair: 'spiky', dress: 'hero', shoes: 'boots', pet: 'puppy', scene: 'park' } },
  { name: 'Rainy Day', doll: 'boy', worn: { hair: 'short', dress: 'raincoat', shoes: 'rainboots', hat: 'cap', pet: 'puppy' } },
  { name: 'Dragon Prince', doll: 'boy', worn: { hair: 'curly-boy', dress: 'suit', hat: 'crown', shoes: 'boots', pet: 'dragon', scene: 'castle' } },
]

const REGION_FILL = /class="region[^"]*" fill="[^"]*"/g

function compose({ doll, worn }) {
  const outfit = { ...DEFAULTS_BY_DOLL[doll], ...worn }
  let body = dollSvg(doll)
    .replace(/^\s*<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
  for (const [slot, id] of Object.entries(outfit)) {
    const item = WARDROBES[doll][slot]?.find((i) => i.id === id)
    body = body.replace(`<g data-slot="${slot}"></g>`, item ? item.svg : '')
  }
  const regions = body.replace(REGION_FILL, 'class="region" fill="#ffffff"')
  return `<svg viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg">
<g class="regions">${regions}</g>
<g class="outlines"></g>
</svg>`
}

export const DOLL_PAGES = PAGES.map((p) => ({ stem: p.name.toLowerCase().replace(/\s+/g, '-'), name: p.name, svg: compose(p) }))
