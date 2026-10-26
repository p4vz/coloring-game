// Modular kawaii characters shared by both games (and the printable sheet).
//
// Every part is drawn in one shared frame: (0, 0) is the center of the neck
// base. Heads (and hats, glasses, hair) sit above it; bodies (outfits) hang
// below it. Every neck is 40 units wide at the base and ends in the same
// collar curve, so any head snaps onto any body.
//
// Paint order for a full character (back to front):
//   hair-back → body → head → face → hair-front → hat → glasses
// Every shape has a solid fill, so later pieces cleanly cover earlier ones.
//
// render(part, mode):
//   'sheet' → pure black-and-white line art (white fills, #000 strokes)
//   'color' → tappable `region` shapes with friendly preset colors
//   'page'  → coloring-book page: tappable `region` shapes, all white

const W = 5 // uniform stroke width

// collar curve shared by every neck and every neckline
export const NECK = { halfWidth: 20, dip: 10 }

// ---------- tiny SVG writer -------------------------------------------------

// role → preset color used in 'color' mode; 'line' is a decorative open line
const ROLE_COLORS = {
  skin: '#ffe0c7',
  hair: '#a0612e',
  white: '#ffffff',
  ink: '#2b2b2b',
  cheek: '#ffc2d6',
}

function attrs(a) {
  return Object.entries(a)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')
}

// A part is a list of [tag, attributes, role]. Roles: skin, hair, a color
// key from the item's palette (main, trim, …), 'ink' (pupils), 'line'.
function draw(shapes, mode, colors = {}) {
  const sheet = mode === 'sheet'
  return shapes
    .map(([tag, a, role = 'main']) => {
      const stroke = sheet ? '#000000' : '#2b2b2b'
      const common = {
        stroke,
        'stroke-width': W,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
      }
      let fill
      let cls
      if (sheet) fill = '#FFFFFF'
      else if (role === 'line') fill = 'none'
      else if (role === 'ink') fill = ROLE_COLORS.ink
      else if (mode === 'page') {
        fill = '#ffffff'
        cls = 'region'
      }
      else {
        fill = colors[role] || ROLE_COLORS[role] || colors.main || '#ffffff'
        cls = 'region'
      }
      return `<${tag} ${attrs({ class: cls, fill, ...common, ...a })}/>`
    })
    .join('')
}

const mirror = (shapes) =>
  shapes.flatMap((s) => [s, [s[0], { ...s[1], transform: `scale(-1 1)${s[1].transform ? ' ' + s[1].transform : ''}` }, s[2]]])

const P = (d, role) => ['path', { d }, role]
const C = (cx, cy, r, role) => ['circle', { cx, cy, r }, role]
const E = (cx, cy, rx, ry, role, transform) => ['ellipse', { cx, cy, rx, ry, transform }, role]
const L = (d) => ['path', { d }, 'line']

