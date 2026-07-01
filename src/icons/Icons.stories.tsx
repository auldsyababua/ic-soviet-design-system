import type { Meta, StoryObj } from '@storybook/react';
import { Trefoil, HighVoltage, ValveFlow, Warning } from './index';

const ICONS = [
  { Comp: Trefoil, name: 'Trefoil' },
  { Comp: HighVoltage, name: 'HighVoltage' },
  { Comp: ValveFlow, name: 'ValveFlow' },
  { Comp: Warning, name: 'Warning' },
] as const;

function Gallery() {
  return (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
      {ICONS.map(({ Comp, name }) => (
        <div
          key={name}
          className="mat-crinkle bezel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            padding: 20,
            color: 'var(--bone-100)',
            backgroundBlendMode: 'overlay, overlay, normal',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <Comp size={24} title={`${name} 24`} />
            <Comp size={48} title={`${name} 48`} />
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--enamel-300)' }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof Gallery> = {
  title: 'Signage/Icons',
  component: Gallery,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof Gallery>;
export const All: S = {};
