/**
 * Clamp a value between 0 and 1
 */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * Linear interpolation between two values
 * @param a Start value
 * @param b End value
 * @param t Interpolation factor (0-1)
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}