function starD(cx, cy, r, inner = 0.45) {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * inner
    const a = (Math.PI / 5) * i - Math.PI / 2
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `
  }
  return d + 'Z'
}
const heartD = (cx, cy, s) =>
  `M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.1} ${cx - s * 0.8} ${cy - s * 1.2} ${cx} ${cy - s * 0.45} C${cx + s * 0.8} ${cy - s * 1.2} ${cx + s * 1.6} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`

// rounded limb from (x, y) at an angle (degrees), length len, thickness w
const limb = (x, y, len, w, angle, role = 'skin') => [
  'rect',
  { x: 0, y: -w / 2, width: len, height: w, rx: w / 2, transform: `translate(${x} ${y}) rotate(${angle})` },
  role,
]
const endOf = (x, y, len, angle) => [
  +(x + len * Math.cos((angle * Math.PI) / 180)).toFixed(1),
  +(y + len * Math.sin((angle * Math.PI) / 180)).toFixed(1),
]

// ---------- head & faces ----------------------------------------------------

const NECK_D = `M-20 -18 L-20 0 Q0 ${NECK.dip} 20 0 L20 -18 Z`
// everything above the neck is drawn 6 units lower than its coordinates say,
// so the chin overlaps the neck stub and the neck stays short
const HEAD_DROP = 'translate(0 6)'
const inHead = (svg) => (svg ? `<g transform="${HEAD_DROP}">${svg}</g>` : '')
const NECKLINE = `Q0 ${NECK.dip} -20 0` // used by bodies, drawn right → left

const NECK_SHAPE = [P(NECK_D, 'skin')]
const HEAD = [C(-43, -52, 9, 'skin'), C(43, -52, 9, 'skin'), E(0, -56, 44, 41, 'skin')]

export const FACES = {
  happy: [
    C(-16, -54, 3, 'ink'),
    C(16, -54, 3, 'ink'),
    E(-28, -41, 7.5, 5, 'cheek'),
    E(28, -41, 7.5, 5, 'cheek'),
    L('M-8 -38 Q0 -30 8 -38'),
  ],
  surprised: [
    C(-16, -54, 6.5, 'white'),
    C(16, -54, 6.5, 'white'),
    C(-16, -53, 1.5, 'ink'),
    C(16, -53, 1.5, 'ink'),
    L('M-24 -70 Q-16 -76 -8 -70'),
    L('M8 -70 Q16 -76 24 -70'),
    E(0, -34, 5, 7, 'ink'),
  ],
  laughing: [
    L('M-23 -52 Q-16 -62 -9 -52'),
    L('M9 -52 Q16 -62 23 -52'),
    E(-29, -41, 7.5, 5, 'cheek'),
    E(29, -41, 7.5, 5, 'cheek'),
    P('M-11 -40 Q0 -40 11 -40 Q9 -27 0 -27 Q-9 -27 -11 -40 Z', 'mouth'),
  ],
  wink: [
    C(-16, -54, 3, 'ink'),
    L('M9 -53 Q16 -47 23 -53'),
    E(-28, -41, 7.5, 5, 'cheek'),
    E(28, -41, 7.5, 5, 'cheek'),
    L('M-8 -38 Q0 -30 8 -38'),
  ],
}

// ---------- hair (back layer goes behind the body, front over the face) -----

const FRINGE_SCALLOP =
  'M-45 -50 C-50 -92 -26 -106 0 -105 C26 -106 50 -92 45 -50 Q40 -70 27 -75 Q17 -66 6 -76 Q-6 -66 -17 -77 Q-33 -72 -45 -50 Z'
const FRINGE_PARTED =
  'M-45 -48 C-50 -92 -26 -107 0 -105 C26 -107 50 -92 45 -48 Q40 -78 3 -88 Q0 -82 -3 -88 Q-40 -78 -45 -48 Z'
const FRINGE_SLEEK =
  'M-45 -52 C-50 -92 -26 -106 0 -105 C26 -106 50 -92 45 -52 Q38 -80 0 -83 Q-38 -80 -45 -52 Z'

export const HAIR = {
  long: {
    name: 'Long',
    back: [
      P('M-44 -64 C-54 -104 -22 -114 0 -113 C22 -114 54 -104 44 -64 C50 -30 56 0 54 32 Q46 42 36 34 Q26 42 16 32 L-16 32 Q-26 42 -36 34 Q-46 42 -54 32 C-56 0 -50 -30 -44 -64 Z', 'hair'),
    ],
    front: [P(FRINGE_SCALLOP, 'hair')],
  },
  princess: {
    name: 'Princess',
    back: [
      P('M-44 -64 C-56 -106 -22 -116 0 -115 C22 -116 56 -106 44 -64 C54 -28 64 10 60 50 Q50 60 40 50 Q32 60 22 50 L-22 50 Q-32 60 -40 50 Q-50 60 -60 50 C-64 10 -54 -28 -44 -64 Z', 'hair'),
    ],
    front: [
      P(FRINGE_PARTED, 'hair'),
      P('M-42 -66 C-53 -48 -55 -22 -50 -2 Q-42 4 -37 -5 C-41 -26 -39 -48 -34 -66 Z', 'hair'),
      P('M42 -66 C53 -48 55 -22 50 -2 Q42 4 37 -5 C41 -26 39 -48 34 -66 Z', 'hair'),
    ],
  },
  pigtails: {
    name: 'Pigtails',
    back: [
      P('M-44 -74 C-74 -84 -82 -46 -66 -26 Q-60 -18 -54 -26 C-62 -42 -58 -60 -44 -64 Z', 'hair'),
      P('M44 -74 C74 -84 82 -46 66 -26 Q60 -18 54 -26 C62 -42 58 -60 44 -64 Z', 'hair'),
    ],
    front: [P(FRINGE_SCALLOP, 'hair'), C(-45, -72, 6, 'trim'), C(45, -72, 6, 'trim')],
  },
  ponytail: {
    name: 'Ponytail',
    back: [P('M20 -98 C58 -116 82 -84 72 -44 C68 -28 56 -24 54 -36 C62 -62 52 -84 24 -86 Z', 'hair')],
    front: [P(FRINGE_SLEEK, 'hair'), E(28, -98, 9, 6, 'trim', 'rotate(-30 28 -98)')],
  },
  bun: {
    name: 'Bun',
    back: [C(0, -110, 17, 'hair')],
    front: [P(FRINGE_SLEEK, 'hair'), P('M-14 -100 Q0 -94 14 -100 L12 -92 Q0 -87 -12 -92 Z', 'trim')],
  },
  short: {
    name: 'Short',
    back: [],
    front: [
      P('M-46 -50 C-52 -92 -26 -108 2 -107 C30 -107 52 -90 46 -50 Q42 -66 34 -70 L28 -62 Q20 -76 8 -74 L0 -64 Q-10 -76 -26 -72 Q-38 -68 -46 -50 Z', 'hair'),
    ],
  },
  curly: {
    name: 'Curly',
    back: [],
    front: [
      P('M-47 -50 A12 12 0 0 1 -46 -74 A14 14 0 0 1 -32 -96 A16 16 0 0 1 -8 -110 A16 16 0 0 1 18 -108 A15 15 0 0 1 38 -94 A13 13 0 0 1 47 -74 A12 12 0 0 1 47 -50 Q36 -66 20 -68 Q14 -60 4 -70 Q-6 -60 -16 -70 Q-34 -66 -47 -50 Z', 'hair'),
    ],
  },
}

// ---------- hats & glasses (head frame) -------------------------------------

export const HATS = {
  crown: { name: 'Crown', shapes: [
    P('M-30 -90 L-36 -126 L-18 -110 L0 -134 L18 -110 L36 -126 L30 -90 Q0 -98 -30 -90 Z', 'main'),
    C(0, -112, 5, 'trim'), C(-21, -101, 3.5, 'trim'), C(21, -101, 3.5, 'trim'),
  ] },
  tiara: { name: 'Tiara', shapes: [
    P('M-34 -88 Q0 -104 34 -88 L30 -96 Q22 -100 14 -102 L0 -120 L-14 -102 Q-22 -100 -30 -96 Z', 'main'),
    C(0, -104, 5, 'trim'),
  ] },
  bow: { name: 'Bow', shapes: [
    P('M24 -98 C10 -122 -8 -104 6 -92 Q16 -88 24 -98 Z', 'main'),
    P('M24 -98 C38 -122 58 -106 44 -92 Q32 -88 24 -98 Z', 'main'),
    C(24, -97, 6, 'trim'),
  ] },
  cap: { name: 'Cap', shapes: [
    P('M-44 -70 Q-74 -72 -80 -62 Q-62 -56 -40 -62 Z', 'trim'),
    P('M-46 -66 C-48 -112 48 -112 46 -66 Q0 -76 -46 -66 Z', 'main'),
    C(0, -103, 4, 'trim'),
  ] },
  explorer: { name: 'Explorer Hat', shapes: [
    E(0, -82, 64, 13, 'main'),
    P('M-36 -84 C-38 -130 38 -130 36 -84 Q0 -92 -36 -84 Z', 'main'),
    P('M-36 -94 Q0 -102 36 -94 L36 -84 Q0 -92 -36 -84 Z', 'trim'),
  ] },
  flower: { name: 'Flower', shapes: [
    ...[0, 72, 144, 216, 288].map((a) => E(30, -106, 7, 11, 'main', `rotate(${a} 30 -96)`)),
    C(30, -96, 6, 'trim'),
  ] },
}

export const GLASSES = {
  round: { name: 'Round Glasses', shapes: [
    C(-16, -54, 11, 'lens'), C(16, -54, 11, 'lens'),
    L('M-5 -56 Q0 -60 5 -56'), L('M-27 -56 L-42 -58'), L('M27 -56 L42 -58'),
  ] },
  star: { name: 'Star Glasses', shapes: [
    P(starD(-17, -54, 15, 0.55), 'main'), P(starD(17, -54, 15, 0.55), 'main'),
    L('M-5 -57 Q0 -61 5 -57'),
  ] },
}

// ---------- jewelry ----------------------------------------------------------

// necklaces sit on the collar (body frame)
const collar = (t, drop = 5) => [-20 + 40 * t, 20 * t * (1 - t) + drop]
export const NECKLACES = {
  pearls: { name: 'Pearls', shapes: [0.08, 0.24, 0.4, 0.56, 0.72, 0.88].map((t) => C(...collar(t).map((v) => +v.toFixed(1)), 4.5, 'main')) },
  heart: { name: 'Heart Locket', shapes: [L('M-17 4 Q0 22 17 4'), P(heartD(0, 22, 8), 'main')] },
  star: { name: 'Star Pendant', shapes: [L('M-17 4 Q0 22 17 4'), P(starD(0, 22, 11), 'main')] },
  medal: { name: 'Gold Medal', shapes: [
    P('M-14 0 L-2 40 L4 38 L-6 0 Z', 'trim'), P('M14 0 L2 40 L-4 38 L6 0 Z', 'trim'),
    C(0, 48, 13, 'main'), P(starD(0, 48, 7), 'main'),
  ] },
}

// earrings hang from the ears (head frame)
export const EARRINGS = {
  studs: { name: 'Studs', shapes: [C(-44, -41, 4.5, 'main'), C(44, -41, 4.5, 'main')] },
  hoops: { name: 'Hoops', shapes: mirror([['path', { d: 'M-52 -34 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 Z M-48 -34 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 Z', 'fill-rule': 'evenodd' }, 'main']]) },
  stars: { name: 'Stars', shapes: [P(starD(-45, -36, 9), 'main'), P(starD(45, -36, 9), 'main')] },
  hearts: { name: 'Hearts', shapes: [P(heartD(-45, -36, 7), 'main'), P(heartD(45, -36, 7), 'main')] },
}

// ---------- bodies / outfits (hang below the neck) ---------------------------

// arms hanging down beside the torso, with hands
function armsDown(sleeveRole = 'main', sleeve = 'short') {
  const shapes = []
  for (const s of [-1, 1]) {
    const x = 30 * s
    const ang = s < 0 ? 104 : 76
    shapes.push(limb(x, 14, 50, 15, ang, 'skin'))
    const [hx, hy] = endOf(x, 14, 50, ang)
    shapes.push(C(hx, hy + 2, 8, 'skin'))
    if (sleeve === 'short') shapes.push(limb(x, 12, 22, 21, ang, sleeveRole))
    if (sleeve === 'long') shapes.push(limb(x, 12, 44, 19, ang, sleeveRole))
    if (sleeve === 'puff') shapes.push(C(x + 3 * s, 12, 12, sleeveRole))
  }
  return shapes
}
export const HANDS_DOWN = [endOf(-30, 14, 50, 104), endOf(30, 14, 50, 76)].map(([x, y]) => [x, y + 2])

function legs(top = 90, bottom = 138) {
  return mirror([P(`M-18 ${top} L-18 ${bottom} L-4 ${bottom} L-4 ${top} Z`, 'skin')])
}

const TORSO = `M-20 0 Q-30 2 -32 8 L-30 64 L30 64 L32 8 Q30 2 20 0 ${NECKLINE} Z`

export const OUTFITS = {
  casualGirl: { name: 'Tee & Skirt', colors: { main: '#ffd34e', bottom: '#ff8fc7', shoe: '#ff5a5f', trim: '#ff5a5f' }, shapes: () => [
    ...legs(88, 140),
    ...mirror([E(-13, 144, 11.5, 8, 'shoe')]),
    P('M-28 56 L28 56 L42 98 Q0 108 -42 98 Z', 'bottom'),
    ...armsDown('main'),
    P(TORSO, 'main'),
    P(heartD(0, 30, 9), 'trim'),
  ] },
  casualBoy: { name: 'Tee & Shorts', colors: { main: '#4d96ff', bottom: '#5b6b8c', shoe: '#ff5a5f', trim: '#ffd34e' }, shapes: () => [
    ...legs(90, 138),
    ...mirror([P('M-3 148 L-3 136 Q-3 132 -8 132 L-16 132 Q-22 132 -24 138 Q-32 140 -32 146 L-32 148 Z', 'shoe')]),
    P('M-31 58 L31 58 L33 98 L3 98 L0 90 L-3 98 L-33 98 Z', 'bottom'),
    ...armsDown('main'),
    P(TORSO, 'main'),
    P(starD(0, 32, 12), 'trim'),
  ] },
  explorer: { name: 'Explorer', colors: { main: '#ffffff', vest: '#8bc34a', bottom: '#c8a165', shoe: '#8d5a3b', trim: '#c8a165' }, shapes: () => [
    ...legs(90, 128),
    ...mirror([P('M-3 148 L-4 122 L-22 122 L-23 138 Q-33 139 -33 148 Z', 'shoe'), L('M-4 130 L-22 130')]),
    P('M-31 58 L31 58 L33 98 L3 98 L0 90 L-3 98 L-33 98 Z', 'bottom'),
    ...armsDown('main', 'long'),
    P(TORSO, 'main'),
    ...mirror([
      P('M-31 8 L-12 6 L-6 64 L-30 64 Z', 'vest'),
      P('M-26 34 L-13 34 L-13 46 L-26 46 Z', 'trim'),
      P('M-20 0 L-11 14 L-2 6 Z', 'main'),
    ]),
  ] },
  gymnast: { name: 'Leotard', colors: { main: '#c86bfa', shoe: '#ffb3d1', trim: '#ffd34e' }, shapes: () => {
    const arms = []
    for (const s of [-1, 1]) {
      const ang = s < 0 ? -140 : -40
      arms.push(limb(26 * s, 12, 56, 14, ang, 'skin'))
      const [hx, hy] = endOf(26 * s, 12, 56, ang)
      arms.push(C(hx, hy, 8, 'skin'))
    }
    return [
      ...mirror([P('M-18 60 L-18 146 L-4 146 L-4 76 Z', 'skin')]),
      ...mirror([E(-11, 148, 12, 7, 'shoe')]),
      ...arms,
      P(`M-20 0 Q-28 2 -28 10 L-26 60 Q-12 62 -3 82 L3 82 Q12 62 26 60 L28 10 Q28 2 20 0 ${NECKLINE} Z`, 'main'),
      P(starD(0, 34, 12), 'trim'),
    ]
  } },
  princess: { name: 'Ball Gown', colors: { main: '#ffb3d1', skirt: '#ff8fc7', shoe: '#c86bfa', trim: '#ffd34e' }, shapes: () => [
    ...mirror([E(-13, 150, 12, 7, 'shoe')]),
    P('M-24 46 Q-44 70 -58 140 Q-30 154 0 150 Q30 154 58 140 Q44 70 24 46 Z', 'skirt'),
    P('M-50 112 Q-40 124 -26 118 Q-14 128 0 120 Q14 128 26 118 Q40 124 50 112 L54 128 Q28 140 0 136 Q-28 140 -54 128 Z', 'main'),
    ...armsDown('main', 'puff'),
    P(`M-20 0 Q-27 2 -28 8 L-24 50 L24 50 L28 8 Q27 2 20 0 ${NECKLINE} Z`, 'main'),
    P('M-25 44 L25 44 L25 54 L-25 54 Z', 'trim'),
    P(starD(-26, 88, 10), 'trim'), P(starD(24, 82, 10), 'trim'),
  ] },
  party: { name: 'Party Dress', colors: { main: '#4fd1c5', skirt: '#4fd1c5', shoe: '#ffd34e', trim: '#ff5a5f' }, shapes: () => [
    ...legs(88, 140),
    ...mirror([E(-13, 144, 11.5, 8, 'shoe')]),
    P('M-26 48 Q-38 70 -46 96 Q-24 106 0 100 Q24 106 46 96 Q38 70 26 48 Z', 'skirt'),
    P('M-44 88 Q-34 96 -22 92 Q-11 100 0 94 Q11 100 22 92 Q34 96 44 88 L46 96 Q24 106 0 100 Q-24 106 -46 96 Z', 'trim'),
    ...armsDown('main', 'none'),
    P(`M-20 0 Q-26 2 -27 8 L-25 52 L25 52 L27 8 Q26 2 20 0 ${NECKLINE} Z`, 'main'),
    P('M0 44 C-14 32 -24 52 -10 54 Q-4 54 0 48 Q4 54 10 54 C24 52 14 32 0 44 Z', 'trim'),
    C(0, 47, 4.5, 'trim'),
  ] },
  pajamas: { name: 'Pajamas', colors: { main: '#b2a4ff', bottom: '#b2a4ff', shoe: '#ffffff', trim: '#ffd34e' }, shapes: () => [
    ...mirror([E(-15, 142, 14, 8, 'shoe')]),
    P('M-31 58 L31 58 L31 134 L-31 134 Z', 'bottom'),
    L('M0 82 L0 134'),
    ...armsDown('main', 'long'),
    P(TORSO, 'main'),
    P('M-32 52 L32 52 L32 64 L-32 64 Z', 'main'),
    P('M18 20 A10 10 0 1 1 18 38 A7 7 0 1 0 18 20 Z', 'trim'),
    P(starD(-14, 34, 8), 'trim'),
  ] },
}

// ---------- held props (frame: (0, 0) is where the hand grips) --------------

export const PROPS = {
  wand: { name: 'Star Wand', shapes: [P('M-3 4 L-3 -46 L3 -46 L3 4 Z', 'trim'), P(starD(0, -60, 17), 'main')] },
  ribbon: { name: 'Ribbon', shapes: [
    P('M-3 4 L-3 -44 L3 -44 L3 4 Z', 'trim'),
    P('M0 -44 C30 -76 58 -48 38 -22 C22 -2 46 18 66 4 L68 12 C40 30 10 10 30 -18 C46 -40 26 -62 4 -38 Z', 'main'),
  ] },
  ball: { name: 'Ball', shapes: [C(0, -20, 22, 'main'), L('M-20 -26 Q0 -10 20 -26'), L('M-8 -40 Q-2 -20 -8 0')] },
  hoop: { name: 'Hoop', shapes: [
    ['path', { d: 'M-34 -34 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0 Z M-27 -34 a27 27 0 1 0 54 0 a27 27 0 1 0 -54 0 Z', 'fill-rule': 'evenodd' }, 'main'],
  ] },
  flower: { name: 'Flower', shapes: [
    P('M-2 4 Q-6 -20 0 -40 L4 -40 Q-1 -20 3 4 Z', 'trim'),
    P('M0 -14 Q-18 -26 -20 -14 Q-12 -6 0 -14 Z', 'trim'),
    ...[0, 72, 144, 216, 288].map((a) => E(0, -60, 8, 12, 'main', `rotate(${a} 0 -48)`)),
    C(0, -48, 7, 'center'),
  ] },
  balloon: { name: 'Balloon', shapes: [
    L('M0 0 Q-8 -20 2 -40 Q8 -54 0 -66'),
    P('M-5 -64 L5 -64 L0 -72 Z', 'main'),
    E(0, -100, 24, 30, 'main'),
  ] },
  medal: { name: 'Medal', shapes: [
    P('M-14 0 L-2 40 L4 38 L-6 0 Z', 'trim'),
    P('M14 0 L2 40 L-4 38 L6 0 Z', 'trim'),
    C(0, 48, 13, 'main'),
    P(starD(0, 48, 7), 'main'),
  ] },
}

// ---------- assembling -------------------------------------------------------

export function head({ face = 'happy', hair = 'long', hat = null, glasses = null }, mode, colors = {}) {
  const c = { hair: ROLE_COLORS.hair, mouth: '#ff8fa3', lens: '#ffffff', trim: '#ff5a5f', ...colors }
  const h = HAIR[hair]
  return {
    back: inHead(h ? draw(h.back, mode, c) : ''),
    front:
      draw(NECK_SHAPE, mode, c) +
      inHead(
        draw(HEAD, mode, c) +
          draw(FACES[face], mode, c) +
          (h ? draw(h.front, mode, c) : '') +
          (hat ? draw(HATS[hat].shapes, mode, { main: '#ffd34e', trim: '#ff5a5f', ...colors.hat }) : '') +
          (glasses ? draw(GLASSES[glasses].shapes, mode, { main: '#ff8fc7', lens: '#bfe6ff', ...colors.glasses }) : ''),
      ),
  }
}

export function body(outfit, mode, colors = {}) {
  const o = OUTFITS[outfit]
  return draw(o.shapes(), mode, { ...o.colors, ...colors })
}

export function prop(name, mode, colors = {}) {
  return draw(PROPS[name].shapes, mode, { main: '#ff5a5f', trim: '#ffd34e', center: '#ffd34e', ...colors })
}

export function hat(name, mode, colors = {}) {
  return inHeadRaw(HATS[name].shapes, mode, { main: '#ffd34e', trim: '#ff5a5f', ...colors })
}

export function glasses(name, mode, colors = {}) {
  return inHeadRaw(GLASSES[name].shapes, mode, { main: '#ff8fc7', lens: '#bfe6ff', ...colors })
}

const inHeadRaw = (...a) => inHead(draw(...a))

// Single head-frame pieces, already dropped into place on the neck.
export function hairPart(name, side, mode, colors = {}) {
  return inHead(draw(HAIR[name][side], mode, { hair: ROLE_COLORS.hair, trim: '#ff5a5f', ...colors }))
}

export function face(name, mode) {
  return inHead(draw(FACES[name], mode, { mouth: '#ff8fa3' }))
}

export function headBase(mode, colors = {}) {
  return draw(NECK_SHAPE, mode, colors) + inHead(draw(HEAD, mode, colors))
}

export function necklace(name, mode, colors = {}) {
  return draw(NECKLACES[name].shapes, mode, { main: '#ffd34e', trim: '#ff5a5f', ...colors })
}

export function earrings(name, mode, colors = {}) {
  return inHeadRaw(EARRINGS[name].shapes, mode, { main: '#ffd34e', ...colors })
}

// Where a hand holding a prop ends up for each outfit (body frame).
export function handsFor(outfit) {
  if (outfit === 'gymnast') return [endOf(-26, 12, 56, -140), endOf(26, 12, 56, -40)]
  return HANDS_DOWN
}

// One whole character, back to front, in the shared frame.
export function character({ outfit, face: f = 'happy', hair = 'long', hat: h = null, glasses: g = null, prop: p = null, medal = false }, mode, colors = {}) {
  const hd = head({ face: f, hair, hat: h, glasses: g }, mode, colors)
  let out = hd.back + body(outfit, mode, colors.outfit) + hd.front
  if (medal) out += necklace('medal', mode)
  if (p) {
    const [hx, hy] = handsFor(outfit)[1]
    out += `<g transform="translate(${hx} ${hy})">${prop(p, mode, colors.prop)}</g>`
    out += draw([C(hx, hy, 8, 'skin')], mode, colors) // the hand wraps around the prop
  }
  return out
}
