import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import styles from './Button.module.css';
import type { Signal, Size } from '../../types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: Size;
  /** Optional semantic backlight tint when "armed". */
  signal?: Signal;
  /** Engraved icon slot (leading). */
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', signal, icon, className = '', children, style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={[styles.btn, styles[variant], styles[size], className].join(' ')}
      style={{ ...(signal ? ({ ['--armed']: `var(--signal-${signal})` } as CSSProperties) : null), ...style }}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
    </button>
  );
});
