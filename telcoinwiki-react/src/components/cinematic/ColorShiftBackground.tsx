import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { cn } from '../../utils/cn'

interface ColorShiftBackgroundProps extends ComponentPropsWithoutRef<'div'> {
  from?: string
  to?: string
  prefersReducedMotion?: boolean
}

export function ColorShiftBackground({
  className,
  style,
  from = 'rgba(31, 103, 255, 0.45)',
  to = 'rgba(112, 67, 255, 0.2)',
  prefersReducedMotion = false,
  ...rest
}: ColorShiftBackgroundProps) {
  const resolvedStyle = prefersReducedMotion
    ? ({ clipPath: 'inset(0% 0 0 0)', ...style } as CSSProperties)
    : style

  return (
    <div
      data-color-shift=""
      aria-hidden
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden transition-[clip-path] duration-700 ease-out',
        prefersReducedMotion && 'transition-none',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        clipPath: 'inset(var(--color-shift-clip, 0%) 0 0 0)',
        ...resolvedStyle,
      }}
      {...rest}
    />
  )
}
