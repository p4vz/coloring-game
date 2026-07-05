// Dress-up wardrobe: the doll base plus clothing items per slot.
// Everything is original parametric SVG in the same kawaii style as the
// coloring game's princesses/gymnasts. Every shape tagged `region` can be
// recolored by tapping with a palette color; items ship with cheerful preset
// colors and sparkles so the wardrobe looks inviting before any coloring.

const S = 'stroke="#2b2b2b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'
// thinner-stroke variants (duplicate attributes are ignored by the parser, so
// overrides must replace stroke-width rather than append a second one)
const S25 = S.replace('stroke-width="4"', 'stroke-width="2.5"')
const S3 = S.replace('stroke-width="4"', 'stroke-width="3"')

function star(cx, cy, r) {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    d += `${i === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `
  }
  return d + 'Z'
}

// small colorable sparkle stars scattered on an item
const sparkle = (cx, cy, r = 8, fill = '#ffd34e') =>
  `<path class="region" fill="${fill}" ${S25} d="${star(cx, cy, r)}"/>`

const limb = (x, y, len, w, angle, fill, cls = 'region skin') =>
  `<rect class="${cls}" fill="${fill}" ${S} x="0" y="${-w / 2}" width="${len}" height="${w}" rx="${w / 2}" transform="translate(${x} ${y}) rotate(${angle})"/>`

export const SKIN = '#ffe0c7'

// ---------- the doll base (SVG inner markup; slots are empty <g> anchors) ----
export function dollSvg() {
  return `<svg viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg" class="doll-svg">
    <g data-slot="hair"></g>
    ${limb(129, 148, 92, 17, 78, SKIN)}
    ${limb(171, 148, 92, 17, 102, SKIN)}
    <circle class="region skin" fill="${SKIN}" ${S} cx="148" cy="240" r="9"/>
    <circle class="region skin" fill="${SKIN}" ${S} cx="152" cy="240" r="9"/>
    ${limb(139, 236, 128, 18, 90, SKIN)}
    ${limb(161, 236, 128, 18, 90, SKIN)}
    <ellipse class="region skin" fill="${SKIN}" ${S} cx="136" cy="374" rx="14" ry="10"/>
    <ellipse class="region skin" fill="${SKIN}" ${S} cx="164" cy="374" rx="14" ry="10"/>
    <g data-slot="shoes"></g>
    <path class="region skin" fill="${SKIN}" ${S} d="M141 122 h18 v18 q-9 7 -18 0 z"/>
    <path class="region" fill="#ffffff" ${S} d="M124 138 Q150 152 176 138 L171 244 Q150 252 129 244 Z"/>
    <g data-slot="dress"></g>
    <circle class="region skin" fill="${SKIN}" ${S} cx="150" cy="86" r="46"/>
    <circle class="region cheek" fill="#ffd1e8" ${S25} cx="126" cy="97" r="7"/>
    <circle class="region cheek" fill="#ffd1e8" ${S25} cx="174" cy="97" r="7"/>
    <circle fill="#2b2b2b" cx="136" cy="86" r="4.5"/>
    <circle fill="#2b2b2b" cx="164" cy="86" r="4.5"/>
    <path fill="none" ${S} d="M141 102 q9 8 18 0"/>
    <g data-slot="hat"></g>
  </svg>`
}

// ---------- items ------------------------------------------------------------
// Each item: { id, name, thumbBox: 'x y w h' viewBox for its thumbnail, svg }

const HAIR_BASE = (fill) =>
  `<ellipse class="region" fill="${fill}" ${S} cx="150" cy="82" rx="60" ry="62"/>`

