# Station master plates — production set v1

Eight photoreal master plates for the image-first console (see `docs/specs/console-image-first-spec.md`). One plate per station; the console layer overlays live DOM screens + hotspots on top. All eight were generated in a **single batch** (within-run consistency) via the workspace `image-set-generator` service.

- Provenance: runId `img-gen-1783061786619-7ejiho` (recordId `cmr4ky7ss0000i3hsj8zc8cnh`), 2026-07-03. Style guide + per-station prompts recorded in that run (retrievable via `get_run_detail`).
- Format: 2752×1536 JPEG masters (~2.6–3.0 MB each). Derive AVIF/WebP for serving; masters stay here until the R2 pipeline exists (spec §4).
- Set grammar shared by all eight (verified): same pod/camera/mullions; identical wings (left: VU meter + amber button grid + 4 bakelite knobs; right: twin cream meters + toggles + knobs; amber dome lamp far right); same giant center monitor (dark glass ≈ 28% of frame width) — only the deck and the world beyond the glass change.

| File               | Station           | Route        | Deck                                          | Through the glass                                                                 |
| ------------------ | ----------------- | ------------ | --------------------------------------------- | --------------------------------------------------------------------------------- |
| st-media.jpg       | MEDIA / PLAYBACK  | /media       | reel-to-reel + transport keys                 | loudspeaker-horn tower + amber orrery, mural far left, arc-blue shimmer far right |
| st-discography.jpg | DISCOGRAPHY       | /discography | canister/reel archive slots                   | canister vault + robotic retrieval claw                                           |
| st-tour.jpg        | TOUR / DISPATCH   | /tour        | teletype + route-pin board + levers           | semaphore gantries, signal lamps, locomotives                                     |
| st-gallery.jpg     | GALLERY           | /gallery     | periscope viewer + lens turret                | wall of cameras/periscope arms aimed at the pod                                   |
| st-about.jpg       | ABOUT / PERSONNEL | /about       | card reader + capsule cradle                  | pneumatic tube web + card-file cabinets                                           |
| st-press.jpg       | PRESS / ARCHIVE   | /press       | microfiche reader + stamp rack                | printing-press monster + hanging broadsheets                                      |
| st-store.jpg       | REQUISITIONS      | /store       | punch-card hopper + order levers + brass bell | warehouse hooks, crates, cage lift, drums                                         |
| st-terminal.jpg    | FACILITY TERMINAL | /terminal    | patch-bay + knife switches                    | THE BLACK HOLE — ring containment, arc-blue                                       |

QA notes (2026-07-03): all screens dark ✓ · no people/hands/chair ✓ · arc-blue confined to media (edge shimmer) and terminal (dominant) ✓. Known tolerated deviations: tiny "VU" lettering on meter faces (consistent across set, illegible-scale realism); st-press broadsheets carry garbled newsprint texture (atmospheric, illegible — regenerate via `generation.retryImage` only if unwanted). Screen rects per plate are measured at implementation time into `stations.json` (spec §4).

## v2 production set (2026-07-04) — CURRENT

Regenerated in one batch: runId `img-gen-1783185283004-wwdrck` (recordId `cmr6mh67z0000puhs13xjl0zl`). Supersedes v1 masters in place. New constraints baked in: DECK CLEARANCE (nothing taller than the monitor's lower bezel — gallery's periscope/binoculars removed), UNIQUE WINGS per station (station-themed left/right instruments), CONTINUOUS CONSOLE (desk runs off both frame edges, no visible ends; edge light falloff for seam pillars). Same pod/camera/monitor grammar and window worlds as v1. Shared screen rect: left 37.5 / top 49.2 / w 25.8 / h 21.4 (% of plate).
