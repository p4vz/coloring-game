// Dress-up wardrobe. The kid is built from the shared modular character parts
// (src/art/characters.js): outfit, hair, face, hat, glasses, jewelry, and a
// held prop, plus a pet and a background scene. Every shape tagged `region`
// can be recolored by tapping with a palette color; items ship with cheerful
// preset colors.

import * as K from '../art/characters.js'

const S = 'stroke="#2b2b2b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'
const S25 = S.replace('stroke-width="4"', 'stroke-width="2.5"')
const S3 = S.replace('stroke-width="4"', 'stroke-width="3"')

const rad = (d) => (d * Math.PI) / 180

function star(cx, cy, r) {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    d += `${i === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `
  }
  return d + 'Z'
}
const sparkle = (cx, cy, r = 8, fill = '#ffd34e') =>
  `<path class="region" fill="${fill}" ${S25} d="${star(cx, cy, r)}"/>`
const heart = (cx, cy, s, fill) =>
  `<path class="region" fill="${fill}" ${S25} d="M${cx} ${cy - s * 0.3} q${-s * 0.55} ${-s * 0.7} ${-s} ${-s * 0.15} q${-s * 0.35} ${s * 0.4} 0 ${s * 0.7} l${s} ${s * 0.85} l${s} ${-s * 0.85} q${s * 0.35} ${-s * 0.3} 0 ${-s * 0.7} q${-s * 0.45} ${-s * 0.55} ${-s} ${s * 0.15} z"/>`

