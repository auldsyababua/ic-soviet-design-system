import { IconBase, type IconProps } from './IconBase';

// Warning triangle with exclamation (outline triangle, filled mark).
export function Warning(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M12 3 L22.5 21 H1.5 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity={1}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <rect x={11} y={9} width={2} height={6} rx={0.6} />
      <circle cx={12} cy={18} r={1.2} />
    </IconBase>
  );
}
