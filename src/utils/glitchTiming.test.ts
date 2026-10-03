// packages
import { describe, expect, it } from 'vitest';

// utils
import { ambientOn, ambientWait, hoverOff, hoverOn } from './glitchTiming';

describe('hover pulses', () => {
  it('turn on for 90–250ms and off for 180–700ms', () => {
    expect(hoverOn(0)).toBe(90);
    expect(hoverOn(1)).toBe(250);
    expect(hoverOff(0)).toBe(180);
    expect(hoverOff(1)).toBe(700);
    expect(hoverOn(0.5)).toBeCloseTo(170);
  });
});

describe('ambient schedule', () => {
  it('keeps the live site timing: on 420–940ms, wait scaled by jitter, intensity and rate', () => {
    expect(ambientOn(0)).toBe(420);
    expect(ambientOn(1)).toBe(940);
    expect(ambientWait(5200, 1, 1, 0)).toBeCloseTo(5200 * 0.35);
    expect(ambientWait(5200, 1, 1, 1)).toBeCloseTo(5200 * 1.05);
    expect(ambientWait(5200, 2, 1, 0)).toBeCloseTo((5200 * 0.35) / 2);
    expect(ambientWait(5200, 1, 2, 0)).toBeCloseTo(5200 * 0.35 * 2);
  });

  it('never divides by an intensity below 0.2', () => {
    expect(ambientWait(1000, 0.05, 1, 0)).toBeCloseTo((1000 * 0.35) / 0.2);
  });
});
