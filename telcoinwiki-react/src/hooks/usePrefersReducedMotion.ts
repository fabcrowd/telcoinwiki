import { useEffect, useState } from 'react'

const PREFERS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }

    return window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQueryList = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY)

    const updatePreference = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches)
    }

    updatePreference(mediaQueryList)

    if ('addEventListener' in mediaQueryList) {
      mediaQueryList.addEventListener('change', updatePreference)
    } else {
      mediaQueryList.addListener(updatePreference)
    }

    return () => {
      if ('removeEventListener' in mediaQueryList) {
        mediaQueryList.removeEventListener('change', updatePreference)
      } else {
        mediaQueryList.removeListener(updatePreference)
      }
    }
  }, [])

  return prefersReducedMotion
}
