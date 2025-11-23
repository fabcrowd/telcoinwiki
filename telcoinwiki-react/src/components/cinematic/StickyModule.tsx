import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo, useRef } from 'react'

import { cn } from '../../utils/cn'

interface StickyModuleProps extends Omit<ComponentPropsWithoutRef<'section'>, 'content'> {
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

  // Enable sticky stacking for main card
  const enableStickyStack = true
  
  // Mobile scroll animations: use IntersectionObserver for main card
  const stickyLeadRef = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  
  // Calculate and set mobile sticky top position based on main card height
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkMobile = () => window.innerWidth <= 768
    if (!checkMobile()) return
    
    const stickyElement = stickyLeadRef.current
    const section = sectionRef.current
    if (!stickyElement || !section) return
    
    const calculateStickyTop = () => {
      // Get header height
      const header = document.querySelector<HTMLElement>('.site-header')
      const headerHeight = header ? header.getBoundingClientRect().height : 100
      
      // Get main card height (including bullet points)
      const mainCardRect = stickyElement.getBoundingClientRect()
      const mainCardHeight = mainCardRect.height
      
      // Calculate top position: header + main card + small gap
      const stickyTop = headerHeight + mainCardHeight + 16 // 16px gap
      
      // Set CSS variable for subcards to use
      section.style.setProperty('--mobile-sticky-top', `${stickyTop}px`)
    }
    
    // Calculate on load and resize
    calculateStickyTop()
    
    const resizeObserver = new ResizeObserver(() => {
      calculateStickyTop()
    })
    
    resizeObserver.observe(stickyElement)
    if (stickyElement.querySelector('.workspace-pin__list')) {
      const listElement = stickyElement.querySelector('.workspace-pin__list')
      if (listElement) {
        resizeObserver.observe(listElement)
      }
    }
    
    const handleResize = () => {
      if (checkMobile()) {
        calculateStickyTop()
      }
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Mobile sticky stacking now uses the same system as desktop
  // No separate animation logic needed

  // Combine refs for section element
  const sectionRefCallback = (node: HTMLElement | null) => {
    sectionRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }
  
  return (
    <section
      ref={sectionRefCallback}
      className={cn(
        'relative',
        enableStickyStack && !prefersReducedMotion ? '' : 'isolate',
        className
      )}
      data-sticky-module=""
      data-sticky-stack={enableStickyStack ? '' : undefined}
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
            ref={stickyLeadRef}
            className={cn(
              'lg:self-start',
              enableStickyStack && !prefersReducedMotion ? 'lg:sticky' : 'lg:static',
              stickyClassName
            )}
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
