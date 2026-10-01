# Wesley Caia — Portfolio Experience Specification

> **Status:** source of truth for visual direction, interaction, motion and implementation decisions.
> **Goal:** build an original portfolio inspired by the interaction grammar of the Gustavo Sextaro reference, without cloning its layout, branding, copy or exact effects.

---

## 1. Core concept

The site must feel like one continuous experience rather than a stack of disconnected sections.

The motion language is:

**deformation → expansion → transition → blur/reveal → cursor trail → spatial transformation → rest**

The visitor should feel that the same visual system evolves as they move through the portfolio.

The interface must avoid the common AI/futuristic look: no excessive neon, no generic glowing particles, no random 3D objects, no cyberpunk palette, no effect added without narrative purpose.

---

## 2. Reference files and how to use them

### `reference/gustavo/reference-video.mp4`
Primary reference for:
- interaction pacing;
- logo/pointer relationship;
- section transitions;
- project-list hover behavior;
- cursor trail inertia;
- transition from 2D project previews into spatial/3D presentation;
- visual rhythm between intense and quiet moments.

**Do not reproduce the reference pixel-for-pixel.** Extract principles and rebuild them around Wesley's own identity and content.

### `reference/gustavo/reference-contact-sheet.jpg`
Fast visual index of the video. Key states:
- 0–24 s: bright hero with centered interactive identity;
- ~28 s: identity scales beyond viewport and becomes a transition;
- ~32–44 s: dark about section, large editorial typography, portrait reveal;
- ~50–68 s: editorial project list + dynamic preview + delayed cursor trail;
- ~74 s: visual rest / manifesto;
- ~80 s: project content reorganized into a spatial object;
- ~86–92 s: project/case presentation.

### `reference/gustavo/reference-notes-original.md`
Use only as a secondary foundation for:
- accessibility;
- semantic UI states;
- focus behavior;
- reduced motion;
- responsive rules;
- spacing/token discipline.

It is not the source of truth for Wesley's motion choreography.

---

## 3. Brand assets

### Required
- `public/assets/brand/logo-symbol.svg` — primary symbol.
- `public/assets/brand/logo-wordmark.*` — Wesley Caia / WC wordmark or brand composition.

### Important implementation note
The symbol must be treated as Wesley's visual identity, not as a decorative 3D prop.

Preferred future version: a true vector SVG composed of editable `<path>` elements. If the supplied SVG is raster-embedded, it can still be used as a texture/mask initially, but path morphing/extrusion should wait for a true vector version.

---

## 4. Visual language

### Palette
Primary direction:
- off-white / warm white for bright scenes;
- deep black / graphite for dark scenes;
- neutral greys;
- restrained metallic/soft highlight if needed.

Avoid:
- orange as signature color;
- neon blue/purple gradients;
- strong chromatic glow;
- RGB glitch styling;
- noisy particle fields.

### Texture
Use subtle texture only:
- fine grain/noise;
- light material texture on 3D surfaces;
- controlled blur;
- soft tonal gradients if needed.

Texture must never compete with typography or project imagery.

### Typography
Use an editorial pairing:
- modern grotesk/sans for primary information;
- expressive serif italic for selected emphasis words or phrases.

Do not copy the exact font family from the reference unless independently licensed/selected.

Desired qualities:
- large display typography;
- generous whitespace;
- compact supporting text;
- restrained labels;
- no decorative microcopy such as “Front-end / Motion / Production” unless it serves actual content.

---

## 5. Global motion rules

### Principles
1. Every major motion must have a narrative purpose.
2. Motion should feel physically connected to the user's input.
3. Scroll animations should use progress, not arbitrary autoplay loops.
4. Pointer interaction should use damping/spring behavior rather than immediate snapping.
5. Do not run multiple competing hero effects at the same time.
6. Use visual rest after high-impact sequences.
7. Reduced-motion mode must preserve comprehension with simplified transitions.

### Suggested stack
- Next.js / React / TypeScript
- GSAP
- ScrollTrigger
- Lenis
- Three.js / React Three Fiber or direct Three.js where appropriate
- WebGL/shaders only where they materially improve deformation, trail or spatial project transitions

