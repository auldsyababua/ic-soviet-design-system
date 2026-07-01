import { forwardRef, useEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './SegmentDisplay.module.css';
import { formatSegments } from '../../lib/segment';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Signal } from '../../types';

export interface SegmentDisplayProps extends HTMLAttributes<HTMLSpanElement> {
  value: string | number;
  /** Cell count. Defaults to the formatted value's own width. */
  digits?: number;
  variant?: 'seg7' | 'seg14' | 'dotmatrix';
  /** Phosphor color. */
  signal?: Extract<Signal, 'ambient' | 'active'>;
}

// The ghost underlay: the all-segments-lit glyph the readout would show with
// every segment energized. '8' for 7-seg numerics; '~' (DSEG14 all-on) for
// 14-seg; a block for dot-matrix. Punctuation columns mirror the value.
function ghostFor(formatted: string, variant: SegmentDisplayProps['variant']): string {
  const allOn = variant === 'seg14' ? '~' : variant === 'dotmatrix' ? '█' : '8';
  return [...formatted].map((ch) => (ch === ':' || ch === '.' || ch === ' ' ? ch : allOn)).join('');
}

export const SegmentDisplay = forwardRef<HTMLSpanElement, SegmentDisplayProps>(function SegmentDisplay(
  { value, digits, variant = 'seg7', signal = 'ambient', className = '', style, ...rest },
  ref,
) {
  const reduced = useReducedMotion();
  const formatted = formatSegments(value, digits ?? String(value).length);
  const ghost = ghostFor(formatted, variant);

  // Flicker on value change: brief opacity dip via --ease-warm (skip when reduced).
  const [flicker, setFlicker] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    setFlicker(true);
    const t = setTimeout(() => setFlicker(false), 120);
    return () => clearTimeout(t);
  }, [formatted, reduced]);

  return (
    <span
      ref={ref}
      className={[styles.display, styles[variant], className].join(' ')}
      style={{ ['--phosphor']: `var(--signal-${signal})`, ...style } as CSSProperties}
      role="img"
      aria-label={String(value)}
      {...rest}
    >
      <span className={styles.ghost} aria-hidden>
        {ghost}
      </span>
      <span className={[styles.lit, flicker ? styles.flicker : ''].join(' ')} aria-hidden>
        {formatted}
      </span>
    </span>
  );
});
