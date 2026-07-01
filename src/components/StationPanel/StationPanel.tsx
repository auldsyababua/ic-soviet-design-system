import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './StationPanel.module.css';
import { Panel } from '../Panel';
import { SignagePlate } from '../SignagePlate';
import { HazardStrip } from '../HazardStrip';

export interface StationPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Engraved cast SignagePlate, top-left. */
  title: ReactNode;
  /** Indicator cluster slot, right. */
  status?: ReactNode;
  /** Hazard strip welded along the danger (bottom) edge. */
  hazard?: boolean;
  /** Primary controls, center. */
  children: ReactNode;
}

/**
 * The canonical "one ministry" bezel assembly — a pure slot shell that composes
 * Panel + SignagePlate (title) + a center controls region + a right status
 * region + an optional welded HazardStrip. It carries no color/motion of its own;
 * it lays out whatever the designer passes into each slot. (Contract + Button
 * template: forwardRef, rest spread, className/style passthrough, token-only CSS.)
 */
export const StationPanel = forwardRef<HTMLDivElement, StationPanelProps>(function StationPanel(
  { title, status, hazard = false, className = '', children, ...rest },
  ref,
) {
  return (
    <Panel
      ref={ref}
      finish="steel"
      elevation="raised"
      rivets
      className={[styles.station, hazard ? styles.hazardEdge : '', className].join(' ')}
      {...rest}
    >
      <div className={styles.header}>
        <SignagePlate tier="cast" className={styles.title}>
          {title}
        </SignagePlate>
        {status && <div className={styles.status}>{status}</div>}
      </div>
      <div className={styles.controls}>{children}</div>
      {hazard && <HazardStrip severity="danger" className={styles.hazard} />}
    </Panel>
  );
});
