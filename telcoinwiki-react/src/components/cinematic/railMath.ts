export function getRailTransforms(totalSlides: number, progress: number, strength = 0.25) {
  const slides = Math.max(1, totalSlides)
  const p = Math.min(1, Math.max(0, progress))
  const totalPercent = -(slides - 1) * 100
<<<<<<< HEAD
  const z = (n: number) => (n === 0 ? 0 : n) // normalize -0 to 0 for stable tests/UI
  const trackX = z(totalPercent * p)
  const bgX = z(totalPercent * (Math.min(Math.max(strength, 0), 1)) * p)
  const scaleX = z(p)
  return { trackX, bgX, scaleX }
}
=======
  const trackX = totalPercent * p
  const bgX = totalPercent * (Math.min(Math.max(strength, 0), 1)) * p
  const scaleX = p
  return { trackX, bgX, scaleX }
}

>>>>>>> origin/main
