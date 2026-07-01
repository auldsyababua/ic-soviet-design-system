import type { Meta, StoryObj } from '@storybook/react';
import { CRTScreen } from './CRTScreen';
import { SegmentDisplay } from '../SegmentDisplay';

const meta: Meta<typeof CRTScreen> = {
  title: 'Displays/CRTScreen',
  component: CRTScreen,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof CRTScreen>;

// A few mono terminal lines used as the screen content slot.
const terminalStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 13,
  lineHeight: 1.6,
  letterSpacing: '0.04em',
  whiteSpace: 'pre' as const,
};

const Terminal = () => (
  <pre style={terminalStyle}>
    {`> FACILITY CORE MONITOR v3.11
> LINK ......... ESTABLISHED
> COOLANT ...... 412 K  NOMINAL
> FLUX ......... 1.138 GW
> AWAITING OPERATOR INPUT_`}
  </pre>
);

export const Green: S = {
  args: { phosphor: 'green', 'aria-label': 'Core monitor', children: <Terminal /> },
};

export const Amber: S = {
  args: { phosphor: 'amber', 'aria-label': 'Core monitor', children: <Terminal /> },
};

export const Curved: S = {
  args: { phosphor: 'green', curvature: true, 'aria-label': 'Core monitor', children: <Terminal /> },
};

export const WithTerminalText: S = {
  args: { phosphor: 'amber', size: 'lg', 'aria-label': 'Terminal', children: <Terminal /> },
};

export const WithSegmentReadout: S = {
  args: {
    phosphor: 'green',
    'aria-label': 'Coolant readout',
    children: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <SegmentDisplay value={412} digits={3} variant="seg7" signal="active" />
        <SegmentDisplay value="COOLANT K" variant="dotmatrix" signal="active" />
      </div>
    ),
  },
};

// Idle scanline shimmer is gated by useReducedMotion() and a @media
// (prefers-reduced-motion: reduce) block in CRTScreen.module.css. Set the OS
// "reduce motion" preference to verify the shimmer stops.
export const ReducedMotion: S = {
  args: { phosphor: 'green', 'aria-label': 'Core monitor', children: <Terminal /> },
};
