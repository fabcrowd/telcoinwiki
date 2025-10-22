export const parseUnit = (value: string): number => Number.parseFloat(value) || 0

export const parsePx = (value: string | undefined | null): number => {
  if (!value) return 0
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const clampPercent = (value: number): number => Math.max(0, Math.min(100, value))

export const approx = (a: number, b: number, epsilon = 0.45): boolean =>
  Math.abs(a - b) <= epsilon
