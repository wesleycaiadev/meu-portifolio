# Asset Checklist for Codex

This pack is now organized to be extracted directly into the **root of the portfolio repository**.
Production assets are already under `public/assets/`; reference material stays under `reference/` and must never be shipped as public site content.

## 1. Brand

- [x] `public/assets/brand/logo-symbol.svg` — included.
- [ ] `public/assets/brand/logo-wordmark.svg` (or `.png/.webp`) — still missing; use for the WC / Wesley Caia brand composition when supplied.
- [ ] `public/assets/brand/favicon.svg` — optional, still missing.

**Preferred later:** true vector SVG composed of editable paths for advanced morph/extrusion work.

## 2. Personal photos

- [ ] `public/assets/photos/portrait-about.webp` — still missing; primary portrait for About.
- [ ] `public/assets/photos/portrait-hero.webp` — optional; only needed if Hero ultimately uses a portrait.

Do not add all raw face-reference photos if final professional portraits already exist.

## 3. SpaSmooth — included

- [x] `public/assets/projects/spasmooth/spasmooth-hero-desktop.png`
  - Primary desktop hero; strongest first preview / project-object texture.
- [x] `public/assets/projects/spasmooth/spasmooth-hero-mobile.png`
  - Mobile hero; useful for responsive case study and alternate 3D face.
- [x] `public/assets/projects/spasmooth/spasmooth-mobile-menu.png`
  - Mobile navigation/menu state.
- [x] `public/assets/projects/spasmooth/spasmooth-localizacao.png`
  - Location/map section; secondary case-study/detail visual.
- [x] `public/assets/projects/spasmooth/spasmooth-faq-footer.png`
  - FAQ + footer state; supporting detail / case-study visual.

## 4. MF Consultoria — included

- [x] `public/assets/projects/mf-consultoria/mf-consultoria-hero-desktop.png`
  - Primary desktop hero; strongest first preview / project-object texture.
- [x] `public/assets/projects/mf-consultoria/mf-consultoria-hero-mobile.png`
  - Mobile hero; responsive case-study / alternate face.
- [x] `public/assets/projects/mf-consultoria/mf-consultoria-curadoria-processo.png`
  - Dark curation/process section; secondary detail.
- [x] `public/assets/projects/mf-consultoria/mf-consultoria-cta-footer.png`
  - CTA + footer scene; supporting detail.

## 5. Reference material — included

Keep these at repository root under `reference/`, never under `public/`:

- [x] `reference/gustavo/reference-video.mp4`
- [x] `reference/gustavo/reference-contact-sheet.jpg`
- [x] `reference/gustavo/reference-notes-original.md`

They are for motion/layout analysis only. Do not reproduce the reference pixel-for-pixel.

## 6. Still useful later

- [ ] WC / Wesley Caia wordmark artwork.
- [ ] final About portrait.
- [ ] optional alternate Hero portrait.
- [ ] CV PDF if the final portfolio offers a download action.
- [ ] GitHub/live URLs and short factual descriptions for each project.
- [ ] project logos only if they are intentionally shown in the case studies.

## Current repository-ready structure

```text
portfolio/
├── README-FIRST.md
├── PORTFOLIO-SPEC.md
├── ASSET-CHECKLIST.md
├── reference/
│   └── gustavo/
│       ├── reference-video.mp4
│       ├── reference-contact-sheet.jpg
│       └── reference-notes-original.md
├── public/
│   └── assets/
│       ├── brand/
│       │   └── logo-symbol.svg
│       ├── photos/
│       └── projects/
│           ├── spasmooth/
│           │   ├── spasmooth-hero-desktop.png
│           │   ├── spasmooth-hero-mobile.png
│           │   ├── spasmooth-mobile-menu.png
│           │   ├── spasmooth-localizacao.png
│           │   └── spasmooth-faq-footer.png
│           └── mf-consultoria/
│               ├── mf-consultoria-hero-desktop.png
│               ├── mf-consultoria-hero-mobile.png
│               ├── mf-consultoria-curadoria-processo.png
│               └── mf-consultoria-cta-footer.png
└── src/                  # existing app code remains here
```

## Codex rule

Before implementation, Codex must read `PORTFOLIO-SPEC.md` and this checklist, inspect the supplied project screenshots, then implement in the phase order defined in the spec. Missing personal/brand assets must remain explicitly missing; do not fabricate them.
