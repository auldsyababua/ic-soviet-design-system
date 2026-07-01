import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Indicator.module.css';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Signal, Size } from '../../types';

export interface IndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic lamp color when lit. */
  signal?: Signal;
  /** Whether the lamp is energized (warms up to full backlight). */
  on?: boolean;
  /** Optional IBM-Plex-Mono caption rendered beside the lamp. */
  label?: string;
  size?: Size;
}

export const Indicator = forwardRef<HTMLSpanElement, IndicatorProps>(function Indicator(
  { signal = 'active', on = false, label, size = 'md', className = '', style, ...rest },
  ref,
) {
  const reduced = useReducedMotion();
  const ariaLabel = label ?? `${signal} indicator ${on ? 'on' : 'off'}`;

  return (
    <span
      ref={ref}
      className={[styles.root, styles[size], className].join(' ')}
      style={style}
      {...rest}
    >
      <span
        className={[styles.lamp, on ? styles.on : '', reduced ? styles.instant : ''].join(' ')}
        role="img"
        aria-label={ariaLabel}
        style={{ ['--lamp']: `var(--signal-${signal})` } as CSSProperties}
      />
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
});
