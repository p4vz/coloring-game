// Dress-up wardrobe: two dolls (girl & boy) plus clothing/accessory items per
// slot. Everything is original parametric SVG in the project's kawaii style.
// Every shape tagged `region` can be recolored by tapping with a palette
// color; items ship with cheerful preset colors and sparkles.

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

const limb = (x, y, len, w, angle, fill, cls = 'region skin') =>
  `<rect class="${cls}" fill="${fill}" ${S} x="0" y="${-w / 2}" width="${len}" height="${w}" rx="${w / 2}" transform="translate(${x} ${y}) rotate(${angle})"/>`

export const SKIN = '#ffe0c7'

// Arms are angled outward so hands (and gloves!) stay visible beside the dress.
const ARM = { len: 92, w: 17, shL: [129, 148], shR: [171, 148], aL: 118, aR: 62 }
const handPos = (side) => {
  const [x, y] = side === 'L' ? ARM.shL : ARM.shR
  const a = side === 'L' ? ARM.aL : ARM.aR
  return [x + ARM.len * Math.cos(rad(a)), y + ARM.len * Math.sin(rad(a))]
}
const [HLx, HLy] = handPos('L')
const [HRx, HRy] = handPos('R')

// ---------- the doll base -----------------------------------------------------
export function dollSvg(doll = 'girl') {
  return `<svg viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg" class="doll-svg">
    <g data-slot="scene"></g>
    <g data-slot="pet"></g>
    <g data-slot="hair"></g>
    ${limb(...ARM.shL, ARM.len, ARM.w, ARM.aL, SKIN)}
    ${limb(...ARM.shR, ARM.len, ARM.w, ARM.aR, SKIN)}
    <circle class="region skin" fill="${SKIN}" ${S} cx="${HLx.toFixed(0)}" cy="${HLy.toFixed(0)}" r="9"/>
    <circle class="region skin" fill="${SKIN}" ${S} cx="${HRx.toFixed(0)}" cy="${HRy.toFixed(0)}" r="9"/>
    <g data-slot="gloves"></g>
    ${limb(139, 236, 128, 18, 90, SKIN)}
    ${limb(161, 236, 128, 18, 90, SKIN)}
    <ellipse class="region skin" fill="${SKIN}" ${S} cx="136" cy="374" rx="14" ry="10"/>
    <ellipse class="region skin" fill="${SKIN}" ${S} cx="164" cy="374" rx="14" ry="10"/>
    <g data-slot="shoes"></g>
    <path class="region skin" fill="${SKIN}" ${S} d="M141 122 h18 v18 q-9 7 -18 0 z"/>
    <path class="region" fill="#ffffff" ${S} d="M124 138 Q150 152 176 138 L171 244 Q150 252 129 244 Z"/>
    <g data-slot="dress"></g>
    <g data-slot="necklace"></g>
    <circle class="region skin" fill="${SKIN}" ${S} cx="150" cy="86" r="46"/>
    <circle class="region cheek" fill="#ffd1e8" ${S25} cx="126" cy="97" r="7"/>
    <circle class="region cheek" fill="#ffd1e8" ${S25} cx="174" cy="97" r="7"/>
    <circle fill="#2b2b2b" cx="136" cy="86" r="4.5"/>
    <circle fill="#2b2b2b" cx="164" cy="86" r="4.5"/>
    <path fill="none" ${S} d="M141 104 q9 8 18 0"/>
    <g data-slot="face"></g>
    <g data-slot="glasses"></g>
    <g data-slot="earrings"></g>
    <g data-slot="hat"></g>
  </svg>`
}

// ---------- shared item lists ---------------------------------------------------

const HAIR_BASE = (fill) =>
  `<ellipse class="region" fill="${fill}" ${S} cx="150" cy="82" rx="60" ry="62"/>`

