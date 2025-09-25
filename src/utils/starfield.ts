export interface Star {
  x: number;
  y: number;
  depth: number;
  alpha: number;
}

export function createStar(width: number, height: number): Star {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth: Math.random(),
    alpha: 0.25 + Math.random() * 0.55
  };
}

export function updateStar(star: Star, velocity: number, width: number, height: number): Star {
  const parallax = 1 - star.depth * 0.7;
  let nextY = star.y + velocity * parallax;

  if (nextY > height) {
    nextY -= height;
  } else if (nextY < 0) {
    nextY += height;
  }

  return { ...star, y: nextY };
}

export function decayVelocity(velocity: number, damping = 0.9, threshold = 0.005): number {
  const next = velocity * damping;
  return Math.abs(next) < threshold ? 0 : next;
}

export function addScrollImpulse(
  velocity: number,
  delta: number,
  factor = 0.003,
  maxMagnitude = 1.4
): number {
  const next = velocity + delta * factor;
  if (next > maxMagnitude) {
    return maxMagnitude;
  }
  if (next < -maxMagnitude) {
    return -maxMagnitude;
  }
  return next;
}
