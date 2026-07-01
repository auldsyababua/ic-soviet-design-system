import { forwardRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import styles from './Knob.module.css';
import type { Size } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { valueToAngle } from '../../lib/angle';

const SWEEP = 270; // ±135° bakelite rotary range

export interface KnobProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Number of detent notches; renders that many tick marks and snaps to them. */
  detents?: number;
  size?: Size;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Snap a value to the nearest detent notch across [min,max]. */
function snap(value: number, min: number, max: number, detents?: number): number {
  if (!detents || detents < 2) return value;
  const span = max - min;
  const stepSize = span / (detents - 1);
  return min + Math.round((value - min) / stepSize) * stepSize;
}

export const Knob = forwardRef<HTMLDivElement, KnobProps>(function Knob(
  {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    detents,
    size = 'md',
    label,
    disabled = false,
    className = '',
    style,
  },
  ref,
) {
  const reduced = useReducedMotion();
  const angle = valueToAngle(clamp(value, min, max), min, max, SWEEP);

  const commit = (next: number) => {
    if (disabled) return;
    const clamped = clamp(next, min, max);
    const snapped = snap(clamped, min, max, detents);
    if (snapped !== value) onChange(snapped);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        commit(value + step);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        commit(value - step);
        break;
      case 'Home':
        e.preventDefault();
        commit(min);
        break;
      case 'End':
        e.preventDefault();
        commit(max);
        break;
      default:
        break;
    }
  };

  // Tick marks evenly spaced across the sweep (detents count, else 11).
  const tickCount = detents && detents >= 2 ? detents : 11;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const t = tickCount === 1 ? 0.5 : i / (tickCount - 1);
    return t * SWEEP - SWEEP / 2;
  });

  return (
    <div
      className={[styles.wrap, styles[size], reduced ? styles.reduced : '', className].join(' ')}
      style={style}
    >
      <div
        ref={ref}
        className={styles.knob}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        aria-disabled={disabled || undefined}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        <div className={styles.ticks} aria-hidden>
          {ticks.map((deg, i) => (
            <span
              key={i}
              className={styles.tick}
              style={{ ['--tick' as keyof CSSProperties]: `${deg}deg` } as CSSProperties}
            />
          ))}
        </div>
        <div
          className={styles.dial}
          style={{ ['--angle' as keyof CSSProperties]: `${angle}deg` } as CSSProperties}
          aria-hidden
        >
          <span className={styles.pointer} />
        </div>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
});
