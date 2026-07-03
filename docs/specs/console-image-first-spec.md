# THE FACILITY — Image-First Console Spec (v2 — SUPERSEDES the layer/cylinder model)

> **Status: AUTHORITATIVE.** This revises `console-rotation-ux-spec.md`. The world-building approach changes from DOM/CSS-composed consoles to **pre-generated photoreal plates** (the Myst / 3DO / pre-rendered-background trick). Sections of the v1 spec on routing, deep-links, keyboard, accessibility, dormant content, and audio remain in force; its layer model (§3), CSS-3D cylinder (§5 implementation), and depth-parallax asset contract (§9) are **replaced** by this document. Where the two disagree, this document wins.

## 1. Why the change

The v1 approach hand-builds each console from `@facility/ds` DOM components. Evaluated against the approved reference render (`media_v4.png`), DOM/CSS cannot reach the photoreal register — and it over-engineers everything that never moves. **90% of every frame is static.** So: generate it as an image, and code only what actually changes.

Principle: **one gorgeous plate per station; only the interactive rectangles are alive.**

## 2. Layer model (replaces v1 §3)

Per station, back to front:

| #   | Layer              | What it is                                                                                                                                                                                                                | v1          |
| --- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 0   | **Master plate**   | ONE full-frame photoreal image of the entire locked view — console + curved glass + environment behind it, coherent lighting, in a single image (like `media_v4.png`, 2752×1536). Serve as AVIF/WebP.                     | ✅ required |
| 1   | **Live screens**   | Absolutely-positioned DOM rectangles mapped onto the plate's screen areas. Real, selectable, accessible HTML built from `@facility/ds` (SegmentDisplay, mono terminal type, Indicator, etc). All page content lives here. | ✅ required |
| 2   | **Hotspots + HUD** | Invisible accessible `<button>`s over painted controls that navigate (e.g. the painted REQUISITIONS button → /store), plus a slim persistent DS-styled station dial + rotate arrows + mute. Full keyboard path.           | ✅ required |
| 3   | **Accent loop**    | OPTIONAL transparent WebM/APNG (e.g. mutating black hole) over the window region only, alpha-feathered edges, `prefers-reduced-motion` → hidden.                                                                          | ⏳ v2       |

Rules carried over: screens in the DOM layer are always clean/high-contrast (dirt lives in the plate); no person/chair/hands in any plate; view stays locked (no free-look).

**The design system's role narrows and sharpens:** `@facility/ds` no longer builds console chassis. It owns (a) everything rendered _inside_ the screens, (b) the HUD chrome, (c) any focus/hover affordances drawn over hotspots. Tokens/fonts still govern all rendered text.

## 3. Station transition (replaces v1 §5 implementation)

- Rotation = **crossfade + slight lateral pan** between the outgoing and incoming plates (~700–1000ms, `--ease-thunk`-family curve), with:
  - motor-servo whir + detent clunk audio (unchanged from v1),
  - outgoing screens power-down/degauss; incoming screens CRT-warm-up as content mounts (unchanged),
  - pan direction matches ring direction (left/right), so it still _feels_ like turning.
- No 3D cylinder, no depth maps, no parallax in v1. If v2 wants parallax, it's a plate + window-region accent offset, not geometry.
- `prefers-reduced-motion`: instant crossfade, no pan, loops hidden — unchanged from v1 §11.

## 4. Asset contract (replaces v1 §9)

Per station:

```jsonc
// data/stations.json (typed in data/stations.ts)
{
  "id": "media",
  "label": "MEDIA / PLAYBACK",
  "route": "/media",
  "ringIndex": 0, // indexed rotation, wraps
  "plate": { "avif": "...", "webp": "...", "width": 2752, "height": 1536 },
  "screens": [
    // DOM overlay rects, % of plate
    { "id": "main", "x": 31.4, "y": 30.2, "w": 20.6, "h": 17.5, "rotate": 0 },
  ],
  "hotspots": [
    { "id": "to-store", "label": "REQUISITIONS", "x": 12, "y": 62, "w": 6, "h": 4, "action": "rotate:store" },
  ],
  "accentLoop": null, // v2: { "webm": "...", "region": {x,y,w,h} }
  "audio": { "bed": "...", "sfx": { "detent": "..." } },
}
```

