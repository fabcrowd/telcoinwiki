import type { ComponentPropsWithoutRef, CSSProperties, ElementType } from 'react'
import { forwardRef } from 'react'

import { cn } from '../../utils/cn'
import { clamp01, lerp } from '../../utils/interpolate'

interface ColorMorphCardProps extends ComponentPropsWithoutRef<'article'> {
  progress: number
  as?: ElementType
}

export const ColorMorphCard = forwardRef<HTMLElement, ColorMorphCardProps>(function ColorMorphCard(
  { as, progress, className, style, children, ...rest },
  ref,
) {
  const Component = (as ?? 'article') as ElementType
  const clamped = clamp01(progress)

  const overlayAlpha = lerp(0.26, 0.64, clamped)
  const borderAlpha = lerp(0.28, 0.56, clamped)
  const shadowAlpha = lerp(0.18, 0.46, clamped)
  const styleWithMorph = {
    '--stage-card-overlay-alpha': overlayAlpha.toFixed(3),
    '--stage-card-border-alpha': borderAlpha.toFixed(3),
    '--stage-card-shadow-alpha': shadowAlpha.toFixed(3),
    ...style,
  } as CSSProperties

  return (
    <Component ref={ref as never} className={cn('color-morph-card', className)} style={styleWithMorph} {...rest}>
      {children}
    </Component>
  )
})
