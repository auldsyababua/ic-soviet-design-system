# THE FACILITY — Console-Rotation UX Spec (Implementer Handoff)

> **For the implementer agent.** This is the authoritative behavioral + interaction spec for the site's core navigation: the rotating console experience. It defines the metaphor, the fixed viewport composition, the rotation/transition model, state, routing, mobile, accessibility, performance, and the asset contract. Build the front end from the existing design system `@facility/ds` (Panel, Switch, Knob, Button, RotaryDial, Gauge, SegmentDisplay, Indicator, CRTScreen, MimicPanel, SignagePlate, HazardStrip, StationPanel). Color reaches components ONLY as a semantic `signal` role: `ambient | decay | active | hazard | ok` — never raw hex.

## 1. The core concept (read first)

The site is a **band-world experience, not a page stack**. The user is a worker seated at a control console inside a beaker-shaped, glass-walled observation pod in a stylized retro-futurist black-hole research facility (Wolfenstein/Atomic-Heart/Black-Mesa register — real-thing-with-impossible-tech, saturated and cinematic, never naming a real country).

- The user's viewport is the worker's **locked first-person view**: a curved console filling the lower portion of the frame, a continuous curved 360° window band above it, and a thin sliver of desk at the very bottom.
- Each website "page" is a **physical console station** arranged around the user on a full 360° ring. Discography, Tour, Media/Playback, Gallery, About, Press, Store, Lore/Terminal — each is its own console with its own controls, its own screen, and its own unique view through the window behind it.
- **Navigating = the user's chair/view rotates on its motor to face a different console.** It is not a page load. There is one continuous world; you turn within it.
- The view is **LOCKED on the vertical axis**. The user CANNOT free-look like an FPS. The website directs and locks the frame. The only camera motion the user triggers is rotation between stations (yaw). No pitch, no free pan, no walking.

If you internalize one thing: **this is a single continuous cylindrical scene, and "routing" is animating the yaw to a fixed detent angle.**

## 2. Fixed viewport composition (the locked template)

Every station frame obeys the same vertical layout. Match the approved reference frame `media_console_v4.png`.

```
┌───────────────────────────────────────────────┐
│  ░░ CURVED 360° WINDOW BAND  (~30% height) ░░ │  ← continuous glass, curves
│  wraps past both L/R edges, no visible ends   │    off both edges; unique
│  → unique sci-fi facility background per page │    background per station
├───────────────────────────────────────────────┤
│                                               │
│   ███  CONSOLE  (~65% height)  ███            │  ← main interactive surface
│   central screen + real controls +            │    curves/bows toward viewer
│   decorative controls, per-station layout     │    (convex)
│                                               │
├───────────────────────────────────────────────┤
│  ▁▁ DESK SLIVER (~5% height) ▁▁               │  ← thin foreground desk edge
└───────────────────────────────────────────────┘
```

- Window band ≈ 30% top. Console ≈ 65%. Desk sliver ≈ 5% bottom. These proportions are deliberate — the console is the primary UI surface and must dominate.
- Window glass is continuously curved and must read as wrapping around the viewer (no visible left/right window ends).
- The console bows convex toward the viewer (matches a circular desk you sit inside).
- **No person, no chair, no hands are ever visible.** Pure locked first-person.

**Per-station variation:** each console is physically different — different screen size/shape, different control clusters, different worldbuilding props around the edges — but all obey this template, palette, and the `@facility/ds` control vocabulary. Some stations may even use buttons on the console itself as secondary navigation (e.g. a "REQUISITIONS" button that rotates to the Store station).

## 3. Layer model (how a station frame is composed)

Each station renders as stacked layers, back to front. This is what makes the illusion cheap and the rotation continuous.

1. **Background plate (through the window)** — a pre-rendered environment image unique to the station, shown behind the glass. Depth-displaced for subtle parallax during rotation (image + depth map). Static asset; see §9.
2. **Window glass layer** — curved mullions/frame, glass reflections/grime, curvature framing. Shared geometry, per-station tint/reflection.
3. **Console layer** — the station's control panel: `StationPanel` + controls + `CRTScreen`(s). This is the DOM/interactive layer. Crisp UI lives here.
4. **Screen content layer** — the actual page content (tracklist, tour dates, bio, gallery, terminal) rendered INSIDE the console's CRT screen(s) as real, selectable, accessible DOM.
5. **Post-FX layer** — global scanline/vignette/chromatic-aberration/dust/flicker overlay. Toggled off under reduced-motion / save-data.
6. **HUD/chrome layer** — persistent minimal nav affordance (station indicator, rotate hints), always accessible.

Dirt lives in layers 1–2 and the console material, **never** in layer 4. Screen content is always clean, high-contrast, readable.

## 4. Spatial model & station ring

- There is a single global `facingAngle` (degrees, 0–360) representing where the view is pointed on the console ring.
- Each station owns a fixed angle (a "detent"). Define in `data/stations.ts`:

