// packages
import { describe, expect, it } from 'vitest';

// utils
import { youtubeId } from './youtube';

describe('youtubeId', () => {
  it('reads watch, short and embed URLs', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=jRgjRiCqwJE')).toBe('jRgjRiCqwJE');
    expect(youtubeId('https://youtu.be/jRgjRiCqwJE?si=x')).toBe('jRgjRiCqwJE');
    expect(youtubeId('https://www.youtube.com/watch?t=3&v=jRgjRiCqwJE')).toBe('jRgjRiCqwJE');
    expect(youtubeId('https://www.youtube.com/embed/jRgjRiCqwJE')).toBe('jRgjRiCqwJE');
  });

  it('ignores everything else', () => {
    expect(youtubeId('/images/writing/home-lab-topology.png')).toBeNull();
    expect(youtubeId('https://evil.com/?v=jRgjRiCqwJE')).toBeNull();
  });
});