const GIRL_HAIR = [
  { id: 'long', name: 'Long', thumbBox: '80 10 140 200', svg:
    HAIR_BASE('#a3622d') +
    `<path class="region" fill="#a3622d" ${S} d="M92 84 q-12 66 6 128 q4 12 18 8 q10 -4 6 -16 q-16 -56 -6 -114 z"/>` +
    `<path class="region" fill="#a3622d" ${S} d="M208 84 q12 66 -6 128 q-4 12 -18 8 q-10 -4 -6 -16 q16 -56 6 -114 z"/>` },
  { id: 'bun', name: 'Bun', thumbBox: '80 -10 140 140', svg:
    HAIR_BASE('#4a3728') +
    `<circle class="region" fill="#4a3728" ${S} cx="150" cy="18" r="21"/>` },
  { id: 'pigtails', name: 'Pigtails', thumbBox: '50 10 200 140', svg:
    HAIR_BASE('#ffd34e') +
    `<circle class="region" fill="#ffd34e" ${S} cx="82" cy="106" r="25"/>` +
    `<circle class="region" fill="#ffd34e" ${S} cx="218" cy="106" r="25"/>` },
  { id: 'curls', name: 'Curls', thumbBox: '60 10 180 140', svg:
    HAIR_BASE('#ff70a6') +
    [[94, 64], [86, 96], [92, 126], [206, 64], [214, 96], [208, 126]]
      .map(([x, y]) => `<circle class="region" fill="#ff70a6" ${S} cx="${x}" cy="${y}" r="17"/>`).join('') },
]

const BOY_HAIR = [
  { id: 'short', name: 'Short', thumbBox: '90 20 120 80', svg:
    `<path class="region" fill="#a3622d" ${S} d="M105 82 Q108 34 150 34 Q192 34 195 82 Q172 60 150 62 Q128 60 105 82 Z"/>` },
  { id: 'spiky', name: 'Spiky', thumbBox: '90 10 120 90', svg:
    `<path class="region" fill="#4a3728" ${S} d="M105 80 L116 40 L130 62 L145 30 L160 60 L176 36 L195 78 Q150 56 105 80 Z"/>` },
  { id: 'curly-boy', name: 'Curly', thumbBox: '85 10 130 80', svg:
    [[112, 62], [132, 46], [152, 40], [172, 46], [190, 62]]
      .map(([x, y]) => `<circle class="region" fill="#2f2f2f" ${S} cx="${x}" cy="${y}" r="16"/>`).join('') },
  { id: 'side', name: 'Side Part', thumbBox: '90 15 120 85', svg:
    `<path class="region" fill="#ffd34e" ${S} d="M104 84 Q102 38 146 34 Q120 52 128 66 Q160 40 196 70 Q198 50 178 40 Q196 48 196 84 Q150 58 104 84 Z"/>` },
]

