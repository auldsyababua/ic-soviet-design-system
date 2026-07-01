import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './CRTScreen.module.css';
import { Panel } from '../Panel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Size } from '../../types';

export interface CRTScreenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Phosphor tint of the screen surface. */
  phosphor?: 'green' | 'amber';
  /** Bulge the glass with a subtle barrel curvature + vignette. */
  curvature?: boolean;
  size?: Size;
  // `aria-label` (inherited from HTMLAttributes) names the screen region.
  // children = the screen content slot (terminal text, <video>, readouts, etc.)
}

// Phosphor role → token. `green` reads as the dead-fluorescent phosphor
// (decay), `amber` as the sodium-amber tube (ambient). Component CSS resolves
// `--phosphor` back to these signal tokens.
const PHOSPHOR: Record<NonNullable<CRTScreenProps['phosphor']>, string> = {
  green: 'var(--signal-decay)',
  amber: 'var(--signal-ambient)',
};

export const CRTScreen = forwardRef<HTMLDivElement, CRTScreenProps>(function CRTScreen(
  {
    phosphor = 'green',
    curvature = false,
    size = 'md',
    className = '',
    children,
    style,
    'aria-label': ariaLabel = 'Screen',
    ...rest
  },
  ref,
) {
  const reduced = useReducedMotion();

  return (
    <Panel
      ref={ref}
      finish="steel"
      elevation="raised"
      className={[styles.frame, styles[size], className].join(' ')}
      style={{ ['--phosphor']: PHOSPHOR[phosphor], ...style } as CSSProperties}
      {...rest}
    >
      <div
        className={[
          styles.screen,
          styles.scanlines,
          curvature ? styles.curved : '',
          reduced ? styles.instant : '',
        ].join(' ')}
        role="region"
        aria-label={ariaLabel}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </Panel>
  );
});
