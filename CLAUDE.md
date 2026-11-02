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
- The placement is a "bota" (boot): the sleeve stays still and the device enters through the mouth, top first. It is never rolled up (with 0.8 mm LSR and the glued mesh band it would crease and peel), and the device must never pass through the sleeve.
  - XS (Audéo I-R): the device starts below the mouth, rotated about 14°, and rises while straightening. The receiver wire is flexible and is bent in the animation: it goes in first, up inside the sleeve and out through the hook hole, then takes its curl. The wall stretches only where the device passes further out than the sleeve allows (`pedirLugar`, in polar sections per height).
  - Implants ("abrigo", from the team's drawing): the rigid earhook is removed at the start and clicks back through its hole at the end. The rear lips open; the device starts on its side with its tip (the hook root) under the middle of the mouth; the tip goes in and climbs inside to its place while the device straightens (`caminoPunta`, and `planear` picks the rotation per step that stretches the sleeve least). The lips close over the coil cable.
  - Enabled devices are listed in `COLOCACION_LISTA`: Audéo I-R, Nucleus 8 and Sonnet 2, all checked frame by frame with no new crossings. The Naída M90 (brief crossing at the front-top corner), the Nucleus 7 and the Audéo I-Sphere (both larger than their sleeve, which already overlaps them at rest) do not show the button.
  - Texts that say the implant hook is removed are written but hidden: `class="gancho-sacado" hidden` in `index.html` and `GANCHO_SACADO = false` in the viewer.
- GLB axes: X forward, Y thickness, Z up. The sleeve meshes are subdivided on load so they can bend. Check each change frame by frame on several sizes, also with transparency and the section view. A triangle-intersection check between the sleeve and the device (ignoring the overlaps the CAD models already have at rest) is the reliable test.

## Previewing and publishing

- Local preview: `python -m http.server 8000` and open `http://localhost:8000/`. The viewer only works over HTTP.
- Before publishing, run `node herramientas/probar_web.js` with the local server running. If jsdelivr is blocked (some cloud sessions), run `npm i three@0.160.0` in a scratch folder and pass `THREE_LOCAL=<that folder>/node_modules/three`. It checks desktop and mobile (375 px): sections, collapsibles, official figures, file links, console errors, the viewer and the 404s of the removed files. Pass the published URL as an argument to check the live site.
- Publishing means committing and pushing to `main`. GitHub Pages can take several minutes, sometimes 10 or more, to update.

## Work that needs Manuel's computer

Some things can only be done locally: the `completa` branch, the full project and its media, and the skills in `D:\Proyectos\SKILLS`. Do not try to work around this from the cloud. Write a ready-to-paste prompt for Manuel's local Claude Code session and give it to him in the chat.

## Pending ideas

- 3D viewer: placement for the Naída M90, the Nucleus 7 and the Audéo I-Sphere; a link that keeps the chosen size, color and mesh; the four sizes side by side.
- The scroll-driven placement frames (`media/scroll/`, `media/scroll-m/`) still show the sleeve coming down from above over the hook. They have to be re-rendered on Manuel's computer with the "bota" motion; the text next to them already describes it.
- Link previews: `og:` and `twitter:` tags with the hero render, so the link shows a card when shared.
- The hero tagline ("…no apaguen tu día") is pending Manuel's decision.
- When G to J are published again, the text "M2" in Objetivo G has to read "maqueta 2", because "M2" is confused with Módulo 2.