const GIRL_DRESSES = [
  { id: 'ballgown', name: 'Ball Gown', thumbBox: '70 130 160 240', svg:
    `<path class="region" fill="#d8b4fe" ${S} d="M128 208 Q150 200 172 208 C212 258 222 330 216 340 Q150 362 84 340 C78 330 88 258 128 208 Z"/>` +
    `<path class="region" fill="#9b5de5" ${S} d="M124 140 Q150 154 176 140 L172 212 Q150 222 128 212 Z"/>` +
    sparkle(120, 290) + sparkle(150, 320) + sparkle(180, 290) + sparkle(150, 262) },
  { id: 'party', name: 'Party', thumbBox: '85 130 130 190', svg:
    `<path class="region" fill="#ffd1e8" ${S} d="M130 210 Q150 202 170 210 L196 300 Q150 316 104 300 Z"/>` +
    `<path class="region" fill="#ff70a6" ${S} d="M124 140 Q150 154 176 140 L172 214 Q150 224 128 214 Z"/>` +
    heart(150, 180, 14, '#e0218a') +
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
]

const BOY_CLOTHES = [
  { id: 'tee', name: 'Tee & Shorts', thumbBox: '85 130 130 150', svg:
    `<path class="region" fill="#4d96ff" ${S} d="M124 140 Q150 152 176 140 L174 216 Q150 224 126 216 Z"/>` +
    `<path class="region" fill="#2b6cb0" ${S} d="M126 212 L174 212 L177 262 L155 262 L150 240 L145 262 L123 262 Z"/>` +
    sparkle(150, 178, 7) },
  { id: 'suit', name: 'Suit', thumbBox: '85 130 130 240', svg:
    `<path class="region" fill="#5e60ce" ${S} d="M124 140 Q150 152 176 140 L174 224 Q150 232 126 224 Z"/>` +
    `<rect class="region" fill="#5e60ce" ${S} x="127" y="222" width="22" height="140" rx="9"/>` +
    `<rect class="region" fill="#5e60ce" ${S} x="151" y="222" width="22" height="140" rx="9"/>` +
    `<path class="region" fill="#ff5a5f" ${S25} d="M138 148 L150 156 L162 148 L158 162 L142 162 Z"/>` },
  { id: 'overalls', name: 'Overalls', thumbBox: '85 130 130 240', svg:
    `<rect class="region" fill="#4d96ff" ${S} x="134" y="158" width="32" height="52" rx="6"/>` +
    `<rect class="region" fill="#4d96ff" ${S25} x="126" y="140" width="10" height="30" rx="4" transform="rotate(-14 131 155)"/>` +
    `<rect class="region" fill="#4d96ff" ${S25} x="164" y="140" width="10" height="30" rx="4" transform="rotate(14 169 155)"/>` +
    `<path class="region" fill="#2b6cb0" ${S} d="M126 206 L174 206 L177 288 L155 288 L150 250 L145 288 L123 288 Z"/>` },
  { id: 'hoodie', name: 'Hoodie', thumbBox: '85 125 130 150', svg:
    `<path class="region" fill="#6bcb77" ${S} d="M122 142 Q150 156 178 142 L175 224 Q150 234 125 224 Z"/>` +
    `<path class="region" fill="#4e9e5c" ${S25} d="M132 138 Q150 128 168 138 Q168 150 150 152 Q132 150 132 138 Z"/>` +
    `<rect class="region" fill="#4e9e5c" ${S25} x="136" y="192" width="28" height="20" rx="6"/>` },
  { id: 'hero', name: 'Superhero', thumbBox: '70 130 160 220', svg:
    `<path class="region" fill="#ff5a5f" ${S} d="M126 148 L94 320 Q90 334 108 328 L136 236 Z"/>` +
    `<path class="region" fill="#ff5a5f" ${S} d="M174 148 L206 320 Q210 334 192 328 L164 236 Z"/>` +
    `<path class="region" fill="#4d96ff" ${S} d="M124 140 Q150 152 176 140 L174 240 Q150 250 126 240 Z"/>` +
    `<path class="region" fill="#ffd34e" ${S3} d="${star(150, 190, 17)}"/>` },
  { id: 'raincoat', name: 'Raincoat', thumbBox: '85 130 130 190', svg:
    `<path class="region" fill="#ffd34e" ${S} d="M122 140 Q150 154 178 140 L194 300 Q150 312 106 300 Z"/>` +
    `<circle class="region" fill="#ff9f1c" ${S25} cx="150" cy="190" r="6"/>` +
    `<circle class="region" fill="#ff9f1c" ${S25} cx="150" cy="230" r="6"/>` +
    `<circle class="region" fill="#ff9f1c" ${S25} cx="150" cy="270" r="6"/>` },
]

const SHOES = [
  { id: 'flats', name: 'Flats', thumbBox: '105 350 90 40', svg:
    `<ellipse class="region" fill="#ff5a5f" ${S} cx="136" cy="374" rx="16" ry="11"/>` +
    `<ellipse class="region" fill="#ff5a5f" ${S} cx="164" cy="374" rx="16" ry="11"/>` },
  { id: 'boots', name: 'Boots', thumbBox: '105 320 90 70', svg:
    `<path class="region" fill="#a3622d" ${S} d="M126 330 h20 v38 q4 10 -2 14 h-22 q-6 -4 -2 -14 z"/>` +
    `<path class="region" fill="#a3622d" ${S} d="M154 330 h20 v38 q4 10 -2 14 h-22 q-6 -4 -2 -14 z"/>` },
  { id: 'rainboots', name: 'Rain Boots', thumbBox: '105 315 90 75', svg:
    `<path class="region" fill="#ffd34e" ${S} d="M126 324 h20 v42 q6 10 -2 16 h-24 q-8 -6 -2 -16 z"/>` +
    `<path class="region" fill="#ffd34e" ${S} d="M154 324 h20 v42 q6 10 -2 16 h-24 q-8 -6 -2 -16 z"/>` },
  { id: 'sneakers', name: 'Sneakers', thumbBox: '100 348 100 42', svg:
    `<path class="region" fill="#6bcb77" ${S} d="M120 364 h32 q8 8 0 18 h-32 q-8 -10 0 -18 z"/>` +
    `<path class="region" fill="#6bcb77" ${S} d="M148 364 h32 q8 8 0 18 h-32 q-8 -10 0 -18 z"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="122" cy="374" r="5"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="178" cy="374" r="5"/>` },
  { id: 'ballet', name: 'Ballet', thumbBox: '100 335 100 55', svg:
    `<ellipse class="region" fill="#ffb3d1" ${S} cx="136" cy="374" rx="16" ry="11"/>` +
    `<ellipse class="region" fill="#ffb3d1" ${S} cx="164" cy="374" rx="16" ry="11"/>` +
    `<path fill="none" ${S25} d="M128 366 L144 344 M144 366 L128 344 M156 366 L172 344 M172 366 L156 344"/>` },
  { id: 'sandals', name: 'Sandals', thumbBox: '100 350 100 40', svg:
    `<ellipse class="region" fill="#ff9f1c" ${S} cx="136" cy="378" rx="16" ry="8"/>` +
    `<ellipse class="region" fill="#ff9f1c" ${S} cx="164" cy="378" rx="16" ry="8"/>` +
    `<path fill="none" ${S25} d="M126 372 L146 372 M154 372 L174 372"/>` },
  { id: 'bunny-slippers', name: 'Bunny Slippers', thumbBox: '98 330 104 60', svg:
    `<ellipse class="region" fill="#ffffff" ${S} cx="136" cy="374" rx="18" ry="12"/>` +
    `<ellipse class="region" fill="#ffffff" ${S} cx="164" cy="374" rx="18" ry="12"/>` +
    `<ellipse class="region" fill="#ffd1e8" ${S25} cx="130" cy="356" rx="5" ry="12"/>` +
    `<ellipse class="region" fill="#ffd1e8" ${S25} cx="142" cy="356" rx="5" ry="12"/>` +
    `<ellipse class="region" fill="#ffd1e8" ${S25} cx="158" cy="356" rx="5" ry="12"/>` +
    `<ellipse class="region" fill="#ffd1e8" ${S25} cx="170" cy="356" rx="5" ry="12"/>` },
  { id: 'sparkle-heels', name: 'Sparkle Heels', thumbBox: '100 344 100 48', svg:
    `<ellipse class="region" fill="#ffd34e" ${S} cx="136" cy="374" rx="16" ry="11"/>` +
    `<ellipse class="region" fill="#ffd34e" ${S} cx="164" cy="374" rx="16" ry="11"/>` +
    sparkle(136, 372, 5, '#ffffff') + sparkle(164, 372, 5, '#ffffff') },
]

const HATS = [
  { id: 'none', name: 'None', thumbBox: '120 20 60 60', svg: '' },
  { id: 'tiara', name: 'Tiara', thumbBox: '100 10 100 60', svg:
    `<path class="region" fill="#ffd34e" ${S} d="M116 52 L128 24 L150 44 L172 24 L184 52 Z"/>` +
    `<circle class="region" fill="#ff70a6" ${S25} cx="150" cy="28" r="6"/>` },
  { id: 'pearl-tiara', name: 'Pearl Tiara', thumbBox: '100 10 100 55', svg:
    `<path class="region" fill="#d8b4fe" ${S} d="M114 52 Q150 14 186 52 Q150 42 114 52 Z"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="128" cy="42" r="5"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="150" cy="34" r="6"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="172" cy="42" r="5"/>` },
  { id: 'star-tiara', name: 'Star Tiara', thumbBox: '95 0 110 65', svg:
    `<rect class="region" fill="#4d96ff" ${S} x="112" y="40" width="76" height="12" rx="6"/>` +
    `<path class="region" fill="#ffd34e" ${S25} d="${star(150, 26, 14)}"/>` +
    `<path class="region" fill="#ffd34e" ${S25} d="${star(124, 36, 8)}"/>` +
    `<path class="region" fill="#ffd34e" ${S25} d="${star(176, 36, 8)}"/>` },
  { id: 'crown', name: 'Crown', thumbBox: '100 0 100 65', svg:
    `<path class="region" fill="#ffd34e" ${S} d="M114 56 L118 20 L134 42 L150 12 L166 42 L182 20 L186 56 Z"/>` +
    `<circle class="region" fill="#ff5a5f" ${S25} cx="150" cy="46" r="6"/>` },
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
  { id: 'cap', name: 'Cap', thumbBox: '90 8 130 60', svg:
    `<path class="region" fill="#ff5a5f" ${S} d="M112 54 Q114 16 150 16 Q186 16 188 54 Q150 42 112 54 Z"/>` +
    `<path class="region" fill="#e04347" ${S25} d="M186 46 Q216 46 222 56 Q190 60 184 54 Z"/>` +
    `<circle class="region" fill="#ffffff" ${S25} cx="150" cy="16" r="6"/>` },
  { id: 'party-hat', name: 'Party Hat', thumbBox: '110 -20 80 80', svg:
    `<path class="region" fill="#b388eb" ${S} d="M128 52 L150 -8 L172 52 Q150 62 128 52 Z"/>` +
    sparkle(150, 30, 6) + `<circle class="region" fill="#ffd34e" ${S25} cx="150" cy="-8" r="7"/>` },
]

const NECKLACES = [
  { id: 'none', name: 'None', thumbBox: '120 140 60 40', svg: '' },
  { id: 'pearls', name: 'Pearls', thumbBox: '120 140 60 34', svg:
    [[132, 152], [138, 157], [144, 160], [150, 161], [156, 160], [162, 157], [168, 152]]
      .map(([x, y]) => `<circle class="region" fill="#ffffff" ${S25} cx="${x}" cy="${y}" r="4.5"/>`).join('') },
  { id: 'heart-pendant', name: 'Heart', thumbBox: '118 138 64 46', svg:
    `<path fill="none" ${S25} d="M136 146 q14 16 28 0"/>` + heart(150, 166, 9, '#ff4da6') },
  { id: 'star-pendant', name: 'Star', thumbBox: '118 138 64 46', svg:
    `<path fill="none" ${S25} d="M136 146 q14 16 28 0"/>` +
    `<path class="region" fill="#ffd34e" ${S25} d="${star(150, 166, 9)}"/>` },
  { id: 'beads', name: 'Rainbow Beads', thumbBox: '118 140 64 36', svg:
    [['#ff5a5f', 132, 152], ['#ffd34e', 141, 158], ['#6bcb77', 150, 160], ['#4d96ff', 159, 158], ['#b388eb', 168, 152]]
      .map(([c, x, y]) => `<circle class="region" fill="${c}" ${S25} cx="${x}" cy="${y}" r="6"/>`).join('') },
]

const EARRINGS = [
  { id: 'none', name: 'None', thumbBox: '90 70 40 40', svg: '' },
  { id: 'studs', name: 'Studs', thumbBox: '90 80 120 30', svg:
    `<circle class="region" fill="#ffd34e" ${S25} cx="103" cy="94" r="5"/>` +
    `<circle class="region" fill="#ffd34e" ${S25} cx="197" cy="94" r="5"/>` },
  { id: 'hoops', name: 'Hoops', thumbBox: '85 80 130 45', svg:
    `<path class="region" fill="#ffd34e" ${S25} fill-rule="evenodd" d="M103 96 a9 9 0 1 0 0.01 0 z M103 101 a4.5 4.5 0 1 1 -0.01 0 z"/>` +
    `<path class="region" fill="#ffd34e" ${S25} fill-rule="evenodd" d="M197 96 a9 9 0 1 0 0.01 0 z M197 101 a4.5 4.5 0 1 1 -0.01 0 z"/>` },
  { id: 'star-earrings', name: 'Stars', thumbBox: '85 78 130 40', svg:
    `<path class="region" fill="#ffd34e" ${S25} d="${star(103, 96, 8)}"/>` +
    `<path class="region" fill="#ffd34e" ${S25} d="${star(197, 96, 8)}"/>` },
  { id: 'heart-earrings', name: 'Hearts', thumbBox: '85 78 130 40', svg:
    heart(103, 96, 7, '#ff4da6') + heart(197, 96, 7, '#ff4da6') },
  { id: 'danglies', name: 'Danglies', thumbBox: '85 78 130 50', svg:
    `<circle class="region" fill="#b388eb" ${S25} cx="103" cy="92" r="4"/>` +
    `<circle class="region" fill="#b388eb" ${S25} cx="103" cy="106" r="6"/>` +
    `<circle class="region" fill="#b388eb" ${S25} cx="197" cy="92" r="4"/>` +
    `<circle class="region" fill="#b388eb" ${S25} cx="197" cy="106" r="6"/>` },
]

const GLASSES = [
  { id: 'none', name: 'None', thumbBox: '110 60 80 50', svg: '' },
  { id: 'round', name: 'Round', thumbBox: '105 60 90 45', svg:
    `<circle class="region" fill="#e8f4ff" fill-opacity="0.55" ${S3} cx="135" cy="86" r="14"/>` +
    `<circle class="region" fill="#e8f4ff" fill-opacity="0.55" ${S3} cx="165" cy="86" r="14"/>` +
    `<path fill="none" ${S3} d="M149 86 h2 M121 84 L108 79 M179 84 L192 79"/>` },
  { id: 'sunnies', name: 'Sunglasses', thumbBox: '105 60 90 45', svg:
    `<circle class="region" fill="#2b2b2b" fill-opacity="0.85" ${S3} cx="135" cy="86" r="14"/>` +
    `<circle class="region" fill="#2b2b2b" fill-opacity="0.85" ${S3} cx="165" cy="86" r="14"/>` +
    `<path fill="none" ${S3} d="M149 86 h2 M121 84 L108 79 M179 84 L192 79"/>` },
  { id: 'star-glasses', name: 'Star Glasses', thumbBox: '100 58 100 50', svg:
    `<path class="region" fill="#ffd34e" fill-opacity="0.6" ${S3} d="${star(135, 86, 16)}"/>` +
    `<path class="region" fill="#ffd34e" fill-opacity="0.6" ${S3} d="${star(165, 86, 16)}"/>` +
    `<path fill="none" ${S3} d="M149 86 h2"/>` },
  { id: 'heart-glasses', name: 'Heart Glasses', thumbBox: '100 60 100 48', svg:
    heart(135, 86, 12, '#ff70a6').replace('class="region"', 'class="region" fill-opacity="0.6"') +
    heart(165, 86, 12, '#ff70a6').replace('class="region"', 'class="region" fill-opacity="0.6"') +
    `<path fill="none" ${S3} d="M149 86 h2"/>` },
]

const GLOVES = [
  { id: 'none', name: 'None', thumbBox: '60 200 60 50', svg: '' },
  { id: 'mittens', name: 'Mittens', thumbBox: '60 200 190 50', svg:
    `<circle class="region" fill="#ff5a5f" ${S} cx="${HLx.toFixed(0)}" cy="${HLy.toFixed(0)}" r="12"/>` +
    `<circle class="region" fill="#ff5a5f" ${S} cx="${HRx.toFixed(0)}" cy="${HRy.toFixed(0)}" r="12"/>` },
  { id: 'short-gloves', name: 'Gloves', thumbBox: '60 190 190 60', svg:
    `<circle class="region" fill="#ffffff" ${S} cx="${HLx.toFixed(0)}" cy="${HLy.toFixed(0)}" r="11"/>` +
    `<rect class="region" fill="#ffffff" ${S25} x="-10" y="-9" width="20" height="18" rx="6" transform="translate(${(HLx + 10).toFixed(0)} ${(HLy - 16).toFixed(0)}) rotate(${ARM.aL})"/>` +
    `<circle class="region" fill="#ffffff" ${S} cx="${HRx.toFixed(0)}" cy="${HRy.toFixed(0)}" r="11"/>` +
    `<rect class="region" fill="#ffffff" ${S25} x="-10" y="-9" width="20" height="18" rx="6" transform="translate(${(HRx - 10).toFixed(0)} ${(HRy - 16).toFixed(0)}) rotate(${ARM.aR})"/>` },
  { id: 'long-gloves', name: 'Long Gloves', thumbBox: '55 170 190 80', svg:
    `<rect class="region" fill="#b388eb" ${S} x="0" y="-10" width="50" height="20" rx="10" transform="translate(${(129 + 44 * Math.cos(rad(ARM.aL))).toFixed(0)} ${(148 + 44 * Math.sin(rad(ARM.aL))).toFixed(0)}) rotate(${ARM.aL})"/>` +
    `<circle class="region" fill="#b388eb" ${S} cx="${HLx.toFixed(0)}" cy="${HLy.toFixed(0)}" r="11"/>` +
    `<rect class="region" fill="#b388eb" ${S} x="0" y="-10" width="50" height="20" rx="10" transform="translate(${(171 + 44 * Math.cos(rad(ARM.aR))).toFixed(0)} ${(148 + 44 * Math.sin(rad(ARM.aR))).toFixed(0)}) rotate(${ARM.aR})"/>` +
    `<circle class="region" fill="#b388eb" ${S} cx="${HRx.toFixed(0)}" cy="${HRy.toFixed(0)}" r="11"/>` },
]

const FACIAL_HAIR = [
  { id: 'none', name: 'None', thumbBox: '120 90 60 50', svg: '' },
  { id: 'mustache', name: 'Mustache', thumbBox: '118 88 64 30', svg:
    `<path class="region" fill="#4a3728" ${S25} d="M150 100 q-7 -8 -17 -2 q7 10 17 5 z"/>` +
    `<path class="region" fill="#4a3728" ${S25} d="M150 100 q7 -8 17 -2 q-7 10 -17 5 z"/>` },
  { id: 'curly-mustache', name: 'Fancy Mustache', thumbBox: '108 84 84 34', svg:
    `<path class="region" fill="#2f2f2f" ${S25} d="M150 100 q-10 -8 -20 -2 q-8 5 -4 10 q6 6 10 0 q-6 -2 -2 -5 q8 -4 16 2 z"/>` +
    `<path class="region" fill="#2f2f2f" ${S25} d="M150 100 q10 -8 20 -2 q8 5 4 10 q-6 6 -10 0 q6 -2 2 -5 q-8 -4 -16 2 z"/>` },
  { id: 'goatee', name: 'Goatee', thumbBox: '128 112 44 34', svg:
    `<path class="region" fill="#a3622d" ${S25} d="M140 118 q10 6 20 0 q0 18 -10 22 q-10 -4 -10 -22 z"/>` },
  { id: 'beard', name: 'Big Beard', thumbBox: '100 90 100 70', svg:
    `<path class="region" fill="#a3622d" ${S} d="M108 96 Q112 138 150 148 Q188 138 192 96 Q186 132 150 128 Q114 132 108 96 Z"/>` },
]

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
]

