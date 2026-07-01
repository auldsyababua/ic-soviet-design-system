import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './SignagePlate.module.css';

export interface SignagePlateProps extends HTMLAttributes<HTMLDivElement> {
  /** cast = permanent engraved enamel · stencil = sprayed metal · taped = improvised. */
  tier?: 'cast' | 'stencil' | 'taped';
  /** Engraved icon slot (leading, from src/icons). */
  icon?: ReactNode;
  /** Tints the text/edge via signal tokens. */
  severity?: 'none' | 'caution' | 'danger';
}

export const SignagePlate = forwardRef<HTMLDivElement, SignagePlateProps>(function SignagePlate(
  { tier = 'cast', icon, severity = 'none', className = '', children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[styles.plate, styles[tier], styles[`sev-${severity}`], className].join(' ')}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
    </div>
  );
});