### Performance goals
- no horizontal overflow;
- stable layout during animation;
- avoid expensive full-screen effects when offscreen;
- pause or reduce WebGL work when tab is hidden;
- mobile fallback for complex pointer-only interactions;
- test desktop, tablet and phone independently.

---

# 6. Storyboard

## SCENE 01 — Hero / identity

### Initial state
- bright/off-white canvas;
- minimal header;
- Wesley's identity dominates the center;
- navigation is secondary;
- no portrait in the hero by default.

### Brand behavior
The symbol is interactive.

Do **not** use a generic CSS tilt as the primary interaction.

Preferred behavior:
- pointer creates a radial influence field;
- nearby geometry/texture deforms as if pushed or pulled;
- response has spring/damping;
- deformation follows pointer position smoothly;
- on pointer leave, symbol returns naturally rather than snapping.

Possible implementations:
- subdivided WebGL plane + vertex displacement;
- shader displacement using pointer coordinates;
- mesh/image warp if true vector paths are unavailable.

### Navigation microinteraction
Suggested links:
- Projetos
- Sobre
- Contato

Hover:
- boundary/underline becomes clearer;
- 1–2 px controlled movement is acceptable;
- optional arrow/icon reveal;
- 250–350 ms response range;
- no glow.

---

## SCENE 02 — Identity transition

This is the first major impact moment.

### Scroll choreography
As scroll begins:
1. secondary UI loses emphasis;
2. the symbol remains visually dominant;
3. symbol scales rapidly but smoothly;
4. geometry exceeds viewport boundaries;
5. dark regions/surfaces of the symbol occupy the screen;
6. transition ends on a dark canvas.

The transition must feel like **the identity itself caused the scene change**, not like a separate black overlay faded in.

### Technical guidance
Drive transform from a pinned ScrollTrigger timeline.
Avoid simple `background-color` crossfade as the main transition.

---

## SCENE 03 — About

### Composition
- dark scene;
- large editorial headline;
- portrait becomes a strong secondary focal point;
- supporting biography remains concise.

### Typography behavior
Use sans + serif italic contrast selectively.
Example structure only, not final copy:

> Eu crio experiências digitais que unem **design**, desenvolvimento e *identidade*.

### Portrait reveal
Portrait should not merely fade in.

Preferred sequence:
- enters slightly offset;
- starts with directional/strong blur;
- motion and blur decrease together;
- reaches final position in sharp focus.

Conceptual blur progression:
`20px → 12px → 5px → 0px`

Avoid glitch/RGB split.

---

## SCENE 04 — Selected projects / editorial list

Do not default to a grid of conventional cards.

### Layout concept
Left/primary column:
- project index;
- project title;
- optional short descriptor.

Right/secondary area:
- large dynamic visual preview.

Initial projects:
- SpaSmooth
- MF Consultoria

### Hover behavior
When a project becomes active:
- active title gains contrast;
- inactive titles recede but remain readable;
- preview changes smoothly;
- preview image transition may combine blur, scale and opacity.

Suggested transition:
- current: scale 1 → 0.98, blur 0 → 8, opacity 1 → 0;
- next: scale 1.03 → 1, blur 8 → 0, opacity 0 → 1;
- ~350–500 ms.

No abrupt DOM swap.

---

## SCENE 05 — Pointer trail

A delayed line/ribbon follows the pointer around the project experience.

### Important behavior
The trail must not stick rigidly to the cursor.
It needs visible inertia.

Conceptual interpolation:
`current += (target - current) * damping`

Use multiple delayed points feeding a smooth spline/curve.

### Wesley-specific interpretation
Do not copy the exact thick white trail from the reference.
Create a trail influenced by the geometry/curvature of Wesley's mark:
- thinner;
- cleaner;
- neutral white/grey;
- soft edge;
- gentle decay;
- no neon glow.

Possible implementation:
- Canvas 2D for lightweight version;
- WebGL line/ribbon for richer version.

Mobile/tablet:
- disable pointer-follow behavior;
- replace with scroll-reactive or ambient line motion only if useful.

