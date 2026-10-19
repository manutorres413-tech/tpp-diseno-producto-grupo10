# Web del proyecto AURA (Grupo 10, Diseño del Producto, UTN FRBA)

This file gives context for working on the AURA website, including from Claude Code cloud sessions.

## What the site is

It is the public page of the AURA project: a medical-grade silicone sleeve that protects cochlear-implant processors and BTE/RIC hearing aids. It is published on GitHub Pages from `main` at the repository root: https://manutorres413-tech.github.io/tpp-diseno-producto-grupo10/

- It is a static site with no build step. Almost everything is in `index.html`, with CSS and JS inline.
- `visor/` holds the 3D viewer (three.js 0.160 loaded from jsdelivr) and its GLB models.
- `media/` holds the commercial, the frames of the scroll-driven placement animation (`scroll/`, `scroll-m/`) and the tour scenes (`recorrido/`).
- `img/` and `graficos/` hold renders, sheets and survey charts.
- The media were generated with `herramientas/preparar_medios.py` from the full project, which lives on Manuel's computer and is not in this repo. Do not regenerate them in the cloud. Each file must stay under 25 MB.
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

## Previewing and publishing

- Local preview: `python -m http.server 8000` and open `http://localhost:8000/`. The viewer only works over HTTP.
- Before publishing, test on desktop and on mobile (375 px wide) and check that the console shows no errors.
- Publishing means committing and pushing to `main`. GitHub Pages can take several minutes, sometimes 10 or more, to update.

## Pending ideas

- 3D viewer: a "tipo media" placement animation (the sleeve slides up from below, through the mouth), a mesh-type selector (ePTFE, grille, textile), the drop cord and a section view.
- When G to J are published again, the text "M2" in Objetivo G has to read "maqueta 2", because "M2" is confused with Módulo 2.
