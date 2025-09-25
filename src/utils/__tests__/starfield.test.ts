import { addScrollImpulse, decayVelocity, updateStar } from '../starfield';

describe('starfield utilities', () => {
  it('wraps stars vertically when they leave the viewport', () => {
    const star = { x: 10, y: 101, depth: 0.2, alpha: 0.5 };
    const updated = updateStar(star, 5, 100, 100);
    expect(updated.y).toBeLessThanOrEqual(100);
    expect(updated.y).toBeGreaterThanOrEqual(0);
  });

  it('decays velocity toward zero', () => {
    const reduced = decayVelocity(1);
    expect(reduced).toBeLessThan(1);
    const settled = decayVelocity(0.0001);
    expect(settled).toBe(0);
  });

  it('limits scroll impulse to prevent runaway velocity', () => {
    const boosted = addScrollImpulse(0, 1000);
    expect(boosted).toBeLessThanOrEqual(1.4);
  });
});