- Coordinates are **percentages of the plate**, so one map works at every viewport size; the plate letterboxes/covers with a fixed focal crop.
- Plates come from the image-generation pipeline (§5). Screen rects are measured once per plate and recorded here.
- Mobile: same plates, tighter `object-position` crop biased to the console's main screen; the `RotaryDial` HUD becomes the primary nav (v1 §8's field-terminal intent, minus the bespoke layout).

## 5. Plate generation plan (consistency doctrine)

**Canon anchor:** `media_v4.png` is the master style reference. All other stations are generated **from it** (image-to-image / edit-variation), never from scratch, holding constant:

- camera height, focal length, locked first-person framing, ~30/65/5 vertical bands (window/console/desk),
- pod geometry: curved continuous window band with mullions, convex console, desk sliver,
- palette (enamel grey-green world, sodium-amber lamps, arc-blue only for active phenomena), lighting direction, patina level.

**Per-station variable block** — the only thing that changes: the console's deck equipment + the invention outside the glass. The environment is a _monstrosity that references the station_:

| Station     | Console deck                      | Through the glass (the monstrosity)                 |
| ----------- | --------------------------------- | --------------------------------------------------- |
| media       | reel-to-reel deck (canon)         | giant loudspeaker-horn array + orrery lamps (canon) |
| discography | canister/reel archive slots       | robotic tape-canister crane in a vault of shelves   |
| tour        | dispatch teletype + map board     | rail-yard gantry with signal semaphores             |
| gallery     | periscope viewer + film winder    | wall of periscope lenses / observation arms         |
| about       | personnel card reader             | rows of pneumatic record capsules                   |
| press       | microfiche reader + stamp station | printing-press monster with hanging broadsheets     |
| store       | requisition punch-card console    | warehouse conveyor of stenciled crates              |
| terminal    | dense patch-bay + main CRT        | THE BLACK HOLE — containment ring array (arc-blue)  |

**Hard constraints in every generation prompt:**

1. All console screens rendered **dark / powered-off** (DOM content overlays them; baked-in glow fights it).
2. **No humans, hands, or chair.**
3. **No readable text** anywhere (real text is overlaid in DS fonts; generated lettering garbles).
4. Composition bands ~30/65/5 held; **the primary screen must be BIG — ~35% of frame width, roughly 4:3, front-facing, centered** — it hosts the page's real content. (The canon `media_v4.png` CRT is too small for this; the media plate is regenerated as `media_v5` with an enlarged monitor. `media_v4` remains the style anchor.)
5. Output ≥ 2752×1536 (16:9).

**Pipeline:** plates are generated through the workspace `image-set-generator` service (`generate_set`: one shared styleGuide — the canon description above, verbatim every run — + per-station prompt blocks; poll `get_run_status` until terminal). The service is styleGuide-batch based (no seed-image input), so consistency lives in the styleGuide text; if a station drifts off-style, fall back to an image-edit pass (e.g. Gemini image editing) using `media_v4.png` as the input reference. Process per plate: generate → QA against constraints (bands, screen size, screens-off, no text) → measure screen/hotspot rects → append to `stations.json`. Pilot-first: validate 2 stations for style-lock before batching the remaining 6. One shared black-hole accent loop may be generated once and reused (v2).

## 6. What survives from v1 verbatim

- §4 station ring + indexed rotation & wrap (angles now only drive pan direction).
- §6 routing/deep-links/back-forward/no-JS. §7 chrome. §10 state (drop `facingAngle` parallax use). §11 accessibility in full — the plate is `aria-hidden` decoration; the semantic spine + keyboard path are mandatory. §12 performance budget (now trivially met: plates are the only heavy assets; prefetch neighbors on idle). §13 acceptance criteria reinterpreted against crossfade transitions.
- Appendix: band name **indistinct Chattering**; no releases/tour dates — all screens render dormant states (`STANDBY`, `NO SCHEDULED DISPATCHES`, `NO SIGNAL`, `AWAITING TRANSMISSION`).

## 7. Build order

1. World shell: plate renderer + crossfade/pan transition + routing + HUD dial + keyboard (works with 1 plate + 7 placeholders).
2. Media station end-to-end: `media_v4.png` as plate, screen rect mapped, dormant media UI inside, hotspots wired.
3. Generate remaining 7 plates per §5; map + wire each.
4. v2: accent loops, hover glints on hotspots, plate micro-animation.
