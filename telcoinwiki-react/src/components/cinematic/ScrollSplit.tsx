import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'

import { cn } from '../../utils/cn'

interface ScrollSplitProps extends ComponentPropsWithoutRef<'div'> {
  lead: ReactNode
  aside?: ReactNode
  asideTop?: string | number
  asideClassName?: string
  leadClassName?: string
  prefersReducedMotion?: boolean
}

export const ScrollSplit = forwardRef<HTMLDivElement, ScrollSplitProps>(function ScrollSplit(
  {
    lead,
    aside,
    asideTop = '25vh',
    asideClassName,
    leadClassName,
    prefersReducedMotion = false,
    className,
    ...rest
  },
  ref,
) {
  const resolvedTop = useMemo(() => (typeof asideTop === 'number' ? `${asideTop}px` : asideTop), [asideTop])

  return (
    <div
      ref={ref}
      className={cn('grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]', className)}
      data-scroll-split=""
      {...rest}
    >
      <div className={cn('flex flex-col gap-6', leadClassName)} data-scroll-split-lead="">
        {lead}
      </div>
      {aside ? (
        <div
          className={cn('flex flex-col gap-6', prefersReducedMotion ? 'lg:static' : 'lg:sticky', asideClassName)}
          style={{ top: resolvedTop }}
          data-scroll-split-aside=""
        >
          {aside}
        </div>
      ) : null}
    </div>
  )
})
