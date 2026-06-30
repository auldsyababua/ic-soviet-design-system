import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './HazardStrip.module.css';

export interface HazardStripProps extends HTMLAttributes<HTMLDivElement> {
  /** caution = amber/black, danger = red/black. */
  severity?: 'caution' | 'danger';
  orientation?: 'horizontal' | 'vertical';
  /** Bar thickness in px (the short axis). Default 14. */
  thickness?: number;
}

export const HazardStrip = forwardRef<HTMLDivElement, HazardStripProps>(function HazardStrip(
  { severity = 'caution', orientation = 'horizontal', thickness = 14, className = '', style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="presentation"
      className={[styles.strip, styles[severity], styles[orientation], className].join(' ')}
      style={{ ['--thickness']: `${thickness}px`, ...style } as CSSProperties}
      {...rest}
    />
  );
});