// ---------- doll configs ------------------------------------------------------

export const DOLLS = [
  { id: 'girl', label: 'Girl', icon: '👧' },
  { id: 'boy', label: 'Boy', icon: '👦' },
]

export const WARDROBES = {
  girl: {
    hair: GIRL_HAIR, dress: GIRL_DRESSES, shoes: SHOES, hat: HATS,
    necklace: NECKLACES, earrings: EARRINGS, glasses: GLASSES, gloves: GLOVES,
    pet: PETS, scene: SCENES,
  },
  boy: {
    hair: BOY_HAIR, dress: BOY_CLOTHES, face: FACIAL_HAIR, shoes: SHOES, hat: HATS,
    glasses: GLASSES, gloves: GLOVES, pet: PETS, scene: SCENES,
  },
}

export const SLOTS_BY_DOLL = {
  girl: [
    { id: 'dress', label: 'Dress', icon: '👗' },
    { id: 'hair', label: 'Hair', icon: '💇' },
    { id: 'shoes', label: 'Shoes', icon: '👟' },
    { id: 'hat', label: 'Hats', icon: '👑' },
    { id: 'necklace', label: 'Necklace', icon: '📿' },
    { id: 'earrings', label: 'Earrings', icon: '💎' },
    { id: 'glasses', label: 'Glasses', icon: '👓' },
    { id: 'gloves', label: 'Gloves', icon: '🧤' },
    { id: 'pet', label: 'Pet', icon: '🐶' },
    { id: 'scene', label: 'Scene', icon: '🏞️' },
  ],
  boy: [
    { id: 'dress', label: 'Clothes', icon: '👕' },
    { id: 'hair', label: 'Hair', icon: '💇' },
    { id: 'face', label: 'Beard', icon: '🧔' },
    { id: 'shoes', label: 'Shoes', icon: '👟' },
    { id: 'hat', label: 'Hats', icon: '🧢' },
    { id: 'glasses', label: 'Glasses', icon: '👓' },
    { id: 'gloves', label: 'Gloves', icon: '🧤' },
    { id: 'pet', label: 'Pet', icon: '🐶' },
    { id: 'scene', label: 'Scene', icon: '🏞️' },
  ],
}

export const DEFAULTS_BY_DOLL = {
  girl: { hair: 'long', dress: 'party', shoes: 'flats', hat: 'none', necklace: 'none', earrings: 'none', glasses: 'none', gloves: 'none', pet: 'none', scene: 'none' },
  boy: { hair: 'short', dress: 'tee', face: 'none', shoes: 'sneakers', hat: 'none', glasses: 'none', gloves: 'none', pet: 'none', scene: 'none' },
}
