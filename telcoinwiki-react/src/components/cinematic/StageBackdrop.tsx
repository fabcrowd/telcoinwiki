import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { cn } from '../../utils/cn'
import { clamp01, lerp } from '../../utils/interpolate'

interface StageBackdropProps extends ComponentPropsWithoutRef<'div'> {
  progress: number
}

export function StageBackdrop({ progress, className, style, ...rest }: StageBackdropProps) {
  const clamped = clamp01(progress)
  // Small back-out easing to create a gentle "settle" as sections complete
  const backOut = (t: number, s = 0.7) => {
    const x = t - 1
    return 1 + (s + 1) * x * x * x + s * x * x
  }
  const eased = Math.min(backOut(clamped), 1.06)

  const overlayAlpha = lerp(0.24, 0.58, eased)
  const spotAlpha = lerp(0.18, 0.46, eased)
  const clip = lerp(32, 0, eased)
  const spotX = lerp(44, 56, eased)
  const spotY = lerp(28, 64, eased)
  const opacity = lerp(0.82, 1, eased)
  const scale = lerp(0.995, 1.012, eased)

  const backdropStyle = {
    '--stage-overlay-alpha': overlayAlpha.toFixed(3),
    '--stage-spot-alpha': spotAlpha.toFixed(3),
    '--stage-spot-x': `${spotX.toFixed(1)}%`,
    '--stage-spot-y': `${spotY.toFixed(1)}%`,
    '--stage-backdrop-clip': `${clip.toFixed(2)}%`,
    '--stage-backdrop-opacity': opacity.toFixed(3),
    '--stage-backdrop-scale': scale.toFixed(3),
    ...style,
  } as CSSProperties

  return (
    <div
      aria-hidden
      data-stage-backdrop
      className={cn('stage-backdrop', className)}
      style={backdropStyle}
      {...rest}
    />
  )
}
