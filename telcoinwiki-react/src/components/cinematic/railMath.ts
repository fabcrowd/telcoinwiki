const normalizeZero = (value: number) => (Object.is(value, -0) ? 0 : value)

export function getRailTransforms(totalSlides: number, progress: number, strength = 0.25) {
  const slides = Math.max(1, totalSlides)
  const clampedProgress = clamp01(progress)
  const normalizedStrength = clamp01(strength)
  const totalPercent = -(slides - 1) * 100

  const trackX = normalizeZero(totalPercent * clampedProgress)
  const bgX = normalizeZero(totalPercent * normalizedStrength * clampedProgress)
  const scaleX = normalizeZero(clampedProgress)

  return { trackX, bgX, scaleX }
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.min(1, Math.max(0, value))
}

