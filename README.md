# Elana's Games 🎈

An **ad-free mini-games site for young kids** (aimed at ~4-year-olds). The
landing page is a hub of games; each game lives on its own page:

- **🎨 Coloring** (`/coloring/`) — pick a picture, fill between the lines with
  a tap, brush freehand, add stickers, save the result.
- **👗 Dress Up** (`/dressup/`) — dress the doll (hair, dresses, shoes, hats,
  all with sparkles), recolor any part of any outfit with the palette, and
  doodle or stamp stickers on top with the brush.

Built to be **simple and lightweight** so it runs smoothly on cheap / old
tablets. Phase 1 is this web prototype; Phase 2 wraps the same code as a native
app (see below).

## Coloring features

- 🪣 **Fill** — tap any region to color inside the lines (instant, no bleeding)
- 🖌️ **Brush** — freehand drawing in 3 sizes, under the black outlines
- ✨ **Stickers** — stamp stars, hearts, flowers, and dots
- 🎨 **21-color** bright palette (white doubles as an eraser for fills)
- ↩️ **Undo** and 🧽 **Start over**
- 💾 **Save** the finished picture as a PNG
- 🔊 Gentle **sounds** with a mute toggle (remembered between visits)
- 📚 **8 categories**: Animals, Farm, Wild, Vehicles, Houses, Princess, Friends, Gymnastics (~97 pictures)
- 📖 **Farm, Wild & Princess** are full-page scenes from free printable coloring
  books; they load one page at a time when tapped, so the app stays light
- 🧒 **Friends & Gymnastics** pages use the same modular kids as Dress Up
- 🚫 **No ads, no tracking, no accounts, no external links**

## Run it

Requires Node.js 22+ (Capacitor tooling); the web build alone works on 18+.

```bash
npm install
npm run dev      # open the printed local URL on a tablet or in the browser
```

Build the static site:

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## How it works (why it's light)

Each picture is a single **inline SVG** with two layers: colorable `region`
shapes and a black `outline` layer on top. The app adds `brush` and `sticker`
layers in between.

- **Fill** just sets a region's `fill` — no flood-fill algorithm, no bitmap
  scanning, so it's instant even on weak GPUs and never bleeds past the lines.
- **Brush** appends smoothed SVG paths beneath the outlines.
- **Sounds** are generated with the WebAudio API, and there are **no image or
  audio asset files**, so the whole thing stays tiny.

### Project layout

```
index.html           landing hub (game cards)
coloring/index.html  coloring game entry
dressup/index.html   dress-up game entry
src/
  main.js            coloring: screen switching + coloring screen
  state.js           tool / color / mute state (shared)
  audio.js           WebAudio blips (shared)
  engine/            board, brush, history (undo/clear), PNG exporter
  ui/                palette (shared), toolbar, picker
  art/               SVG pictures by category + stickers + registry
  dressup/           dress-up game: doll + wardrobe + UI
```

### Characters & Dress Up

Both games share one set of modular kawaii kids (`src/art/characters.js`).
Every part is drawn in the same frame — `(0, 0)` is the center of the neck
base, and every neck and neckline is 40 units wide with the same collar curve —
so any head snaps onto any outfit. Parts: a head base, 4 expressions, 7
hairstyles (each with a back layer behind the body and a front fringe), 7
outfits (tee & skirt, tee & shorts, explorer, gymnast leotard with raised arms,
ball gown, party dress, pajamas), hats, glasses, necklaces, earrings, and held
props (wand, ribbon, ball, hoop, flower, balloon). Every shape has a solid fill
so stacked parts cover each other cleanly. `assets/character-sheet.svg` is the
printable black-and-white sheet of all the parts.

In **Dress Up**, Girl/Boy are just starting looks; every item works on any kid.
Slots: Clothes, Hair, Face, Hats, Glasses, Necklace, Earrings, Hold, Pet, and
Scene. Tap a color and then any part to recolor it, or use the brush and
stickers to doodle on top. The look **auto-saves to the device**, and saving a
picture plays a little "Ta-da!" before the PNG downloads.

### Where the art comes from

Animals are **vectorized from a kawaii woodland reference sheet** (potrace
outlines + connected-component segmentation for the fill regions). Vehicles are
derived from **Twemoji** (CC‑BY 4.0). Houses, dolls, and stickers are original
CC0 line art.

> ⚠️ **Disney Princess pages:** the Princess category uses Disney's free
> printable coloring pages (© Disney), included **only for private use by the
> owner's child**. Not affiliated with or endorsed by Disney. Don't publish,
> sell, or share the app/APK with these pages in it; see ATTRIBUTIONS.md. See [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) for credits, the
Twemoji attribution to keep in the shipped app, and an **important note about
confirming rights to the animal artwork before publishing.**

### Adding more pictures

Drop a new `.svg` into `src/art/animals|vehicles|houses/` following the
`region` / `outline` structure in any existing file. It is picked up
automatically (via `import.meta.glob`) — no list to edit.

## Android app (APK)

The site is also packaged as an Android app, **Elana's Games**
(`com.elana.games`), with [Capacitor](https://capacitorjs.com/). Every push to
the deploy branch builds the APK in GitHub Actions and publishes it next to the
site as `elanas-games.apk`; the landing page has a **Get the Android app**
button (hidden when already running inside the app).

Installing on a device: open the site in Chrome on the phone/tablet, tap the
button, open the downloaded file, and allow "Install unknown apps" for Chrome
when Android asks. New builds install as updates over the old one (same
signing key, rising version code), keeping the saved outfit.

- Icon / splash sources: `assets/logo.svg` → `assets/*.png`
  (`npx capacitor-assets generate --android` turns them into launcher icons).
- Signing: `android-signing/debug.keystore` (a debug key, committed on purpose
  so updates keep the same signature). It's fine for sideloading to your own
  devices but not for the Play Store.
- The APK is on the public Pages URL, so anyone with the link could download it.

Build locally (needs Node 22+, JDK 21, Android SDK):

```bash
npm run build
npx cap add android            # first time only; android/ is gitignored
npx capacitor-assets generate --android
npx cap sync android
cd android && ./gradlew assembleDebug
```

## License

App code and all bundled art are original and released under
**CC0 1.0 (public domain)**. See [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
