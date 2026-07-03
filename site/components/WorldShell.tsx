'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotaryDial, useReducedMotion } from '@facility/ds';
import { STATIONS, byId, isStationId, type StationId } from '../data/stations';
import { StationScreen } from './StationScreen';

const ROTATE_MS = 900;
const WARM_MS = 320;

// The world shell: one continuous pod. "Routing" = crossfading/panning between
// station plates (spec v2 §3) with shallow URL updates (§6). The plates are
// aria-hidden decoration; screens + HUD are the real, accessible DOM.
export function WorldShell({ initialId }: { initialId: StationId }) {
  const [current, setCurrent] = useState<StationId>(initialId);
  const [leaving, setLeaving] = useState<StationId | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [warming, setWarming] = useState(false);
  const rotating = useRef(false);
  const reduced = useReducedMotion();

  const rotateTo = useCallback(
    (id: StationId, push = true) => {
      if (rotating.current || id === current) return;
      rotating.current = true;
      const from = byId(current).ringIndex;
      const to = byId(id).ringIndex;
      const n = STATIONS.length;
      // ring short way: positive diff -> turn right
      const diff = (to - from + n) % n;
      const dir: 'left' | 'right' = diff <= n / 2 ? 'right' : 'left';
      setDirection(dir);
      setLeaving(current);
      setCurrent(id);
      setWarming(true);
      if (push) window.history.pushState({ station: id }, '', byId(id).route);
      document.title = `${byId(id).label} · INDISTINCT CHATTERING`;
      const total = reduced ? 0 : ROTATE_MS;
      window.setTimeout(
        () => {
          setLeaving(null);
          setWarming(false);
          rotating.current = false;
        },
        total + (reduced ? 0 : WARM_MS),
      );
    },
    [current, reduced],
  );

  // back/forward = spatial history (§6)
  useEffect(() => {
    const onPop = () => {
      const seg = window.location.pathname.replace(/^\//, '').split('/')[0];
      if (isStationId(seg)) rotateTo(seg, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [rotateTo]);

  // arrows rotate one station, wrapping (§5)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      // don't steal arrows from the dial radios / inputs
      if (e.target instanceof HTMLElement && e.target.closest('[role="radiogroup"], input, textarea, select')) return;
      const n = STATIONS.length;
      const idx = byId(current).ringIndex;
      const next = e.key === 'ArrowRight' ? (idx + 1) % n : (idx - 1 + n) % n;
      rotateTo(STATIONS[next].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, rotateTo]);

  const station = byId(current);

  return (
    <>
      {/* — the pod (decoration) — */}
      <div className="stage" aria-hidden>
        {STATIONS.map((s) => {
          const isActive = s.id === current;
          const isLeaving = s.id === leaving;
          const cls = [
            'plate',
            isActive && 'active',
            isActive && leaving && (direction === 'right' ? 'from-right' : 'from-left'),
            isLeaving && (direction === 'right' ? 'exit-left' : 'exit-right'),
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <img
              key={s.id}
              src={s.plate}
              alt=""
              className={cls}
              loading={isActive || isLeaving ? 'eager' : 'lazy'}
              draggable={false}
            />
          );
        })}

        {/* live screen mounted over the active plate's dark glass */}
        <section
          className={warming && !reduced ? 'screen warming' : 'screen'}
          style={{
            left: `${station.screen.left}%`,
            top: `${station.screen.top}%`,
            width: `${station.screen.width}%`,
            height: `${station.screen.height}%`,
          }}
        >
          <div className="screen-inner">
            <StationScreen id={current} />
          </div>
        </section>
      </div>

      {/* — HUD chrome (always accessible) — */}
      <nav className="hud" aria-label="Station selector">
        <RotaryDial
          variant="compact"
          wrap
          positions={STATIONS.map((s) => ({ id: s.id, label: s.label }))}
          index={station.ringIndex}
          onChange={(i) => rotateTo(STATIONS[i].id)}
        />
      </nav>
    </>
  );
}