const PETS = [
  { id: 'none', name: 'None', thumbBox: '20 300 90 100', svg: '' },
  { id: 'kitty', name: 'Kitty', thumbBox: '18 288 88 106', svg:
    `<path class="region" fill="#ff9f1c" ${S25} d="M78 366 q26 -6 22 -28 q10 24 -16 36 z"/>` +
    `<ellipse class="region" fill="#ff9f1c" ${S} cx="56" cy="366" rx="24" ry="16"/>` +
    `<path class="region" fill="#ff9f1c" ${S25} d="M42 322 L38 302 L54 312 Z"/>` +
    `<path class="region" fill="#ff9f1c" ${S25} d="M70 322 L74 302 L58 312 Z"/>` +
    `<circle class="region" fill="#ff9f1c" ${S} cx="56" cy="332" r="19"/>` +
    `<circle fill="#2b2b2b" cx="50" cy="330" r="2.6"/><circle fill="#2b2b2b" cx="62" cy="330" r="2.6"/>` +
    `<path fill="none" ${S25} d="M52 339 q4 4 8 0 M30 330 h12 M32 338 h10 M70 330 h12 M68 338 h10"/>` },
  { id: 'puppy', name: 'Puppy', thumbBox: '18 288 88 106', svg:
    `<ellipse class="region" fill="#a3622d" ${S} cx="56" cy="366" rx="24" ry="16"/>` +
    `<path class="region" fill="#a3622d" ${S25} d="M80 360 q14 -8 10 -20 q12 14 -4 26 z"/>` +
    `<circle class="region" fill="#a3622d" ${S} cx="56" cy="332" r="19"/>` +
    `<ellipse class="region" fill="#7c4a22" ${S25} cx="40" cy="322" rx="7" ry="13"/>` +
    `<ellipse class="region" fill="#7c4a22" ${S25} cx="72" cy="322" rx="7" ry="13"/>` +
    `<circle fill="#2b2b2b" cx="50" cy="330" r="2.6"/><circle fill="#2b2b2b" cx="62" cy="330" r="2.6"/>` +
    `<circle fill="#2b2b2b" cx="56" cy="337" r="3.4"/><path fill="none" ${S25} d="M52 343 q4 4 8 0"/>` },
  { id: 'bunny', name: 'Bunny', thumbBox: '18 278 88 116', svg:
    `<ellipse class="region" fill="#ffffff" ${S} cx="56" cy="366" rx="22" ry="15"/>` +
    `<ellipse class="region" fill="#ffffff" ${S25} cx="44" cy="300" rx="7" ry="18"/>` +
    `<ellipse class="region" fill="#ffffff" ${S25} cx="68" cy="300" rx="7" ry="18"/>` +
    `<circle class="region" fill="#ffffff" ${S} cx="56" cy="332" r="18"/>` +
    `<circle fill="#2b2b2b" cx="50" cy="330" r="2.6"/><circle fill="#2b2b2b" cx="62" cy="330" r="2.6"/>` +
    `<path fill="none" ${S25} d="M52 339 q4 4 8 0"/>` +
    `<circle class="region" fill="#ffd1e8" ${S25} cx="56" cy="336" r="3.5"/>` },
  { id: 'unicorn', name: 'Unicorn', thumbBox: '14 278 96 116', svg:
    `<ellipse class="region" fill="#ffffff" ${S} cx="56" cy="366" rx="24" ry="16"/>` +
    `<path class="region" fill="#ffd34e" ${S25} d="M56 314 L50 292 L62 292 Z"/>` +
    `<circle class="region" fill="#ffffff" ${S} cx="56" cy="332" r="19"/>` +
    `<circle class="region" fill="#ff70a6" ${S25} cx="40" cy="320" r="7"/>` +
    `<circle class="region" fill="#b388eb" ${S25} cx="34" cy="332" r="7"/>` +
    `<circle class="region" fill="#2ec4b6" ${S25} cx="72" cy="320" r="7"/>` +
    `<circle fill="#2b2b2b" cx="50" cy="332" r="2.6"/><circle fill="#2b2b2b" cx="62" cy="332" r="2.6"/>` +
    `<path fill="none" ${S25} d="M52 340 q4 4 8 0"/>` + sparkle(84, 306, 6) },
  { id: 'dragon', name: 'Dragon', thumbBox: '10 280 100 114', svg:
    `<path class="region" fill="#4e9e5c" ${S25} d="M30 352 L14 336 L36 340 Z"/>` +
    `<path class="region" fill="#4e9e5c" ${S25} d="M82 352 L98 336 L76 340 Z"/>` +
    `<ellipse class="region" fill="#6bcb77" ${S} cx="56" cy="366" rx="24" ry="16"/>` +
    `<path class="region" fill="#6bcb77" ${S25} d="M80 364 q16 -4 14 -18 q12 12 -4 24 z"/>` +
    `<path class="region" fill="#4e9e5c" ${S25} d="M44 316 L48 300 L56 314 Z"/>` +
    `<path class="region" fill="#4e9e5c" ${S25} d="M68 316 L64 300 L56 314 Z"/>` +
    `<circle class="region" fill="#6bcb77" ${S} cx="56" cy="332" r="19"/>` +
    `<circle fill="#2b2b2b" cx="50" cy="330" r="2.6"/><circle fill="#2b2b2b" cx="62" cy="330" r="2.6"/>` +
    `<path fill="none" ${S25} d="M52 339 q4 4 8 0"/>` +
    `<path class="region" fill="#ff9f1c" ${S25} d="M78 330 q10 -6 8 4 q6 -2 4 6 q-8 4 -12 -2 q-2 -5 0 -8 z"/>` },
  { id: 'fishbowl', name: 'Fish Bowl', thumbBox: '18 306 80 92', svg:
    `<ellipse class="region" fill="#c99b6a" ${S25} cx="56" cy="384" rx="26" ry="8"/>` +
    `<circle class="region" fill="#e8f4ff" fill-opacity="0.6" ${S} cx="56" cy="352" r="28"/>` +
    `<path class="region" fill="#a8e4ff" ${S25} d="M30 358 a28 28 0 0 0 52 0 q-26 10 -52 0 z"/>` +
    `<ellipse class="region" fill="#ff9f1c" ${S25} cx="52" cy="352" rx="10" ry="7"/>` +
    `<path class="region" fill="#ff9f1c" ${S25} d="M62 352 L74 344 L74 360 Z"/>` +
    `<circle fill="#2b2b2b" cx="47" cy="350" r="2"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="60" cy="336" r="3"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="54" cy="328" r="2.4"/>` },
]

