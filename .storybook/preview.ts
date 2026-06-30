import '../src/tokens/tokens.css';
import '../src/styles/fonts.css';
import '../src/styles/materials.css';
import '../src/sb-tailwind.css';
import type { Preview } from '@storybook/react';
const preview: Preview = {
  parameters: {
    backgrounds: { default: 'facility', values: [{ name: 'facility', value: '#060706' }] },
    controls: { expanded: true },
  },
};
export default preview;
