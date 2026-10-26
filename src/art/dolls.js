// Character coloring pages ("Friends" and "Gymnastics"), built from the same
// modular character parts as the Dress Up game so both games share one style.
// Each page is a kid in an outfit (with an optional pet and background scene),
// drawn as all-white tappable regions.

import { character } from './characters.js'
import { WARDROBE, CHAR_T } from '../dressup/wardrobe.js'

const PAGES = {
  friends: [
    { name: 'Princess', scene: 'castle', kid: { outfit: 'princess', hair: 'princess', face: 'happy', hat: 'crown', prop: 'wand' } },
    { name: 'Party Time', scene: 'park', kid: { outfit: 'party', hair: 'bun', face: 'wink', hat: 'bow', prop: 'balloon' } },
    { name: 'Explorer', scene: 'park', pet: 'puppy', kid: { outfit: 'explorer', hair: 'curly', face: 'surprised', hat: 'explorer', glasses: 'round' } },
    { name: 'Best Friends', pet: 'kitty', kid: { outfit: 'casualGirl', hair: 'pigtails', face: 'happy', prop: 'flower' } },
    { name: 'Ball Game', scene: 'park', pet: 'puppy', kid: { outfit: 'casualBoy', hair: 'short', face: 'laughing', hat: 'cap', prop: 'ball' } },
    { name: 'Sleepy Time', pet: 'bunny', kid: { outfit: 'pajamas', hair: 'long', face: 'wink' } },
    { name: 'Unicorn Princess', pet: 'unicorn', kid: { outfit: 'princess', hair: 'long', face: 'laughing', hat: 'tiara', prop: 'flower' } },
    { name: 'Beach Day', scene: 'beach', kid: { outfit: 'party', hair: 'ponytail', face: 'happy', hat: 'flower', glasses: 'star' } },
  ],
  gymnastics: [
    { name: 'Ribbon', scene: 'stage', kid: { outfit: 'gymnast', hair: 'ponytail', face: 'laughing', prop: 'ribbon' } },
    { name: 'Hoop', scene: 'stage', kid: { outfit: 'gymnast', hair: 'bun', face: 'happy', prop: 'hoop' } },
    { name: 'Ball', scene: 'stage', kid: { outfit: 'gymnast', hair: 'pigtails', face: 'happy', prop: 'ball' } },
    { name: 'Gold Medal', kid: { outfit: 'gymnast', hair: 'bun', face: 'laughing', medal: true, prop: 'flower' } },
    { name: 'Ta-da!', scene: 'stage', kid: { outfit: 'gymnast', hair: 'long', face: 'wink', hat: 'tiara' } },
    { name: 'Star Gymnast', kid: { outfit: 'gymnast', hair: 'curly', face: 'surprised', prop: 'wand', medal: true } },
  ],
}

const REGION_FILL = /class="region[^"]*" fill="[^"]*"/g
const whiten = (svg) => svg.replace(REGION_FILL, 'class="region" fill="#ffffff"')
const pick = (slot, id) => (id ? whiten(WARDROBE[slot].find((i) => i.id === id)?.svg || '') : '')

function compose({ scene, pet, kid }) {
  return `<svg viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg">
<g class="regions">${pick('scene', scene)}${pick('pet', pet)}<g transform="${CHAR_T}">${character(kid, 'page')}</g></g>
<g class="outlines"></g>
</svg>`
}

const stem = (name) => name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '')

export const CHARACTER_PAGES = Object.fromEntries(
  Object.entries(PAGES).map(([cat, pages]) => [cat, pages.map((p) => ({ stem: stem(p.name), name: p.name, svg: compose(p) }))]),
)