const SCENES = [
  { id: 'none', name: 'None', thumbBox: '0 0 300 470', svg: '' },
  { id: 'park', name: 'Park', thumbBox: '0 0 300 470', svg:
    `<rect class="region" fill="#c8f0c0" ${S25} x="2" y="400" width="296" height="66" rx="8"/>` +
    `<circle class="region" fill="#ffd34e" ${S} cx="42" cy="48" r="24"/>` +
    `<circle class="region" fill="#6bcb77" ${S25} cx="256" cy="398" r="22"/>` +
    `<circle class="region" fill="#6bcb77" ${S25} cx="282" cy="404" r="16"/>` +
    `<ellipse class="region" fill="#ffffff" ${S25} cx="240" cy="56" rx="26" ry="12"/>` },
  { id: 'castle', name: 'Castle', thumbBox: '0 0 300 470', svg:
    `<rect class="region" fill="#e6e0f8" ${S25} x="2" y="404" width="296" height="62" rx="8"/>` +
    `<path class="region" fill="#d8cff2" ${S25} d="M16 410 V150 h10 v-16 h10 v16 h10 v-16 h10 v16 h10 V410 Z"/>` +
    `<path class="region" fill="#d8cff2" ${S25} d="M234 410 V150 h10 v-16 h10 v16 h10 v-16 h10 v16 h10 V410 Z"/>` +
    `<path class="region" fill="#ff70a6" ${S25} d="M26 134 L26 108 L48 121 Z"/>` +
    `<path class="region" fill="#ff70a6" ${S25} d="M244 134 L244 108 L266 121 Z"/>` },
  { id: 'beach', name: 'Beach', thumbBox: '0 0 300 470', svg:
    `<rect class="region" fill="#a8e4ff" ${S25} x="2" y="330" width="296" height="62" rx="6"/>` +
    `<rect class="region" fill="#ffe9b0" ${S25} x="2" y="390" width="296" height="76" rx="8"/>` +
    `<circle class="region" fill="#ffd34e" ${S} cx="256" cy="46" r="24"/>` },
  { id: 'stage', name: 'Stage', thumbBox: '0 0 300 470', svg:
    `<rect class="region" fill="#c99b6a" ${S25} x="2" y="404" width="296" height="62" rx="8"/>` +
    `<path class="region" fill="#ff5a5f" ${S25} d="M2 2 H60 Q46 120 58 404 H2 Z"/>` +
    `<path class="region" fill="#ff5a5f" ${S25} d="M298 2 H240 Q254 120 242 404 H298 Z"/>` +
    `<path class="region" fill="#e04347" ${S25} d="M2 2 H298 V34 Q150 58 2 34 Z"/>` +
    sparkle(150, 60, 9) },
  { id: 'snow', name: 'Snowy Day', thumbBox: '0 0 300 470', svg:
    `<rect class="region" fill="#ffffff" ${S25} x="2" y="396" width="296" height="70" rx="8"/>` +
    `<circle class="region" fill="#ffffff" ${S} cx="256" cy="384" r="20"/>` +
    `<circle class="region" fill="#ffffff" ${S} cx="256" cy="350" r="14"/>` +
    `<circle fill="#2b2b2b" cx="251" cy="347" r="2.2"/><circle fill="#2b2b2b" cx="261" cy="347" r="2.2"/>` +
    `<path class="region" fill="#ff9f1c" ${S25} d="M256 352 L268 356 L256 359 Z"/>` +
    `<circle fill="#2b2b2b" cx="256" cy="378" r="2.4"/><circle fill="#2b2b2b" cx="256" cy="388" r="2.4"/>` +
    sparkle(36, 56, 7, '#ffffff') + sparkle(90, 30, 6, '#ffffff') +
    sparkle(210, 44, 6, '#ffffff') + sparkle(268, 90, 7, '#ffffff') + sparkle(60, 120, 5, '#ffffff') },
]