```ts
export const STATIONS = [
  { id: 'media', label: 'MEDIA / PLAYBACK', angle: 0, route: '/media' },
  { id: 'discography', label: 'DISCOGRAPHY', angle: 45, route: '/discography' },
  { id: 'tour', label: 'TOUR / DISPATCH', angle: 90, route: '/tour' },
  { id: 'gallery', label: 'GALLERY', angle: 135, route: '/gallery' },
  { id: 'about', label: 'ABOUT / PERSONNEL', angle: 180, route: '/about' },
  { id: 'press', label: 'PRESS / ARCHIVE', angle: 225, route: '/press' },
  { id: 'store', label: 'REQUISITIONS', angle: 270, route: '/store' },
  { id: 'terminal', label: 'FACILITY TERMINAL', angle: 315, route: '/terminal' },
] as const;
```

- Angles may be evenly spaced (45° for 8 stations) OR indexed (the ring "clicks" one station at a time regardless of literal degrees). **Prefer indexed rotation for feel:** each nav step advances exactly one station with a heavy detent, wrapping around the ring. Keep the literal angle for the parallax/background offset math.
- **Continuity rule:** rotation is always along the ring the short way when using the dial, but direct deep-links animate from a sensible neighbor (see §6). Never hard-cut between stations during in-session navigation.

## 5. Rotation / transition behavior (the signature interaction)

The rotation is the "wow." It must feel like a **heavy motorized chair swinging to face a new console** — mechanical, weighted, with a detent.

**Trigger inputs** (all map to "rotate to station N"):

- Click a station on the rotary nav dial / station selector.
- Click an in-world console navigation button (e.g. REQUISITIONS button → Store).
- Keyboard: `←/→` rotate one station; `Tab` moves focus through station targets; `Enter` activates.
- Optional: scroll/drag on empty console frame nudges rotation (desktop only, never hijack page scroll inside a screen).

**Motion spec:**

