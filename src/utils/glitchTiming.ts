// Durations for the Glitch primitive, apart from the component so the ranges
// are unit-testable. Every function takes the random number as an argument.

type Range = [min: number, max: number];

export const HOVER_ON_MS: Range = [90, 250];
export const HOVER_OFF_MS: Range = [180, 700];
export const AMBIENT_ON_MS: Range = [420, 940];

const within = ([min, max]: Range, rand: number): number => min + (max - min) * rand;

// A hover is a run of short pulses: on, off, on… until the pointer leaves.
export const hoverOn = (rand: number): number => within(HOVER_ON_MS, rand);
export const hoverOff = (rand: number): number => within(HOVER_OFF_MS, rand);

// Ambient: how long a pulse holds.
export const ambientOn = (rand: number): number => within(AMBIENT_ON_MS, rand);

// Ambient: how long to wait before the next pulse. Jitter of 0.35–1.05 on
// the period, shortened by intensity (floored at 0.2) and stretched by rate.
export const ambientWait = (period: number, glitch: number, rate: number, rand: number): number =>
  ((period * (0.35 + rand * 0.7)) / Math.max(0.2, glitch)) * rate;
