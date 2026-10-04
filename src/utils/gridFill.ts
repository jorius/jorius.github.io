// How many empty cells a card grid needs after its last card so every track
// of the final row is covered. BCardGrid paints its background in the rule
// colour to draw the 1px lines; an uncovered track would show as a block.
export const fillerCount = (count: number, columns: number): number =>
  columns > 1 && count > 0 ? (columns - (count % columns)) % columns : 0;
