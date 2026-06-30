import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Square px size. Default 24. */
  size?: number;
  /** Accessible name. When omitted the icon is decorative (aria-hidden). */
  title?: string;
}

/**
 * Engraved-style icon frame: solid glyph in `currentColor` with a hairline
 * `--bone` highlight stroke so it reads as stamped/engraved metal. Individual
 * glyph paths may override fill/stroke (e.g. outline-only shapes).
 */
export function IconBase({ size = 24, title, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="var(--bone-100)"
      strokeOpacity={0.18}
      strokeWidth={0.5}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
