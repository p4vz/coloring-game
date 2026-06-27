# Color Fun! 🎨

An **ad-free coloring game for young kids** (aimed at ~4-year-olds). Pick a
picture from several categories, then **fill between the lines** with a tap,
**brush** freehand, add **stickers**, undo mistakes, and **save** the result.

Built to be **simple and lightweight** so it runs smoothly on cheap / old
tablets. Phase 1 is this web prototype; Phase 2 wraps the same code as a native
app (see below).

## Features

- 🪣 **Fill** — tap any region to color inside the lines (instant, no bleeding)
- 🖌️ **Brush** — freehand drawing in 3 sizes, under the black outlines
- ✨ **Stickers** — stamp stars, hearts, flowers, and dots
- 🎨 **14-color** bright palette (white doubles as an eraser for fills)
- ↩️ **Undo** and 🧽 **Start over**
- 💾 **Save** the finished picture as a PNG
- 🔊 Gentle **sounds** with a mute toggle (remembered between visits)
- 📚 **4 categories**: Animals, Vehicles, Houses, Dolls (~38 pictures)
- 🚫 **No ads, no tracking, no accounts, no external links**

## Run it

Requires Node.js 18+.

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
src/
  main.js            screen switching + coloring screen
  state.js           tool / color / mute state
  audio.js           WebAudio blips
  engine/            board, brush, history (undo/clear), PNG exporter
  ui/                palette, toolbar, picker
  art/               SVG pictures by category + stickers + registry
```

### Where the art comes from

Animals, vehicles, and dolls are derived from **Twemoji** (CC‑BY 4.0): each
emoji's flat-color SVG is converted into a coloring page — every colored shape
becomes a white tappable `region`, with a black outline copy on top. Houses and
the stickers are original CC0 line art. See
[`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) for credits and the (one-line) Twemoji
attribution the shipped app should keep.

### Adding more pictures

Drop a new `.svg` into `src/art/animals|vehicles|houses|dolls/` following the
`region` / `outline` structure in any existing file. It is picked up
automatically (via `import.meta.glob`) — no list to edit.

## Phase 2 — native app (planned)

The build is a self-contained static bundle, so it wraps with
[Capacitor](https://capacitorjs.com/) without code changes:

```bash
npm i -D @capacitor/cli @capacitor/core
npx cap init "Color Fun" com.example.colorfun --web-dir dist
npm run build
npx cap add android   # and / or: npx cap add ios
npx cap copy
```

The only platform-specific shim needed is **saving to the device** — swap the
PNG download in `src/engine/exporter.js` for the Capacitor Filesystem/Share API.

## License

App code and all bundled art are original and released under
**CC0 1.0 (public domain)**. See [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
