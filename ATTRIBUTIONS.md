# Art Attributions & Licensing

This project's coloring pictures come from two sources, both free to use and
ship (no ads, tracking, or restrictive licenses):

## Animals, Vehicles, Dolls — Twemoji

These pictures are derived from **Twemoji** (Twitter Emoji), licensed under
**CC‑BY 4.0**.

- Source: https://github.com/twitter/twemoji (npm package `@twemoji/svg`)
- Copyright: © Twitter, Inc. and other contributors
- License: [CC‑BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Each emoji's flat-color SVG was converted into a coloring page: every colored
shape becomes a white, tappable `region`, and a black outline copy of every
shape forms the `outlines` layer. The conversion script lives in the repo
history; re-running it regenerates the files under
`src/art/{animals,vehicles,dolls}/`.

**Attribution requirement:** because Twemoji is CC‑BY, keep this credit in the
shipped app/about screen: *"Emoji artwork from Twemoji, © Twitter, licensed
under CC‑BY 4.0."*

## Houses — Original

The `src/art/houses/*.svg` pictures and the sticker shapes in
`src/art/stickers.js` are **original line art created for this project**,
dedicated to the public domain under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## Adding more pictures

- **From Twemoji:** add the emoji's hex codepoint + a friendly name to the
  conversion script's `SETS` and re-run it. The picker auto-registers any new
  `.svg` via `import.meta.glob` (see `src/art/index.js`).
- **From other sources:** only use CC0 / public-domain or CC‑BY art
  (e.g. OpenClipart, freesvg.org, SVG Repo's CC0 set, Wikimedia PD). Adapt each
  to the `region` / `outline` structure (see any file in `src/art/houses/` for
  the hand-authored reference) and add a credit row below.

| Pictures | Source | License |
|----------|--------|---------|
| `src/art/animals/*`, `src/art/vehicles/*`, `src/art/dolls/*` | Twemoji (© Twitter) | CC‑BY 4.0 |
| `src/art/houses/*`, `src/art/stickers.js` | Original (this repo) | CC0 1.0 |
