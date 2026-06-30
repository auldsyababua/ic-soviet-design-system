import { IconBase, type IconProps } from './IconBase';

// Radiation trefoil — central hub + three 60°-wide blades at 0/120/240°.
const BLADE = 'M19.79 7.5 A9 9 0 0 1 19.79 16.5 L14.77 13.6 A3.2 3.2 0 0 0 14.77 10.4 Z';

export function Trefoil(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={BLADE} transform="rotate(90 12 12)" />
      <path d={BLADE} transform="rotate(210 12 12)" />
      <path d={BLADE} transform="rotate(330 12 12)" />
      <circle cx={12} cy={12} r={2.2} />
    </IconBase>
  );
}
