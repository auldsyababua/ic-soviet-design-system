import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { SegmentDisplay } from './SegmentDisplay';

const meta: Meta<typeof SegmentDisplay> = {
  title: 'Displays/SegmentDisplay',
  component: SegmentDisplay,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof SegmentDisplay>;

export const Seg7: S = { args: { value: 1138, digits: 4, variant: 'seg7' } };
export const Seg14: S = { args: { value: 'CORE', digits: 4, variant: 'seg14' } };
export const DotMatrix: S = { args: { value: 'NOMINAL', variant: 'dotmatrix', signal: 'active' } };
export const Ambient: S = { args: { value: 412, digits: 3, signal: 'ambient', variant: 'seg7' } };
export const Active: S = { args: { value: 412, digits: 3, signal: 'active', variant: 'seg7' } };

// Live clock — value changes every second, flickering on each tick (unless
// reduced-motion is set).
export const Clock: S = {
  render: () => {
    const [t, setT] = useState('03:42:17');
    useEffect(() => {
      let s = 3 * 3600 + 42 * 60 + 17;
      const id = setInterval(() => {
        s = (s + 1) % 86400;
        const hh = String(Math.floor(s / 3600)).padStart(2, '0');
        const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        setT(`${hh}:${mm}:${ss}`);
      }, 1000);
      return () => clearInterval(id);
    }, []);
    return <SegmentDisplay value={t} digits={8} variant="seg7" signal="active" />;
  },
};

// Motion (flicker-on-change) is gated by useReducedMotion() and a @media
// (prefers-reduced-motion: reduce) block in SegmentDisplay.module.css. Set the
// OS "reduce motion" preference to verify changes apply instantly.
export const ReducedMotion: S = { args: { value: 88.8, variant: 'seg7', signal: 'ambient' } };
