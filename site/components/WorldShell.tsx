'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotaryDial, useReducedMotion } from '@facility/ds';
import { STATIONS, byId, isStationId, type StationId } from '../data/stations';
import { StationScreen } from './StationScreen';

const WARM_MS = 320;
const N = STATIONS.length;
const STEP_DEG = 360 / N;
// heavy chair: slow, weighted travel; scales sublinearly with distance
const turnMs = (steps: number) => Math.min(2200 + 650 * Math.max(0, Math.abs(steps) - 1), 3900);

// The pod is a real (CSS) cylinder: the eight plates are mounted on a ring
// around the camera and rotation turns the ring, so an incoming console
// genuinely swings in — its perspective skews and flattens as it arrives,
// which is the cue that sells "my chair is rotating" over "flat images on a
// treadmill". Yaw accumulates in degrees, so shortest-way wraps are free
// (no clones, no snapping). Screens cut to black the instant the motor
// engages and CRT-warm back in only after the detent settles.
export function WorldShell({ initialId }: { initialId: StationId }) {
  const [current, setCurrent] = useState<StationId>(initialId);
  const [yaw, setYaw] = useState(() => -byId(initialId).ringIndex * STEP_DEG);
  const [animMs, setAnimMs] = useState(0);
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
      const ms = reduced ? 0 : turnMs(delta);

      setSettled(false);
      setAnimMs(ms);
      setYaw((y) => y - delta * STEP_DEG);
      setCurrent(id);
      if (push) window.history.pushState({ station: id }, '', byId(id).route);
      document.title = `${byId(id).label} · INDISTINCT CHATTERING`;

      window.setTimeout(() => {
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

  return (
    <>
      {/* — the pod (decoration) — */}
      <div className="stage" aria-hidden>
        <div className="ring-scale">
          <div className="ring-wrap">
            <div
              className="ring"
              style={{
                transform: `rotateY(${yaw}deg)`,
                transition: animMs > 0 ? `transform ${animMs}ms cubic-bezier(0.6, 0, 0.22, 1.05)` : 'none',
              }}
            >
              {ordered.map((s) => (
                <div className="panel" key={s.id} style={{ ['--i' as string]: s.ringIndex }}>
                  <img src={s.plate} alt="" draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* live screen mounted over the active plate's dark glass */}
        <section
          className={settled ? 'screen' : 'screen off'}
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
          positions={ordered.map((s) => ({ id: s.id, label: s.label }))}
          index={station.ringIndex}
          onChange={(i) => rotateTo(ordered[i].id)}
        />
        <button type="button" className="motion-toggle" onClick={toggleMotion} aria-pressed={reduced}>
          MOTION: {reduced ? 'REDUCED' : 'FULL'}
        </button>
        {/* build tag — bump the letter on visual changes so stale caches are obvious */}
        <span className="motion-toggle" style={{ cursor: 'default' }}>
          REV D
        </span>
      </nav>
    </>
  );
}
