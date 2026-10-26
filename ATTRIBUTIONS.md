# Art Attributions & Licensing

This project's coloring pictures come from a few sources. Note the
**licensing review needed** item for the animals and the **private use only**
item for the Disney Princess pages before sharing the app with anyone.

## Animals — traced from a reference sheet ⚠️ review rights

The `src/art/animals/*.svg` woodland animals (rabbit, hedgehog, fox, bear,
raccoon, skunk, deer, beaver, lynx, owl, frog, mouse) were **vectorized
(auto-traced) from a kawaii animal reference image supplied by the project
owner**. Tracing produces a derivative of that artwork.

The original reference appears to be a third-party illustration set of unknown
license. **Before publishing the app, confirm you have the right to use/trace
these images** (your own artwork, a purchased license that permits it, or a
CC0/CC‑BY source). If you cannot confirm rights, replace them — e.g. with CC0
woodland animals (OpenClipart, freesvg.org) run through the same trace pipeline.

Pipeline: crop each animal → potrace for smooth outlines → connected-component
segmentation of the white areas for tap-to-fill regions (script kept in repo
history).

## Farm & Wild — Monkey Pen coloring books

The `src/art/farm/*` (11 pages) and `src/art/wild/*` (18 pages) pictures are
vectorized from Monkey Pen's free **Domestic Animals** and **Wild Animal**
coloring books (illustrated by Maail Illustrations).

- Source: https://monkeypen.com/
- Terms (from each book's back cover): free for non-commercial use; **if used
  commercially, give credit and link back to https://monkeypen.com/**.
- The app shows "Coloring pages by Monkey Pen" with a link under the Farm and
  Wild tabs. Keep that credit if the app is published.

The pages' "© monkeypen.com" footer strip is cropped from the coloring area
(the credit lives in the app instead). Covers and the promo page were skipped.
Pipeline: rasterize at 110 dpi → potrace thin-line outlines; enclosed white
areas → tap-fill regions (grown 2px under the lines so there are no seams);
solid-black areas → colorable regions. Pages load lazily, one chunk each.

## Dress Up game — original

The doll and all wardrobe items in `src/dressup/wardrobe.js` (hair styles,
dresses, shoes, hats, sparkles) are **original parametric SVG art created for
this project**, dedicated to the public domain under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## Princess — Disney Princess coloring pages ⚠️ private family use only

The `src/art/princess/*` pages (Ariel, Aurora, Belle, Cinderella, Jasmine,
Merida, Moana, Mulan, Pocahontas, Rapunzel, Snow White, Tiana) are vectorized
from Disney's free printable **Disney Princess coloring pages**, "Provided by
Disney Publishing Worldwide".

- **Disney Princess characters, names, and artwork © Disney.** All rights
  belong to Disney. "Disney Princess" and the character names are trademarks
  of Disney.
- **Not affiliated with, sponsored, or endorsed by Disney.**
- These pages were added at the project owner's request **solely for private,
  non-commercial use by their own child**, the same way the free printables
  are meant to be printed and colored at home.
- **Do not publish, sell, or redistribute** an app or site containing these
  pages (no app stores, no sharing the link or APK). This repository and its
  GitHub Pages site are public, so the owner should keep the repository
  private or remove `src/art/princess/` before sharing anything more widely.
- The app shows a "© Disney … private family play only. Not affiliated with
  or endorsed by Disney." line under the Princess tab.

Pipeline: same as Farm & Wild (rasterize → potrace outlines, white areas →
tap-fill regions, solid-black areas → colorable regions); the page footer and
side "© Disney" strip are cropped from the coloring area, and the credit is
shown in the app instead.

## Characters — original (Friends, Gymnastics, Dress Up)

The kids in the **Friends** and **Gymnastics** coloring pages and in the
**Dress Up** game are built from one modular, original character set in
`src/art/characters.js` (heads, 4 expressions, 7 hairstyles, 7 outfits, hats,
glasses, jewelry, and held props). The black-and-white asset sheet is
`assets/character-sheet.svg`. Pets and backgrounds are original too
(`src/dressup/wardrobe.js`). All **CC0 1.0**.

## Vehicles — Twemoji

These pictures are derived from **Twemoji** (Twitter Emoji), licensed under
**CC‑BY 4.0**.

- Source: https://github.com/twitter/twemoji (npm package `@twemoji/svg`)
- Copyright: © Twitter, Inc. and other contributors
- License: [CC‑BY 4.0](https://creativecommons.org/licenses/by/4.0/)

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
| `src/art/animals/*` | Traced from owner-supplied reference | ⚠️ confirm rights |
| `src/art/farm/*`, `src/art/wild/*` | Monkey Pen coloring books | Free; credit + link to monkeypen.com |
| `src/art/vehicles/*` | Twemoji (© Twitter) | CC‑BY 4.0 |
| `src/art/princess/*` | Disney Princess printables (© Disney) | ⚠️ private family use only — do not redistribute |
| `src/art/characters.js`, `src/art/dolls.js`, `src/dressup/*`, `assets/character-sheet.svg`, `src/art/houses/*`, `src/art/stickers.js` | Original (this repo) | CC0 1.0 |
