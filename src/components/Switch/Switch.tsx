import { forwardRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import styles from './Switch.module.css';
import type { Size } from '../../types';

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  kind?: 'toggle' | 'guarded' | 'three-position';
  /** Three-position lever facing; ignored for toggle/guarded. */
  position?: -1 | 0 | 1;
  size?: Size;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THREE_POS: ReadonlyArray<-1 | 0 | 1> = [-1, 0, 1];
const THREE_POS_LABELS: Record<-1 | 0 | 1, string> = { [-1]: 'OFF', [0]: 'AUTO', [1]: 'ON' };

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    onChange,
    kind = 'toggle',
    position = 0,
    size = 'md',
    label,
    disabled = false,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  // The guarded cover must lift before the lever can throw.
  const [covered, setCovered] = useState(true);

  if (kind === 'three-position') {
    // position maps to a value via onChange(next>0); the host owns the index,
    // but onChange's boolean contract reports "energised" (position === 1).
    const idx = THREE_POS.indexOf(position);
    const step = (delta: number) => {
      if (disabled) return;
      const next = THREE_POS[Math.min(THREE_POS.length - 1, Math.max(0, idx + delta))];
      if (next !== position) onChange(next === 1);
    };
    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    };
    return (
      <div
        className={[styles.root, styles[size], styles.three, className].join(' ')}
        style={style}
        {...rest}
      >
        <div
          role="radiogroup"
          aria-label={label ?? 'three-position switch'}
          aria-disabled={disabled || undefined}
          className={styles.body}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={onKey}
        >
          <span className={styles.slot} />
          <span
            className={styles.lever}
            data-pos={position}
            aria-hidden
          />
          {THREE_POS.map((p) => (
            // semantic radios; visually represented by the single physical lever
            <span
              key={p}
              role="radio"
              aria-checked={p === position}
              aria-label={THREE_POS_LABELS[p]}
              className={styles.sr}
            />
          ))}
        </div>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    );
  }

  const armed = kind !== 'guarded' || !covered;
  const toggle = () => {
    if (disabled) return;
    if (!armed) {
      setCovered(false);
      return;
    }
    onChange(!checked);
  };

  return (
    <div className={[styles.root, styles[size], className].join(' ')} style={style} {...rest}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        className={[styles.body, styles.button, checked ? styles.on : ''].join(' ')}
      >
        <span className={styles.slot} />
        <span className={styles.lever} aria-hidden />
        <span className={styles.tickO} aria-hidden>
          O
        </span>
        <span className={styles.tickI} aria-hidden>
          I
        </span>
        {kind === 'guarded' && (
          <span
            className={[styles.cover, covered ? styles.covered : styles.lifted].join(' ')}
            aria-hidden
            onClick={(e) => {
              // first click lifts the cover only
              if (covered) {
                e.stopPropagation();
                if (!disabled) setCovered(false);
              }
            }}
            style={{ ['--armed']: 'var(--signal-hazard)' } as CSSProperties}
          />
        )}
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
});
