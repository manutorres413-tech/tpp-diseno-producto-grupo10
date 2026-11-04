# Web del proyecto AURA (Grupo 10, Diseño del Producto, UTN FRBA)

This file gives context for working on the AURA website, including from Claude Code cloud sessions.

## What the site is

It is the public page of the AURA project: a medical-grade silicone sleeve that protects cochlear-implant processors and BTE/RIC hearing aids. It is published on GitHub Pages from `main` at the repository root: https://manutorres413-tech.github.io/tpp-diseno-producto-grupo10/

- It is a static site with no build step. Almost everything is in `index.html`, with CSS and JS inline.
- `visor/` holds the 3D viewer (three.js 0.160 loaded from jsdelivr) and its GLB models.
- `media/` holds the commercial, the frames of the scroll-driven placement animation (`scroll/`, `scroll-m/`) and the tour scenes (`recorrido/`).
  - The scroll frames are the exception to the next rule: they are rendered in this repo from the 3D viewer (XS placement, Audéo I-R) with `node herramientas/renderizar_colocacion.js` (local server running; `THREE_LOCAL` as in `probar_web.js`). Re-render them whenever the XS placement changes, and then change `data-version` on `#colocacion` in `index.html` so browsers drop the cached frames.
- `img/` and `graficos/` hold renders, sheets and survey charts.
- The media were generated with `herramientas/preparar_medios.py` from the full project, which lives on Manuel's computer and is not in this repo. Do not regenerate them in the cloud. Each file must stay under 25 MB.
  - `PUBLICAR_G_H = True` generates the G and H media (exploded view, engineering sheets, the four sizes' plans and Módulo 2's). With `PUBLICAR_I_J = False` it skips the I and J media (packaging, delivery PDF, report, plans zip).
  - It copies only the GLB models into `visor/`. `visor/index.html` is maintained in this repo and must not be overwritten from the full project.
- `DESIGN.md` describes the visual system and `PRODUCT.md` the purpose and audience. Read them before changing the design.

## Rules for the content

- The page is in Rioplatense Spanish with voseo ("elegí", "mirá"), plain and direct. Each figure carries its source and must have the same value everywhere it appears.
- Brand colors: petrol green `#1F5E5B`, sand `#E8DCC8`, graphite `#2B2B2B` and coral `#F08A3C` (accent only, never for body text). Titles use Nunito.
- **The stages up to I are published** (I since 2026-11-03). After the 3D viewer come G (mock-up), H (engineering) and I (costs), all open (not collapsible). I is HTML only and needs no media. J (brand) and Downloads were removed on purpose.
  - The full version is in the `completa` branch, which exists only on Manuel's computer.
  - Do not recreate J or Downloads or upload their files unless the team asks for it.
  - Módulo 2 (redesigned 2026-11-02): the outer face is closed and the skin face is open, so nothing sits between the magnet and the skin and the magnet keeps its strength. The cable goes in sideways through a notch, without unplugging it. There is no cable sleeve, and the ring is 3D polyester mesh. The coil is already part of the Nucleus 8 IP68 system, so the sleeve does not seal it; never say that it waterproofs the coil. The photo `A_SM_conjunto_modulo2.jpg` and the tour clip `conjunto` still show the old version (open outer face); they will be re-rendered later on Manuel's computer.
  - The band membrane is **ePTFE only**, decided by the team on 2026-11-02. It is acoustic, hydrophobic and oleophobic, has a polyester backing and silicone adhesive, and is glued and replaceable. Polyester mesh and grille were compared against the brief and discarded: the mesh soaks up sweat and lets fine sand through, and the grille lets drops through and is rigid. Do not bring back a choice of meshes.
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

- Sizes with one device each (Audéo I-R, Nucleus 8, Naída M90, Sonnet 2; the device name shows only in the label at the top). The Audéo I-Sphere and the Nucleus 7 are hidden on purpose, because they are almost the same as the I-R and the Nucleus 8, only bigger. Their GLBs stay in `visor/GLB/`. Three views, transparency, silicone color, the band marked with a note (ePTFE only, graphite), the drop cord (threaded step by step when switched on), a link that keeps size, color, view and toggles in the hash (`#talle=MLS&corte=1`), section view at Y = 0 and the "Colocar funda" animation. Módulo 2 disables placement, cord and mesh.
- The placement is a "bota" (boot): the sleeve stays still and the device enters through the mouth, top first. It is never rolled up (with 0.8 mm LSR and the glued mesh band it would crease and peel), and the device must never pass through the sleeve.
  - XS (Audéo I-R): the device starts below the mouth, rotated about 14°, and rises while straightening. The receiver wire is flexible and is bent in the animation: it goes in first, up inside the sleeve and out through the hook hole, then takes its curl. The wall stretches only where the device passes further out than the sleeve allows (`pedirLugar`, in polar sections per height).
  - Implants ("abrigo", from the team's drawing): the rigid earhook is removed at the start and clicks back through its hole at the end. The rear lips open; the device starts tilted about 30°, like XS, with its tip (the hook root) under the middle of the mouth; the tip goes in and climbs inside to its place while the device straightens (`caminoPunta`, and `planear` picks the rotation per step that stretches the sleeve least). The lips close over the coil cable.
  - Enabled devices are listed in `COLOCACION_LISTA`. The team wants just one of each kind: the Audéo I-R (XS, boot) and the Sonnet 2 (M/L, abrigo). The Nucleus 8 also passes the frame-by-frame check and can be enabled by adding it to the list; the Naída M90 has no animation. Devices without animation do not show the button.
  - Texts that say the implant hook is removed are written but hidden: `class="gancho-sacado" hidden` in `index.html` and `GANCHO_SACADO = false` in the viewer.
- GLB axes: X forward, Y thickness, Z up. The sleeve meshes are subdivided on load so they can bend. Check each change frame by frame on several sizes, also with transparency and the section view. A triangle-intersection check between the sleeve and the device (ignoring the overlaps the CAD models already have at rest) is the reliable test.

## Previewing and publishing

- Local preview: `python -m http.server 8000` and open `http://localhost:8000/`. The viewer only works over HTTP.
- Before publishing, run `node herramientas/probar_web.js` with the local server running. If jsdelivr is blocked (some cloud sessions), run `npm i three@0.160.0` in a scratch folder and pass `THREE_LOCAL=<that folder>/node_modules/three`. It checks desktop and mobile (375 px): sections, collapsibles, official figures, file links, console errors, the viewer and the 404s of the removed files. Pass the published URL as an argument to check the live site.
- Publishing means committing and pushing to `main`. GitHub Pages can take several minutes, sometimes 10 or more, to update.

## Work that needs Manuel's computer

Some things can only be done locally: the `completa` branch, the full project and its media, and the skills in `D:\Proyectos\SKILLS`. Do not try to work around this from the cloud. Write a ready-to-paste prompt for Manuel's local Claude Code session and give it to him in the chat.

## Pending ideas

- 3D viewer: the four sizes side by side.
- The hero tagline ("…no apaguen tu día") is pending Manuel's decision.
- G still needs the mock-up results (photos, times, the acoustic and splash tests) once the team has them.
