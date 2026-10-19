# Web del proyecto AURA (Grupo 10, Diseño del Producto, UTN FRBA)

This file gives context for working on the AURA website, including from Claude Code cloud sessions.

## What the site is

It is the public page of the AURA project: a medical-grade silicone sleeve that protects cochlear-implant processors and BTE/RIC hearing aids. It is published on GitHub Pages from `main` at the repository root: https://manutorres413-tech.github.io/tpp-diseno-producto-grupo10/

- It is a static site with no build step. Almost everything is in `index.html`, with CSS and JS inline.
- `visor/` holds the 3D viewer (three.js 0.160 loaded from jsdelivr) and its GLB models.
- `media/` holds the commercial, the frames of the scroll-driven placement animation (`scroll/`, `scroll-m/`) and the tour scenes (`recorrido/`).
- `img/` and `graficos/` hold renders, sheets and survey charts.
- The media were generated with `herramientas/preparar_medios.py` from the full project, which lives on Manuel's computer and is not in this repo. Do not regenerate them in the cloud. Each file must stay under 25 MB.
  - With `PUBLICAR_G_A_J = False` the script skips the G to J media (engineering, plans, packaging, delivery PDFs).
  - It copies only the GLB models into `visor/`. `visor/index.html` is maintained in this repo and must not be overwritten from the full project.
- `DESIGN.md` describes the visual system and `PRODUCT.md` the purpose and audience. Read them before changing the design.

## Rules for the content

- The page is in Rioplatense Spanish with voseo ("elegí", "mirá"), plain and direct. Each figure carries its source and must have the same value everywhere it appears.
- Brand colors: petrol green `#1F5E5B`, sand `#E8DCC8`, graphite `#2B2B2B` and coral `#F08A3C` (accent only, never for body text). Titles use Nunito.
- **Only the stages up to "La funda" are published.** The page goes up to the 3D viewer, and stages G (mock-up), H (engineering), I (costs), J (brand) and Downloads were removed on purpose.
  - The full version is in the `completa` branch, which exists only on Manuel's computer.
  - Do not recreate G to J or upload files from those stages unless the team asks for it.
- **Filler objectives are collapsible.** A·B, both C sections, D and F show only the header with a "Ver todo el objetivo" button (`.btn-plegar`). The content goes in `<div class="plegable" id="pl-<section>" hidden>`. E (mind map and alternatives) and the sleeve stay open.
- Files (PDF, sheets, images) open in a new tab with `target="_blank" rel="noopener"`, never with `download`: the visitor sees them without downloading.
- The legal data on the packaging is fictitious and appears as placeholders (`CUIT XX-XXXXXXXX-X`). Do not invent a company name, address, CUIT or email.

## Official figures (Objetivo C, aligned with sheets G to J)

| Figure | Value |
|---|---|
| Demand curve: share who would pay at least that price per sleeve | $20.000: 83,3 % · $40.000: 59,1 % · $60.000: 36,4 % · $100.000: 10,6 % |
| Optimum price | $40.000 per sleeve. Sold as a two-sleeve kit: **retail price $80.000** |
| Net price excluding VAT | $66.116 |
| Factory price (PSF) | $52.000 (21,3 % trade margin) |
| Maximum variable cost (2:1 rule) | $26.000. Estimated variable cost: $9.550 per kit (18 % of PSF) |
| Onion model | 46.000.000 → 2.300.000 (5 %) → TAM 300.000 → SAM 153.900 (65,1 % × 78,8 %) → SOM 91.000 (59,1 %) |
| Q | **3.000 kits per year** (3,3 % of SOM), about 250 per month |

The curve takes the lower bound of each price range in question 10 of the survey (N = 132).

## 3D viewer (`visor/index.html`)

- Sizes and devices, three views, transparency, silicone color, mesh type (ePTFE, grille, textile), drop cord through the eyelet, section view at Y = 0 and the "Colocar funda" animation. Módulo 2 disables placement, cord and mesh.
- The placement works like putting on a sock, from the top down. The sleeve appears rolled up at the top with the hook already through its hole. Then it unrolls downward, and the mouth opens only as much as each part of the device needs, following the sleeve's own section profile. It must never pass through the device.
  - On the RIC sizes (XS) the rolled sleeve slides down the hook first.
  - On the others the hook runs too close to the front of the device to do that without colliding, so the sleeve fades in already rolled.
- GLB axes: X forward, Y thickness, Z up. The sleeve meshes are subdivided on load so they can bend. Check each change frame by frame on several sizes, also with transparency and the section view.

## Previewing and publishing

- Local preview: `python -m http.server 8000` and open `http://localhost:8000/`. The viewer only works over HTTP.
- Before publishing, run `node herramientas/probar_web.js` with the local server running. It checks desktop and mobile (375 px): sections, collapsibles, official figures, file links, console errors, the viewer and the 404s of the removed files. Pass the published URL as an argument to check the live site.
- Publishing means committing and pushing to `main`. GitHub Pages can take several minutes, sometimes 10 or more, to update.

## Work that needs Manuel's computer

Some things can only be done locally: the `completa` branch, the full project and its media, and the skills in `D:\Proyectos\SKILLS`. Do not try to work around this from the cloud. Write a ready-to-paste prompt for Manuel's local Claude Code session and give it to him in the chat.

## Pending ideas

- 3D viewer: show the hook going through the hole on S/M, M/L and Sonnet too (today the rolled sleeve fades in there); a link that keeps the chosen size, color and mesh; the four sizes side by side.
- Link previews: `og:` and `twitter:` tags with the hero render, so the link shows a card when shared.
- The hero tagline ("…no apaguen tu día") is pending Manuel's decision.
- When G to J are published again, the text "M2" in Objetivo G has to read "maqueta 2", because "M2" is confused with Módulo 2.