---

## SCENE 06 — Project object / 3D transformation

This is the second major impact moment.

The earlier simple "image in perspective + tilt" approach is insufficient.

### Required concept
Create one spatial object/system that can hold multiple project surfaces.

Possible structure:
- six-face object;
- modular folded panels;
- architectural display object;
- custom geometry derived from the brand.

Content surfaces may include:
- SpaSmooth hero screenshot;
- SpaSmooth UI detail;
- SpaSmooth mobile view;
- MF Consultoria hero;
- MF Consultoria UI detail;
- stack/process/process visual.

### Scroll transformation
Example sequence:
1. active project preview gains depth;
2. flat plane reveals thickness;
3. secondary surfaces unfold;
4. camera shifts slightly laterally;
5. structure rotates/recomposes;
6. another project face becomes dominant;
7. object settles before the next content phase.

Do not keep a meaningless infinite rotation loop.

---

## SCENE 07 — Visual rest / manifesto

After the project transformation, reduce visual intensity.

Use:
- very simple canvas;
- one strong sentence;
- optional minimal CTA;
- little or no complex 3D motion.

Purpose: pacing and contrast.

Final text is not defined yet. Do not invent permanent marketing copy without review.

---

## SCENE 08 — Expertise / process

Do not use a generic grid of 15 glowing skill cards.

### Expertise
Possible editorial treatment:
- real technology logos;
- text-first arrangement;
- small responsive interaction;
- project/brand object may react subtly in background.

Known technologies may include:
- JavaScript
- TypeScript
- React / Next.js
- Supabase
- PostgreSQL
- SQLite
- Figma
- Canva

Only include technologies actually confirmed for the portfolio.

### Process
Concept:
**Entender → Estruturar → Projetar → Construir → Refinar → Entregar**

Avoid six identical cards.
Instead, let a visual object or timeline change state through each step.

---

## SCENE 09 — Contact / closure

### Composition
Return to minimalism.

Use:
- strong short invitation;
- icons for WhatsApp, LinkedIn, email, GitHub and CV where relevant;
- avoid verbose footer microcopy.

### Final motion
The visual system should converge back toward the identity.
Possible closure:
- fragments/lines/panels return;
- composition simplifies;
- Wesley's symbol appears as the final stable form.

This should echo the opening without literally replaying it.

---

# 7. Case study transition

When opening a project, avoid a generic hard route change when technically feasible.

Preferred sequence:
1. selected project/object becomes the foreground;
2. camera or content surface scales/rotates;
3. selected face fills the viewport;
4. transition resolves into the case-study page.

The home and case should feel connected.

---

# 8. Case-study layout

Recommended first-screen structure:
- project name;
- concise description;
- stack/tags;
- GitHub/live link where available;
- large main screenshot;
- smaller supporting thumbnails/details.

Below:
- Problema
- Processo
- Design
- Desenvolvimento
- Resultado

Only present claims and metrics that are actually available.

---

# 9. Responsive behavior

Desktop is the richest motion experience.

Tablet:
- preserve hierarchy;
- reduce camera travel;
- reduce pointer-specific dependencies;
- simplify pinned sequences when needed.

Mobile:
- no essential interaction may depend on hover;
- pointer deformation becomes touch-safe or ambient;
- 3D object may use reduced geometry/texture resolution;
- project list becomes tap-driven;
- avoid long pinned sections that trap scrolling;
- preserve the story even if some WebGL effects are disabled.

---

# 10. Accessibility / reduced motion

For `prefers-reduced-motion: reduce`:
- stop nonessential looping motion;
- replace deformation with simple emphasis;
- replace complex 3D scene travel with cuts/crossfades;
- keep project switching and navigation fully usable;
- maintain visible focus;
- preserve reading order and semantic HTML.

Use the supplied documentation reference for general keyboard/focus/state requirements, but this file is the motion source of truth.

---

# 11. Explicit anti-patterns

