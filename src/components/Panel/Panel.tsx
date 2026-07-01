import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Panel.module.css';
import { HazardStrip } from '../HazardStrip';

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  finish?: 'enamel' | 'steel' | 'concrete';
  elevation?: 'raised' | 'recessed' | 'flush';
  /** Four-corner rivet overlay. */
  rivets?: boolean;
  /** Hazard strip welded to the chosen edge. */
  hazardEdge?: 'none' | 'top' | 'bottom' | 'left' | 'right';
  /** Engraved title-plate slot, top-left. */
  title?: ReactNode;
}

const VERTICAL_EDGE = (edge: 'top' | 'bottom' | 'left' | 'right') => edge === 'left' || edge === 'right';

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  {
    finish = 'enamel',
    elevation = 'raised',
    rivets = false,
    hazardEdge = 'none',
    title,
    className = '',
    children,
    style,
    ...rest
  },
  ref,
) {
  return (
    <section
      ref={ref}
      className={[
        styles.panel,
        styles[finish],
        styles[elevation],
        rivets ? styles.rivets : '',
        hazardEdge !== 'none' ? styles[`edge_${hazardEdge}`] : '',
        className,
      ].join(' ')}
      style={style}
      {...rest}
    >
      {hazardEdge !== 'none' && (
        <HazardStrip className={styles.hazard} orientation={VERTICAL_EDGE(hazardEdge) ? 'vertical' : 'horizontal'} />
      )}
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.body}>{children}</div>
    </section>
  );
});
