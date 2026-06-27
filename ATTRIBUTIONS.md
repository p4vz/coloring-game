# Art Attributions & Licensing

All coloring pictures and sticker shapes in this prototype are **original line
art created for this project** and dedicated to the public domain under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). They are simple
geometric SVGs hand-authored to follow the app's `region` / `outline`
convention (separate closed fill-regions plus a black outline layer), which is
what makes crisp tap-to-fill work reliably.

Using only CC0 / original assets keeps the project free of ads, tracking, and
licensing restrictions, so it is safe to ship in the Phase 2 native app.

## Adding more pictures from public sources

When expanding the library, you may use line art from public-domain / CC0
collections such as:

- [OpenClipart](https://openclipart.org/) — public domain
- [SVG Repo](https://www.svgrepo.com/) — filter to the CC0 / Public Domain sets
- [Wikimedia Commons](https://commons.wikimedia.org/) — public-domain SVGs

For each imported file:

1. Confirm the license is CC0 or public domain.
2. Adapt it to the `region`/`outline` structure (see `src/art/animals/cat.svg`
   as the reference): closed shapes in `<g class="regions">` each with
   `class="region"` and `fill="#ffffff"`, and the black line work in
   `<g class="outlines">`.
3. Add a row to the table below crediting the source.

| File | Source | Author | License |
|------|--------|--------|---------|
| `src/art/**/*.svg` (all current pictures) | Original (this repo) | Project | CC0 1.0 |
| `src/art/stickers.js` (star/heart/flower/dot) | Original (this repo) | Project | CC0 1.0 |
