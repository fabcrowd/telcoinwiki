export function getRailTransforms(totalSlides: number, progress: number, strength = 0.25) {
  const slides = Math.max(1, totalSlides)
  const p = Math.min(1, Math.max(0, progress))
  const totalPercent = -(slides - 1) * 100
  const normalize = (value: number) => (Object.is(value, -0) ? 0 : value)
  const trackX = normalize(totalPercent * p)
  const bgX = normalize(totalPercent * Math.min(Math.max(strength, 0), 1) * p)
  const scaleX = normalize(p)
  return { trackX, bgX, scaleX }
}
