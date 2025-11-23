import { useEffect, useState } from 'react'

const getViewportHeight = () => {
  if (typeof window === 'undefined') return null
  return Math.round(window.visualViewport?.height ?? window.innerHeight)
}

export function useViewportHeight(): number | null {
  const [viewportHeight, setViewportHeight] = useState<number | null>(() => getViewportHeight())

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    
    const updateHeight = () => {
      // Debounce resize to avoid excessive updates
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(() => {
        setViewportHeight(getViewportHeight())
        resizeTimeout = null
      }, 100)
    }

    // Initial update
    updateHeight()

    window.addEventListener('resize', updateHeight, { passive: true })
    window.visualViewport?.addEventListener('resize', updateHeight, { passive: true })

    return () => {
      window.removeEventListener('resize', updateHeight)
      window.visualViewport?.removeEventListener('resize', updateHeight)
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [])

  return viewportHeight
}
