export function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0
  }

  if (value < 0) {
    return 0
  }

  if (value > 1) {
    return 1
  }

  return value
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