// ---------- doll configs ------------------------------------------------------


// The character is drawn in its own frame (0,0 = neck base); this places it
// in the 300×470 stage so it stands on the scenes' ground.
export const CHAR_T = 'translate(150 206) scale(1.18)'
const toStage = (x, y, w, h) =>
  `${(150 + x * 1.18).toFixed(0)} ${(206 + y * 1.18).toFixed(0)} ${(w * 1.18).toFixed(0)} ${(h * 1.18).toFixed(0)}`
const inChar = (svg) => `<g transform="${CHAR_T}">${svg}</g>`

const HAIR_COLORS = { long: '#a0612e', princess: '#ffd34e', pigtails: '#5a3a22', ponytail: '#e0752d', bun: '#2b2b2b', short: '#5a3a22', curly: '#2b2b2b' }

const NONE = (box) => ({ id: 'none', name: 'None', svg: '', thumbBox: box })

const OUTFIT_ITEMS = Object.entries(K.OUTFITS).map(([id, o]) => ({
  id, name: o.name, svg: K.body(id, 'color'),
  thumbBox: id === 'gymnast' ? toStage(-84, -56, 168, 216) : toStage(-80, -12, 160, 172),
}))

const HAIR_ITEMS = Object.entries(K.HAIR).map(([id, h]) => {
  const c = { hair: HAIR_COLORS[id] }
  const back = K.hairPart(id, 'back', 'color', c)
  const front = K.hairPart(id, 'front', 'color', c)
  return { id, name: h.name, svg: front, back, thumb: back + K.headBase('page') + front, thumbBox: toStage(-82, -122, 164, 170) }
})

const FACE_ITEMS = Object.keys(K.FACES).map((id) => ({
  id, name: id[0].toUpperCase() + id.slice(1), svg: K.face(id, 'color'),
  thumb: K.headBase('color') + K.face(id, 'color'), thumbBox: toStage(-56, -100, 112, 104),
}))

const HAT_COLORS = { crown: {}, tiara: { main: '#cfd8ff', trim: '#ff5a5f' }, bow: { main: '#ff8fc7', trim: '#ff5a5f' }, cap: { main: '#ff5a5f', trim: '#4d96ff' }, explorer: { main: '#e8d4a2', trim: '#8d5a3b' }, flower: { main: '#ff8fc7', trim: '#ffd34e' } }
const HAT_ITEMS = [NONE(toStage(-60, -130, 120, 70)), ...Object.entries(K.HATS).map(([id, h]) => ({
  id, name: h.name, svg: K.hat(id, 'color', HAT_COLORS[id]), thumbBox: toStage(-84, -138, 168, 84),
}))]

const GLASSES_ITEMS = [NONE(toStage(-50, -70, 100, 40)), ...Object.entries(K.GLASSES).map(([id, g]) => ({
  id, name: g.name, svg: K.glasses(id, 'color'), thumbBox: toStage(-48, -72, 96, 40),
}))]

const NECKLACE_COLORS = { pearls: { main: '#ffffff' }, heart: { main: '#ff5a5f' }, star: { main: '#ffd34e' }, medal: {} }
const NECKLACE_ITEMS = [NONE(toStage(-30, -6, 60, 70)), ...Object.entries(K.NECKLACES).map(([id, n]) => ({
  id, name: n.name, svg: K.necklace(id, 'color', NECKLACE_COLORS[id]), thumbBox: toStage(-28, -6, 56, 70),
}))]

const EARRING_COLORS = { studs: { main: '#bfe6ff' }, hoops: {}, stars: {}, hearts: { main: '#ff5a5f' } }
const EARRING_ITEMS = [NONE(toStage(-60, -46, 120, 30)), ...Object.entries(K.EARRINGS).map(([id, e]) => ({
  id, name: e.name, svg: K.earrings(id, 'color', EARRING_COLORS[id]), thumb: K.headBase('page') + K.earrings(id, 'color', EARRING_COLORS[id]),
  thumbBox: toStage(-58, -66, 116, 70),
}))]