export const WARDROBE = {
  hair: [
    { id: 'long', name: 'Long', thumbBox: '80 10 140 200', svg:
      HAIR_BASE('#a3622d') +
      `<path class="region" fill="#a3622d" ${S} d="M92 84 q-12 66 6 128 q4 12 18 8 q10 -4 6 -16 q-16 -56 -6 -114 z"/>` +
      `<path class="region" fill="#a3622d" ${S} d="M208 84 q12 66 -6 128 q-4 12 -18 8 q-10 -4 -6 -16 q16 -56 6 -114 z"/>` },
    { id: 'bun', name: 'Bun', thumbBox: '80 0 140 130', svg:
      HAIR_BASE('#2b2b2b').replace('fill="#2b2b2b"', 'fill="#4a3728"') +
      `<circle class="region" fill="#4a3728" ${S} cx="150" cy="18" r="21"/>` },
    { id: 'pigtails', name: 'Pigtails', thumbBox: '50 10 200 140', svg:
      HAIR_BASE('#ffd34e') +
      `<circle class="region" fill="#ffd34e" ${S} cx="82" cy="106" r="25"/>` +
      `<circle class="region" fill="#ffd34e" ${S} cx="218" cy="106" r="25"/>` },
    { id: 'curls', name: 'Curls', thumbBox: '60 10 180 140', svg:
      HAIR_BASE('#ff70a6') +
      [[94, 64], [86, 96], [92, 126], [206, 64], [214, 96], [208, 126]]
        .map(([x, y]) => `<circle class="region" fill="#ff70a6" ${S} cx="${x}" cy="${y}" r="17"/>`).join('') },
  ],

  dress: [
    { id: 'ballgown', name: 'Ball Gown', thumbBox: '70 130 160 240', svg:
      `<path class="region" fill="#d8b4fe" ${S} d="M128 208 Q150 200 172 208 C212 258 222 330 216 340 Q150 362 84 340 C78 330 88 258 128 208 Z"/>` +
      `<path class="region" fill="#9b5de5" ${S} d="M124 140 Q150 154 176 140 L172 212 Q150 222 128 212 Z"/>` +
      sparkle(120, 290) + sparkle(150, 320) + sparkle(180, 290) + sparkle(150, 262) },
    { id: 'party', name: 'Party', thumbBox: '85 130 130 190', svg:
      `<path class="region" fill="#ffd1e8" ${S} d="M130 210 Q150 202 170 210 L196 300 Q150 316 104 300 Z"/>` +
      `<path class="region" fill="#ff70a6" ${S} d="M124 140 Q150 154 176 140 L172 214 Q150 224 128 214 Z"/>` +
      `<path class="region" fill="#e0218a" ${S3} d="M150 176 q-8 -10 -15 -3 q-5 5 0 10 l15 13 l15 -13 q5 -5 0 -10 q-7 -7 -15 3 z"/>` +
      sparkle(126, 280) + sparkle(174, 280) },
    { id: 'tutu', name: 'Tutu', thumbBox: '80 130 140 170', svg:
      `<path class="region" fill="#2ec4b6" ${S} d="M124 140 Q150 154 176 140 L170 226 Q150 236 130 226 Z"/>` +
      `<path class="region" fill="#a7f0ea" ${S} d="M118 222 L182 222 Q206 250 198 262 Q150 280 102 262 Q94 250 118 222 Z"/>` +
      sparkle(150, 246) + sparkle(120, 244) + sparkle(180, 244) },
    { id: 'stardress', name: 'Star Dress', thumbBox: '85 130 130 200', svg:
      `<path class="region" fill="#4d96ff" ${S} d="M126 140 Q150 154 174 140 L198 308 Q150 324 102 308 Z"/>` +
      `<path class="region" fill="#ffd34e" ${S3} d="${star(150, 250, 18)}"/>` +
      sparkle(120, 290, 6) + sparkle(180, 290, 6) + sparkle(150, 200, 6) },
    { id: 'rainbow', name: 'Rainbow', thumbBox: '80 130 140 200', svg:
      `<path class="region" fill="#ff5a5f" ${S} d="M126 140 Q150 154 174 140 L178 210 L122 210 Z"/>` +
      `<path class="region" fill="#ffd34e" ${S} d="M122 210 L178 210 L188 258 L112 258 Z"/>` +
      `<path class="region" fill="#6bcb77" ${S} d="M112 258 L188 258 L198 306 Q150 320 102 306 Z"/>` +
      sparkle(150, 234, 6) },
    { id: 'mermaid', name: 'Mermaid', thumbBox: '85 130 130 260', svg:
      `<path class="region" fill="#2ec4b6" ${S} d="M126 140 Q150 154 174 140 L168 300 Q150 308 132 300 Z"/>` +
      `<path class="region" fill="#a7f0ea" ${S} d="M132 298 Q150 306 168 298 Q192 330 200 352 Q150 340 100 352 Q108 330 132 298 Z"/>` +
      sparkle(150, 220, 6) + sparkle(138, 262, 6) + sparkle(162, 262, 6) },
  ],

  shoes: [
    { id: 'flats', name: 'Flats', thumbBox: '105 350 90 40', svg:
      `<ellipse class="region" fill="#ff5a5f" ${S} cx="136" cy="374" rx="16" ry="11"/>` +
      `<ellipse class="region" fill="#ff5a5f" ${S} cx="164" cy="374" rx="16" ry="11"/>` },
    { id: 'boots', name: 'Boots', thumbBox: '105 320 90 70', svg:
      `<path class="region" fill="#a3622d" ${S} d="M126 330 h20 v38 q4 10 -2 14 h-22 q-6 -4 -2 -14 z"/>` +
      `<path class="region" fill="#a3622d" ${S} d="M154 330 h20 v38 q4 10 -2 14 h-22 q-6 -4 -2 -14 z"/>` },
    { id: 'sneakers', name: 'Sneakers', thumbBox: '100 348 100 42', svg:
      `<path class="region" fill="#6bcb77" ${S} d="M120 364 h32 q8 8 0 18 h-32 q-8 -10 0 -18 z"/>` +
      `<path class="region" fill="#6bcb77" ${S} d="M148 364 h32 q8 8 0 18 h-32 q-8 -10 0 -18 z"/>` +
      `<circle class="region" fill="#ffffff" ${S25} cx="122" cy="374" r="5"/>` +
      `<circle class="region" fill="#ffffff" ${S25} cx="178" cy="374" r="5"/>` },
    { id: 'sparkle-heels', name: 'Sparkle Heels', thumbBox: '100 344 100 48', svg:
      `<ellipse class="region" fill="#ffd34e" ${S} cx="136" cy="374" rx="16" ry="11"/>` +
      `<ellipse class="region" fill="#ffd34e" ${S} cx="164" cy="374" rx="16" ry="11"/>` +
      sparkle(136, 372, 5, '#ffffff') + sparkle(164, 372, 5, '#ffffff') },
  ],

  hat: [
    { id: 'none', name: 'None', thumbBox: '120 20 60 60', svg: '' },
    { id: 'tiara', name: 'Tiara', thumbBox: '100 10 100 60', svg:
      `<path class="region" fill="#ffd34e" ${S} d="M116 52 L128 24 L150 44 L172 24 L184 52 Z"/>` +
      `<circle class="region" fill="#ff70a6" ${S25} cx="150" cy="28" r="6"/>` },
    { id: 'bow', name: 'Bow', thumbBox: '150 4 110 70', svg:
      `<path class="region" fill="#ff70a6" ${S} d="M198 38 L172 22 L172 54 Z"/>` +
      `<path class="region" fill="#ff70a6" ${S} d="M198 38 L224 22 L224 54 Z"/>` +
      `<circle class="region" fill="#e0218a" ${S25} cx="198" cy="38" r="8"/>` },
    { id: 'flowers', name: 'Flowers', thumbBox: '95 14 110 50', svg:
      `<circle class="region" fill="#ff70a6" ${S} cx="118" cy="42" r="11"/>` +
      `<circle class="region" fill="#ffd34e" ${S} cx="150" cy="32" r="12"/>` +
      `<circle class="region" fill="#b388eb" ${S} cx="182" cy="42" r="11"/>` },
    { id: 'sunhat', name: 'Sun Hat', thumbBox: '80 0 140 70', svg:
      `<ellipse class="region" fill="#ffd34e" ${S} cx="150" cy="52" rx="64" ry="14"/>` +
      `<path class="region" fill="#ffd34e" ${S} d="M116 50 Q118 12 150 12 Q182 12 184 50 Q150 62 116 50 Z"/>` +
      `<rect class="region" fill="#ff70a6" ${S25} x="116" y="40" width="68" height="10" rx="4"/>` },
  ],
}

export const DEFAULTS = { hair: 'long', dress: 'party', shoes: 'flats', hat: 'none' }

export const SLOTS = [
  { id: 'hair', label: 'Hair', icon: '💇' },
  { id: 'dress', label: 'Dress', icon: '👗' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'hat', label: 'Hats', icon: '👑' },
]
