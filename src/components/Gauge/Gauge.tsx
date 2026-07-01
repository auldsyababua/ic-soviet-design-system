import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import styles from './Gauge.module.css';
import type { Size } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { needleAngle } from '../../lib/angle';
import { SegmentDisplay } from '../SegmentDisplay';

export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: Size;
  /** Start of the red hazard zone (in value units). */
  hazardFrom?: number;
  /** Start of the arc-blue active zone (in value units). */
  activeFrom?: number;
  label?: string;
}

// Dial geometry — a 180° arc across the top of the viewBox, matching the
// approved preview's needle demo (pivot near the lower-center).
const CX = 75;
const CY = 78;
const R = 63;
const STROKE = 8;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Polar→cartesian for the dial, where 0° points straight up (matching
 * needleAngle's convention) and positive degrees sweep clockwise.
 */
function pointAt(angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [CX + R * Math.cos(rad), CY + R * Math.sin(rad)];
}

/** SVG arc path between two values along the 180° dial. */
function arcPath(fromValue: number, toValue: number, min: number, max: number): string {
  const a1 = needleAngle(clamp(fromValue, min, max), min, max);
  const a2 = needleAngle(clamp(toValue, min, max), min, max);
  const [x1, y1] = pointAt(a1);
  const [x2, y2] = pointAt(a2);
  const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(function Gauge(
  { value, min = 0, max = 100, unit, size = 'md', hazardFrom, activeFrom, label, className = '', style, ...rest },
  ref,
) {
  const reduced = useReducedMotion();
  const clamped = clamp(value, min, max);
  const angle = needleAngle(clamped, min, max);

  return (
    <div
      ref={ref}
      className={[styles.wrap, styles[size], reduced ? styles.reduced : '', className].join(' ')}
      style={style}
      {...rest}
    >
      <div className={styles.dial}>
        <svg viewBox="0 0 150 90" role="img" aria-hidden focusable="false">
          {/* neutral track */}
          <path className={styles.track} d={arcPath(min, max, min, max)} fill="none" strokeWidth={STROKE} />
          {/* arc-blue active zone */}
          {activeFrom != null && (
            <path
              className={styles.active}
              d={arcPath(activeFrom, hazardFrom ?? max, min, max)}
              fill="none"
              strokeWidth={STROKE}
            />
          )}
          {/* red hazard zone */}
          {hazardFrom != null && (
            <path className={styles.hazard} d={arcPath(hazardFrom, max, min, max)} fill="none" strokeWidth={STROKE} />
          )}
          {/* needle */}
          <g className={styles.needle} style={{ ['--angle' as keyof CSSProperties]: `${angle}deg` } as CSSProperties}>
            <line x1={CX} y1={CY} x2={CX} y2={CY - (R - 11)} className={styles.needleLine} strokeWidth={2.5} />
          </g>
          <circle cx={CX} cy={CY} r={6} className={styles.hub} />
        </svg>
      </div>

      <div
        className={styles.readout}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
      >
        <SegmentDisplay value={Math.round(clamped)} digits={4} variant="seg7" signal="ambient" />
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
});