const PROP_COLORS = { wand: { main: '#ffd34e', trim: '#c86bfa' }, ribbon: { main: '#ff5a5f', trim: '#ffffff' }, ball: { main: '#4d96ff' }, hoop: { main: '#ffd34e' }, flower: { main: '#ff8fc7', trim: '#6bcb77', center: '#ffd34e' }, balloon: { main: '#ff5a5f' }, medal: {} }
const PROP_ITEMS = [NONE('0 0 60 60'), ...Object.entries(K.PROPS).filter(([id]) => id !== 'medal').map(([id, pr]) => ({
  id, name: pr.name, svg: K.prop(id, 'color', PROP_COLORS[id]), thumb: K.prop(id, 'color', PROP_COLORS[id]), thumbBox: '-46 -136 140 150', raw: true,
}))]

// Prop anchor follows the hand of the current outfit (arms up for the leotard).
export function propTransform(outfit) {
  const [x, y] = K.handsFor(outfit)[1]
  return `translate(${x} ${y})`
}
export const handFor = (outfit) => K.handsFor(outfit)[1]

export const WARDROBE = {
  outfit: OUTFIT_ITEMS,
  hair: HAIR_ITEMS,
  face: FACE_ITEMS,
  hat: HAT_ITEMS,
  glasses: GLASSES_ITEMS,
  necklace: NECKLACE_ITEMS,
  earrings: EARRING_ITEMS,
  prop: PROP_ITEMS,
  pet: PETS,
  scene: SCENES,
}

export const SLOTS = [
  { id: 'outfit', label: 'Clothes', icon: '👗' },
  { id: 'hair', label: 'Hair', icon: '💇' },
  { id: 'face', label: 'Face', icon: '😊' },
  { id: 'hat', label: 'Hats', icon: '👑' },
  { id: 'glasses', label: 'Glasses', icon: '👓' },
  { id: 'necklace', label: 'Necklace', icon: '📿' },
  { id: 'earrings', label: 'Earrings', icon: '💎' },
  { id: 'prop', label: 'Hold', icon: '🪄' },
  { id: 'pet', label: 'Pet', icon: '🐶' },
  { id: 'scene', label: 'Scene', icon: '🏞️' },
]

// Quick-start looks; every item works with every look.
export const PRESETS = [
  { id: 'girl', label: 'Girl', icon: '👧', worn: { outfit: 'casualGirl', hair: 'pigtails', face: 'happy', hat: 'none', glasses: 'none', necklace: 'none', earrings: 'none', prop: 'none', pet: 'none', scene: 'none' } },
  { id: 'boy', label: 'Boy', icon: '👦', worn: { outfit: 'casualBoy', hair: 'short', face: 'happy', hat: 'none', glasses: 'none', necklace: 'none', earrings: 'none', prop: 'none', pet: 'none', scene: 'none' } },
]

// The stage SVG: slot anchors in paint order (back to front).
export function dollSvg() {
  return `<svg viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg" class="doll-svg">
    <g data-slot="scene"></g>
    <g data-slot="pet"></g>
    <g transform="${CHAR_T}">
      <g data-slot="hairBack"></g>
      <g data-slot="outfit"></g>
      ${K.headBase('color')}
      <g data-slot="necklace"></g>
      <g data-slot="face"></g>
      <g data-slot="earrings"></g>
      <g data-slot="hair"></g>
      <g data-slot="hat"></g>
      <g data-slot="glasses"></g>
      <g data-slot="prop"></g>
    </g>
  </svg>`
}

// Card thumbnail markup for an item.
export function thumbSvg(slot, item) {
  if (!item.svg) return ''
  const inner = item.thumb ?? item.svg
  const content = item.raw || slot === 'pet' || slot === 'scene' ? inner : inChar(inner)
  return `<svg viewBox="${item.thumbBox}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`
}
