import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Export Lenis type for use in hooks
export type { Lenis }

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Check if window width is desktop (>1024px)
function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth > 1024
}

// Check if user prefers reduced motion
function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let lenisInstance: Lenis | null = null

/**
 * Initialize Lenis smooth scrolling (desktop only)
 * Based on avax.network implementation - simple init on DOMContentLoaded
 */
export function initLenisScroll(): Lenis | null {
  // Only initialize on desktop and if user doesn't prefer reduced motion
  if (typeof window === 'undefined' || !isDesktop() || prefersReducedMotion()) {
    return null
  }

  // If already initialized, return existing instance
  if (lenisInstance) {
    return lenisInstance
  }

  // Initialize Lenis with optimized settings for maximum performance
  lenisInstance = new Lenis({
    autoRaf: true,
    prevent: (element: HTMLElement) => {
      // Prevent Lenis on specific elements
      return element.id === 'tags-items' || element.id === 'categories-items'
    },
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1,
    wheelMultiplier: 1,
    // Performance optimizations for better FPS
    duration: 1.0, // Faster duration for better responsiveness
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optimized easing
    infinite: false, // Disable infinite scroll for better performance
    // Additional performance settings
    lerp: 0.1, // Lower lerp for faster response (default is 0.1)
    orientation: 'vertical' as const, // Explicit vertical orientation
  })

  // Add 'lenis' class to html element (like avax.network)
  document.documentElement.classList.add('lenis')

  // Sync Lenis with GSAP ScrollTrigger (for any ScrollTrigger animations)
  // Note: Cards use CSS sticky, NOT ScrollTrigger - this is only for other animations
  lenisInstance.on('scroll', ScrollTrigger.update)

  // Store ticker callback for cleanup
  const tickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000)
  }
  
  // Use GSAP ticker for RAF (exactly like avax.network)
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)
  
  // Store ticker callback for cleanup
  ;(lenisInstance as any)._tickerCallback = tickerCallback

  // Initialize scroll position
  lenisInstance.scrollTo(0, { immediate: true })

  // Store event handlers for cleanup
  const handleDisableScroll = () => {
    lenisInstance?.stop()
    document.documentElement.classList.add('scroll-disabled')
  }
  
  const handleEnableScroll = () => {
    lenisInstance?.start()
    document.documentElement.classList.remove('scroll-disabled')
  }
  
  const handleResizeScroll = () => {
    document.documentElement.classList.remove('scroll-disabled')
    lenisInstance?.resize()
  }
  
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  const handleResize = () => {
    if (resizeTimeout !== null) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(() => {
      if (isDesktop()) {
        lenisInstance?.resize()
      } else {
        // If window becomes mobile, destroy Lenis
        destroyLenisScroll()
      }
      resizeTimeout = null
    }, 250)
  }

  // Custom event listeners for enable/disable/resize
  window.addEventListener('disableScroll', handleDisableScroll)
  window.addEventListener('enableScroll', handleEnableScroll)
  window.addEventListener('resizeScroll', handleResizeScroll)
  window.addEventListener('resize', handleResize, { passive: true })

  // Store handlers for cleanup
  ;(lenisInstance as any)._eventHandlers = {
    disableScroll: handleDisableScroll,
    enableScroll: handleEnableScroll,
    resizeScroll: handleResizeScroll,
    resize: handleResize,
    resizeTimeout,
  }

  return lenisInstance
}

/**
 * Get the current Lenis instance
 */
export function getLenisInstance(): Lenis | null {
  return lenisInstance
}

/**
 * Destroy Lenis instance
 */
export function destroyLenisScroll(): void {
  if (lenisInstance) {
    // Clean up event listeners
    const handlers = (lenisInstance as any)._eventHandlers
    if (handlers) {
      window.removeEventListener('disableScroll', handlers.disableScroll)
      window.removeEventListener('enableScroll', handlers.enableScroll)
      window.removeEventListener('resizeScroll', handlers.resizeScroll)
      window.removeEventListener('resize', handlers.resize)
      if (handlers.resizeTimeout) {
        clearTimeout(handlers.resizeTimeout)
      }
      delete (lenisInstance as any)._eventHandlers
    }
    
    // Remove GSAP ticker callback
    if (typeof window !== 'undefined' && typeof gsap !== 'undefined') {
      const tickerCallback = (lenisInstance as any)._tickerCallback
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback)
        delete (lenisInstance as any)._tickerCallback
      }
    }
    
    lenisInstance.destroy()
    lenisInstance = null
    // Remove lenis class from html
    document.documentElement.classList.remove('lenis')
  }
}

/**
 * Scroll to a target (element, selector, or position)
 */
export function scrollTo(
  target: string | HTMLElement | number,
  options?: {
    offset?: number
    immediate?: boolean
    duration?: number
    easing?: (t: number) => number
    onComplete?: () => void
  },
): void {
  if (!lenisInstance) {
    // Fallback to native scroll if Lenis not initialized
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'instant' : 'smooth' })
    } else if (typeof target === 'string') {
      const element = document.querySelector(target)
      if (element) {
        element.scrollIntoView({ behavior: options?.immediate ? 'instant' : 'smooth', block: 'start' })
      }
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options?.immediate ? 'instant' : 'smooth', block: 'start' })
    }
    return
  }

  lenisInstance.scrollTo(target, options)
}

