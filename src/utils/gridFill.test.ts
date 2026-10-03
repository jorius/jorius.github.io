// packages
import { describe, expect, it } from 'vitest';

// utils
import { fillerCount } from './gridFill';

// A BCardGrid paints its background in the rule colour to draw the 1px
// lines, so every track of the last row must be covered by a cell.
describe('fillerCount', () => {
  it('pads the last row to a full set of columns', () => {
    expect(fillerCount(14, 3)).toBe(1); // /projects at desktop
    expect(fillerCount(3, 2)).toBe(1); // Work at tablet width
    expect(fillerCount(6, 3)).toBe(0); // Record at desktop
    expect(fillerCount(5, 3)).toBe(1);
  });

  it('never pads a full row, an empty grid or a single column', () => {
    expect(fillerCount(3, 3)).toBe(0);
    expect(fillerCount(0, 3)).toBe(0);
    expect(fillerCount(7, 1)).toBe(0);
  });
});
