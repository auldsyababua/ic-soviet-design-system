import type { Meta, StoryObj } from '@storybook/react';
const Welcome = () => (
  <div style={{ fontFamily: 'sans-serif', color: '#d6dad6', padding: 24 }}>
    <h1>THE FACILITY — Design System</h1>
    <p>Scaffold online. Tokens and components arrive in later phases.</p>
  </div>
);
const meta: Meta<typeof Welcome> = { title: 'Welcome', component: Welcome };
export default meta;
export const Default: StoryObj<typeof Welcome> = {};