- Duration: ~700–1000ms per single-station step. Multi-station jumps scale sublinearly (don't make a 4-station jump take 4s — cap ~1400ms and speed the middle).
- Easing: heavy motor curve — slow start, confident sweep, detent settle with a tiny damped overshoot on arrival (the chair "clunking into position on its bearing"). Suggested: custom cubic-bezier ≈ `cubic-bezier(0.7, 0, 0.2, 1)` + a 60–120ms micro-settle.
- Parallax during turn: foreground console leads, window background lags (depth-displaced plate offsets with the yaw). This sells physical depth. Foreground console elements may have a subtle motion smear.
- Audio: a motorized servo whir + a mechanical detent clunk on arrival; ambient facility bed and station-specific audio crossfade by angle, never restart.
- Screen handoff: the departing console's screen powers down / degausses; the arriving console's screen warms up (CRT power-on). Content mounts as the new screen warms.

**Implementation approaches** (choose per performance budget):

- **Default (recommended): CSS 3D transform** — a `preserve-3d` stage rotated via `rotateY(var(--facing))`, stations positioned on a cylinder with `transform: rotateY(θ) translateZ(r)`. Cheapest, GPU-composited, accessible.
- **Enhanced:** a thin Three.js camera yaw inside a textured cylinder for the window/background depth layer, with the DOM console layer synced on top. Use only if the CSS approach can't deliver the depth parallax you want.
- **Do not build a walkable 3D scene. Yaw only.**

## 6. Routing & deep-links

- Each station has a real route (`/media`, `/tour`, …) so pages are shareable, SSG-friendly, and SEO-visible.
- **In-session navigation** (clicking dial/buttons/keys): update `facingAngle` state → animate rotation → update URL via shallow routing (no full navigation, no remount of the world shell).
- **Cold load / deep-link** (user lands on `/tour` directly): SSR/SSG renders that station's content immediately; on hydration, the world shell mounts already facing that station's angle (no dramatic spin on first paint). Optionally play a short "power-on / boot" sequence instead of a spin.
- **Back/forward:** browser history maps to `facingAngle`; animate the rotation to match so history navigation feels spatial too.
- **No-JS:** the SSG HTML for the route renders full content with the static background plate — fully usable without the rotation layer.

## 7. Persistent chrome / nav affordance

Always present, minimal, on-brand (`@facility/ds`):

- **Station indicator:** current station name + a ring/dial mini-map showing position on the 360° ring (which detent you're at). Use `RotaryDial` styling.
- **Rotate affordances:** left/right rotate controls (map to prev/next station) with mechanical styling; keyboard hints on focus.
- **Global controls:** audio mute (facility bed), reduced-motion toggle, mailing-list "SUBSCRIBE" as a console action.
- Chrome must be reachable by keyboard and screen reader at all times, independent of the rotation animation.

## 8. Mobile adaptation (intentional, not a squashed desktop)

Do not shrink the circular pod. Reframe the same fiction as a **handheld field terminal / rugged control slate**:

- Vertical layout: a compact window strip at top (the station's background), the station's primary screen + key controls in the middle, and a physical rotary selector dial (`RotaryDial`) at the bottom that clicks through stations with detents (mirrors the desktop rotation, one station per click).
- Swiping left/right on the frame = rotate one station (with the same detent feel and audio).
- Depth parallax driven subtly by device gyroscope; disabled under reduced-motion / low-power / save-data.
- Heavy background plates and any splat/panorama assets load on interaction, not on first paint; show a poster still first.
- Keep console controls thumb-reachable; never require precise hover.

## 9. Asset contract (what the console layer consumes)

Per station, the front end expects (URLs resolved from a typed `media-manifest`, large media served from Cloudflare R2, small UI assets in-repo):

- `background.plate` — wide/curved environment image (AVIF + WebP), unique per station. Rendered behind the glass.
- `background.depth` — grayscale depth map paired with the plate (drives rotation parallax). May be lower-res.
- `console.layout` — the station's control composition (built from `@facility/ds` components; **not** an image).
- `screen.content` — the page's real DOM content mounted inside the CRT.
- `loops[]` — optional pre-rendered monitor/diagnostic loops (WebM/AV1) for that station's screens/props.
- `audio.bed` + `audio.sfx` — station ambient + interaction SFX.
- (hero station only) `splat` — optional Gaussian-splat scene for the one "real 3D" beat.

The rotation system only needs `background.plate` + `background.depth` + `console.layout` to function; everything else is enhancement.

> **Background-plate provenance:** plates/depth/panoramas/loops are produced offline by the Blender render-foundry pipeline (separate service; see the blender-foundry brief). Until real plates exist, build against placeholder plates (flat facility-toned gradients + a marker) wired through the same manifest contract.

## 10. State (minimal)

```ts
// global world store (e.g. Zustand)
interface WorldState {
  facingStationId: StationId; // current detent
  facingAngle: number; // derived, for parallax math
  isRotating: boolean; // gate input during transition
  reducedMotion: boolean; // from prefers-reduced-motion + user toggle
  audioEnabled: boolean;
  rotateTo(id: StationId): void; // animate + shallow-route + crossfade audio
}
```

- Block new rotation triggers while `isRotating` (or queue the latest and fast-forward).
- `reducedMotion` and `audioEnabled` persist (localStorage).

## 11. Accessibility (required, not optional)

- **Semantic spine underneath the cinematics.** Every station is a real landmark `<section>`/`<article>` with a heading; content (tracklists, dates, bio, press) is real, ordered, selectable HTML. The visual world is `aria-hidden` decoration layered on top. A screen reader gets a clean, ordered band site.
- **Keyboard:** full operation without a pointer — `←/→` rotate, `Tab`/`Shift+Tab` through station targets + console controls, `Enter`/`Space` activate, visible focus rings (hard machined outline, not soft glow). Provide a skip-to-content link and a station list (plain nav) as a keyboard-first alternative to the dial.
- **`prefers-reduced-motion`:** rotation becomes an instant crossfade between stations; depth parallax, CRT flicker, dust, chromatic aberration, and motion smear are disabled; loops freeze to poster frames. The reduced-motion path must still be fully navigable and pretty.
- **Contrast:** screen content meets WCAG AA against its CRT background. Never rely on color alone — pair `signal` colors with icon/text (amber+"ACTIVE", red+"HAZARD").
- **Motion sickness:** cap rotation speed; no continuous spinning; honor reduced-motion. Never auto-rotate without user intent.

## 12. Performance budget

- **Static-first / progressive enhancement.** Content ships as SSG HTML; the rotation/cinematic layer hydrates on top and is non-blocking.
- Only the current + immediately adjacent stations' heavy assets are loaded/decoded; prefetch neighbors on idle. Distant stations lazy-load on approach.
- Target 60fps rotation on mid desktop and recent phones; degrade gracefully (drop parallax → static plate → instant crossfade) under low power / save-data.
- Keep the console layer GPU-composited (transforms/opacity only during animation; avoid layout thrash).
- Large media (plates, loops, splats, audio) from R2; keep the app bundle lean.

## 13. Acceptance criteria (definition of done for the nav system)

1. Landing on any route renders that station facing-forward, content readable, with no dramatic first-paint spin.
2. Clicking a station on the dial (or an in-world nav button, or `←/→`) rotates the view with the heavy detented motor feel + audio, updates the URL shallowly, and does not remount the world shell.
3. The window background is unique per station and parallaxes correctly against the console during rotation.
4. Window reads as a continuous curved 360° glass (no visible ends); proportions hold ~30/65/5 (window/console/desk).
5. Full keyboard operation. <!-- TRUNCATED IN HANDOFF: criteria 5+ were cut off in transmission. Operator to supply the remaining acceptance criteria; until then, treat §11 (accessibility) as the governing keyboard/AT requirements. -->

---

## Appendix — content state (as of 2026-07-02)

- Band name: **indistinct Chattering** (renders as INDISTINCT CHATTERING on signage; the name reads like a surveillance-transcript marker — `[indistinct chattering]` — lean into that in terminal/ambient copy).
- **No releases and no tour dates exist yet — do not fabricate any.** Build every station in its dormant / pre-activation state (styled empty states: `STANDBY`, `NO SCHEDULED DISPATCHES`, `NO SIGNAL`, `AWAITING TRANSMISSION`), ready to light up when real content arrives via the manifest.
- Reference frame `media_console_v4.png` is held by the operator and not yet committed to this repo; request it if needed for pixel-matching the composition.
