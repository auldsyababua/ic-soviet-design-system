'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotaryDial, useReducedMotion } from '@facility/ds';
import { STATIONS, byId, isStationId, type StationId } from '../data/stations';
import { StationScreen } from './StationScreen';

const WARM_MS = 320;
const N = STATIONS.length;
// travel time scales sublinearly with distance (spec v1 §5)
const turnMs = (steps: number) => Math.min(700 + 300 * Math.max(0, Math.abs(steps) - 1) + 250, 1500);

// The pod is an octagon filmstrip: all plates sit side by side in one strip,
// separated by support columns (the diagram's seam-hiders). Rotating = sliding
// the strip past the intermediate stations — a multi-step turn sweeps through
// everything between, always the short way round. Wrap-around uses clone
// aprons: the shortest path is at most N/2 steps, so N/2 clones on each end
// let any short-way sweep cross the seam; after landing on a clone the strip
// silently snaps to the canonical panel. Screens power down for the ride and
// warm up on settle.
//
// Strip layout: [s4..s7, s0..s7, s0..s3] — station ringIndex r at slot r+APRON.
const APRON = N / 2;
const SLOTS = N + 2 * APRON;
const visualOf = (ringIndex: number) => ringIndex + APRON;

export function WorldShell({ initialId }: { initialId: StationId }) {
  const [current, setCurrent] = useState<StationId>(initialId);
  const [visual, setVisual] = useState(() => visualOf(byId(initialId).ringIndex));
  const [animMs, setAnimMs] = useState(0); // 0 = no transition (snap)
  const [settled, setSettled] = useState(true);
  const rotating = useRef(false);
  const osReduced = useReducedMotion();

  // Motion override: OS pref by default, HUD toggle + ?motion= override, persisted.
  const [motionOverride, setMotionOverride] = useState<'full' | 'reduced' | null>(null);
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('motion');
    const stored = window.localStorage.getItem('ic-motion');
    const v =
      param === 'full' || param === 'reduced' ? param : stored === 'full' || stored === 'reduced' ? stored : null;
    if (v) setMotionOverride(v);
    if (param === 'full' || param === 'reduced') window.localStorage.setItem('ic-motion', param);
  }, []);
  const reduced = motionOverride ? motionOverride === 'reduced' : osReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [reduced]);
  const toggleMotion = () => {
    const next = reduced ? 'full' : 'reduced';
    setMotionOverride(next);
    window.localStorage.setItem('ic-motion', next);
  };

  const rotateTo = useCallback(
    (id: StationId, push = true) => {
      if (rotating.current || id === current) return;
      rotating.current = true;
      const from = byId(current).ringIndex;
      const to = byId(id).ringIndex;
      // shortest signed distance around the ring: (-N/2, N/2]
      let delta = (((to - from) % N) + N) % N;
      if (delta > N / 2) delta -= N;
      const targetVisual = visualOf(from) + delta; // may land on a clone (0 or SLOTS-1)
      const ms = reduced ? 0 : turnMs(delta);

      setSettled(false);
      setAnimMs(ms);
      setVisual(targetVisual);
      setCurrent(id);
      if (push) window.history.pushState({ station: id }, '', byId(id).route);
      document.title = `${byId(id).label} · INDISTINCT CHATTERING`;

      window.setTimeout(() => {
        // landed on a clone apron -> silently snap to the canonical panel
        if (targetVisual < APRON || targetVisual >= APRON + N) {
          setAnimMs(0);
          setVisual(visualOf(to));
        }
        setSettled(true);
        window.setTimeout(() => {
          rotating.current = false;
        }, WARM_MS);
      }, ms);
    },
    [current, reduced],
  );

  // back/forward = spatial history
  useEffect(() => {
    const onPop = () => {
      const seg = window.location.pathname.replace(/^\//, '').split('/')[0];
      if (isStationId(seg)) rotateTo(seg, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [rotateTo]);

  // arrows rotate one station, wrapping
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.target instanceof HTMLElement && e.target.closest('[role="radiogroup"], input, textarea, select')) return;
      const idx = byId(current).ringIndex;
      const next = e.key === 'ArrowRight' ? (idx + 1) % N : (idx - 1 + N) % N;
      rotateTo(STATIONS.find((s) => s.ringIndex === next)!.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, rotateTo]);

  const station = byId(current);
  const ordered = [...STATIONS].sort((a, b) => a.ringIndex - b.ringIndex);
  const panels = [...ordered.slice(N - APRON), ...ordered, ...ordered.slice(0, APRON)]; // clone aprons

  return (
    <>
      {/* — the pod (decoration) — */}
      <div className="stage" aria-hidden>
        <div
          className="strip"
          style={{
            width: `${SLOTS * 100}%`,
            transform: `translateX(-${(visual * 100) / SLOTS}%)`,
            transition: animMs > 0 ? `transform ${animMs}ms cubic-bezier(0.66, 0, 0.26, 1.08)` : 'none',
          }}
        >
          {panels.map((s, i) => (
            <div className="panel" key={`${s.id}-${i}`}>
              <img src={s.plate} alt="" draggable={false} />
              <span className="column" />
            </div>
          ))}
        </div>

        {/* live screen mounted over the active plate's dark glass */}
        <section
          className={settled ? 'screen' : 'screen warming'}
          style={{
            left: `${station.screen.left}%`,
            top: `${station.screen.top}%`,
            width: `${station.screen.width}%`,
            height: `${station.screen.height}%`,
          }}
        >
          <div className="screen-inner">{settled && <StationScreen id={current} />}</div>
        </section>
      </div>

      {/* — HUD chrome (always accessible) — */}
      <nav className="hud" aria-label="Station selector">
        <RotaryDial
          variant="compact"
          wrap
          positions={[...STATIONS].sort((a, b) => a.ringIndex - b.ringIndex).map((s) => ({ id: s.id, label: s.label }))}
          index={station.ringIndex}
          onChange={(i) => rotateTo([...STATIONS].sort((a, b) => a.ringIndex - b.ringIndex)[i].id)}
        />
        <button type="button" className="motion-toggle" onClick={toggleMotion} aria-pressed={reduced}>
          MOTION: {reduced ? 'REDUCED' : 'FULL'}
        </button>
      </nav>
    </>
  );
}
