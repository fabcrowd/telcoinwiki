import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'

import { cn } from '../../utils/cn'

interface StickyModuleProps extends ComponentPropsWithoutRef<'section'> {
  sticky: ReactNode
  content: ReactNode
  top?: string | number
  containerClassName?: string
  stickyClassName?: string
  contentClassName?: string
  background?: ReactNode
  prefersReducedMotion?: boolean
  stickyStyle?: CSSProperties
  timelineDriven?: boolean
}

export const StickyModule = forwardRef<HTMLElement, StickyModuleProps>(function StickyModule(
  {
    sticky,
    content,
    top = '20vh',
    containerClassName,
    stickyClassName,
    contentClassName,
    className,
    background,
    prefersReducedMotion = false,
    stickyStyle,
    timelineDriven = false,
    ...rest
  },
  ref,
) {
  const resolvedTop = useMemo(() => (typeof top === 'number' ? `${top}px` : top), [top])
  const mergedStickyStyle = useMemo(() => {
    if (prefersReducedMotion) {
      return { top: resolvedTop }
    }

    return {
      top: resolvedTop,
      ...(stickyStyle ?? {}),
    }
  }, [prefersReducedMotion, resolvedTop, stickyStyle])

  return (
    <section
      ref={ref}
      className={cn('relative isolate', className)}
      data-sticky-module=""
      data-prefers-reduced-motion={prefersReducedMotion ? '' : undefined}
      data-timeline-module={timelineDriven ? '' : undefined}
      {...rest}
    >
      {background}
      <div
        className={cn(
          'mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 sm:px-8 lg:gap-16 lg:px-12',
          containerClassName,
        )}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div
            className={cn('lg:self-start', prefersReducedMotion ? 'lg:static' : 'lg:sticky', stickyClassName)}
            style={mergedStickyStyle}
            data-sticky-module-lead=""
          >
            {sticky}
          </div>
          <div className={cn('flex flex-col gap-10', contentClassName)} data-sticky-module-content="">
            {content}
          </div>
        </div>
      </div>
    </section>
  )
})
