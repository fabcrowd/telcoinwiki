import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '../../utils/cn'

interface ColorShiftBackgroundProps extends ComponentPropsWithoutRef<'div'> {
  from?: string
  to?: string
}

export function ColorShiftBackground({
  className,
  style,
  from = 'rgba(31, 103, 255, 0.45)',
  to = 'rgba(112, 67, 255, 0.2)',
  ...rest
}: ColorShiftBackgroundProps) {
  return (
    <div
      data-color-shift=""
      aria-hidden
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden transition-[clip-path] duration-700 ease-out',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        clipPath: 'inset(var(--color-shift-clip, 0%) 0 0 0)',
        ...style,
      }}
      {...rest}
    />
  )
}
