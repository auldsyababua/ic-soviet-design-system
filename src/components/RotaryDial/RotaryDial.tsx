import { forwardRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import styles from './RotaryDial.module.css';
import type { Size } from '../../types';
import { stepIndex } from '../../lib/index-wrap';

export interface RotaryDialProps {
  positions: { id: string; label: string }[];
  index: number;
  onChange: (index: number) => void;
  /** Desktop rotary dial vs. compact horizontal click-through selector. */
  variant?: 'dial' | 'compact';
  /** Wrap past the last/first station instead of clamping. */
  wrap?: boolean;
  size?: Size;
  className?: string;
  style?: CSSProperties;
}

export const RotaryDial = forwardRef<HTMLDivElement, RotaryDialProps>(function RotaryDial(
  { positions, index, onChange, variant = 'dial', wrap = false, size = 'md', className = '', style, ...rest },
  ref,
) {
  const count = positions.length;
  // Clamp the incoming index defensively so a stale prop can't point off-list.
  const safeIndex = Math.min(count - 1, Math.max(0, index));

  const step = (delta: number) => {
    const next = stepIndex(safeIndex, delta, count, wrap);
    if (next !== safeIndex) onChange(next);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // Left/Down = -1, Right/Up = +1 (honouring wrap via stepIndex).
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      step(-1);
    }
  };

  // Even angular spacing across the full 360° face; the pointer rotates to the
  // selected facing and settles via --ease-detent (overshoot→settle).
  const facing = count > 0 ? (safeIndex / count) * 360 : 0;

  return (
    <div
      ref={ref}
      className={[styles.root, styles[size], styles[variant], className].join(' ')}
      style={style}
      {...rest}
    >
      <div role="radiogroup" aria-label="station selector" className={styles.group} tabIndex={0} onKeyDown={onKey}>
        {variant === 'dial' ? (
          <div className={styles.dial}>
            <div className={styles.face}>
              {positions.map((p, i) => {
                const a = (i / count) * 360;
                return (
                  <span
                    key={p.id}
                    className={[styles.station, i === safeIndex ? styles.stationOn : ''].join(' ')}
                    style={{ ['--facing']: `${a}deg` } as CSSProperties}
                  >
                    <span className={styles.stationLabel}>{p.label}</span>
                  </span>
                );
              })}
              <span className={styles.pointer} aria-hidden style={{ ['--facing']: `${facing}deg` } as CSSProperties} />
              <span className={styles.hub} aria-hidden />
            </div>
            {positions.map((p, i) => (
              // semantic radios (visually represented by the single physical pointer)
              <span
                key={p.id}
                role="radio"
                aria-checked={i === safeIndex}
                aria-label={p.label}
                className={styles.sr}
                onClick={() => onChange(i)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.compact}>
            {positions.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={i === safeIndex}
                aria-label={p.label}
                className={[styles.cell, i === safeIndex ? styles.cellOn : ''].join(' ')}
                onClick={() => onChange(i)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
