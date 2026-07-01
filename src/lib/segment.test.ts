import { formatSegments } from './segment';

it('right-pads/truncates to digit count', () => {
  expect(formatSegments(42, 4)).toBe('  42');
  expect(formatSegments(13800, 4)).toBe('3800'); // overflow keeps low digits
});
it('renders strings (e.g. time) verbatim within width', () => {
  expect(formatSegments('03:42', 5)).toBe('03:42');
});
