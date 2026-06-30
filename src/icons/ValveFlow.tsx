import { IconBase, type IconProps } from './IconBase';

// Gate valve — bowtie body + stem and handwheel bar.
export function ValveFlow(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8 L12 12.5 L4 17 Z" />
      <path d="M20 8 L12 12.5 L20 17 Z" />
      <path d="M12 12.5 V5" fill="none" stroke="currentColor" strokeOpacity={1} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M8.5 5 H15.5" fill="none" stroke="currentColor" strokeOpacity={1} strokeWidth={1.6} strokeLinecap="round" />
    </IconBase>
  );
}
