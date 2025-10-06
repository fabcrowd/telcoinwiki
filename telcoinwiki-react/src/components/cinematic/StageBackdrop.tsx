import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { cn } from '../../utils/cn'
import { clamp01, lerp } from '../../utils/interpolate'

interface StageBackdropProps extends ComponentPropsWithoutRef<'div'> {
  progress: number
}

export function StageBackdrop({ progress, className, style, ...rest }: StageBackdropProps) {
  const clamped = clamp01(progress)

  const overlayAlpha = lerp(0.24, 0.58, clamped)
  const spotAlpha = lerp(0.18, 0.46, clamped)
  const clip = lerp(32, 0, clamped)
  const spotX = lerp(44, 56, clamped)
  const spotY = lerp(28, 64, clamped)
  const opacity = lerp(0.82, 1, clamped)

  const backdropStyle = {
    '--stage-overlay-alpha': overlayAlpha.toFixed(3),
    '--stage-spot-alpha': spotAlpha.toFixed(3),
    '--stage-spot-x': `${spotX.toFixed(1)}%`,
    '--stage-spot-y': `${spotY.toFixed(1)}%`,
    '--stage-backdrop-clip': `${clip.toFixed(2)}%`,
    '--stage-backdrop-opacity': opacity.toFixed(3),
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