Do not add:
- neon purple/blue cyberpunk look;
- orange accent carried over from unrelated projects;
- glowing 3D sphere/cube just for decoration;
- random particles;
- excessive glassmorphism;
- constant camera motion;
- text that exists only to sound like a creative agency;
- generic skill-card grids;
- repeated effect on every section;
- hover-only access to essential content;
- infinite WebGL loops when the scene is not visible.

Do not copy:
- Gustavo's logo;
- Gustavo's copy;
- his exact project names/content;
- his exact composition measurements;
- his exact trail geometry;
- his exact transition timing.

Use the reference as a behavioral and pacing study.

---

# 12. Asset contract

Production assets are already organized under `public/assets/` and should be referenced directly from the app. Reference material remains under repository-root `reference/` and must never be bundled as public content.

## Available now

```text
public/assets/
├── brand/
│   └── logo-symbol.svg
├── photos/
│   ├── portrait-hero.webp      # missing / optional
│   └── portrait-about.webp     # missing / required later
└── projects/
    ├── spasmooth/
    │   ├── spasmooth-hero-desktop.png
    │   ├── spasmooth-hero-mobile.png
    │   ├── spasmooth-mobile-menu.png
    │   ├── spasmooth-localizacao.png
    │   └── spasmooth-faq-footer.png
    └── mf-consultoria/
        ├── mf-consultoria-hero-desktop.png
        ├── mf-consultoria-hero-mobile.png
        ├── mf-consultoria-curadoria-processo.png
        └── mf-consultoria-cta-footer.png
```

## Primary project-image roles

### SpaSmooth
- `spasmooth-hero-desktop.png`: primary editorial preview and preferred first 3D/project-object surface.
- `spasmooth-hero-mobile.png`: responsive/mobile surface and secondary project-object face.
- `spasmooth-mobile-menu.png`: interaction/responsive-detail evidence for case study.
- `spasmooth-localizacao.png`: detail surface for location/map portion of case study.
- `spasmooth-faq-footer.png`: lower-page/detail surface for case study.

### MF Consultoria
- `mf-consultoria-hero-desktop.png`: primary editorial preview and preferred first 3D/project-object surface.
- `mf-consultoria-hero-mobile.png`: responsive/mobile surface and secondary project-object face.
- `mf-consultoria-curadoria-processo.png`: process/curation detail surface.
- `mf-consultoria-cta-footer.png`: lower-page CTA/footer detail surface.

Do not fabricate missing screenshots. The supplied imagery is the factual visual source for these two projects. If a scene needs fewer surfaces, prefer the strongest existing images rather than inventing filler.

## Still missing
- `public/assets/brand/logo-wordmark.svg` (or `.png/.webp`) for the WC / Wesley Caia wordmark composition.
- `public/assets/photos/portrait-about.webp`.
- optional `public/assets/photos/portrait-hero.webp` if the final Hero uses a portrait.

Missing personal/brand assets may use a clearly labeled temporary development placeholder only. They must not be replaced with fabricated final artwork without approval.

---

# 13. Implementation order

Do not build all motion simultaneously.

1. Asset audit and semantic page structure.
2. Typography, spacing, responsive foundation.
3. Hero static composition.
4. Hero pointer deformation.
5. Hero-to-dark identity transition.
6. About + portrait reveal.
7. Project editorial list + image switching.
8. Pointer trail.
9. Spatial project object.
10. Manifesto/rest scene.
11. Expertise/process.
12. Contact closure.
13. Case-study transition/pages.
14. Reduced motion + mobile fallbacks.
15. Performance and accessibility QA.

Each phase must be validated before introducing the next major effect.

---

# 14. Acceptance test for the final experience

The result is successful when:
- the portfolio is recognizably Wesley's identity, not a Gustavo clone;
- the first interaction feels responsive and tactile;
- the first scroll transition is memorable but controlled;
- projects are easier to understand than in a card-heavy layout;
- the 3D sequence demonstrates spatial transformation, not only tilt;
- quiet sections create breathing room;
- typography and imagery remain more important than effects;
- mobile remains usable without desktop-only pointer effects;
- the page is performant and has no overflow/flicker;
- reduced motion still communicates every section clearly.
