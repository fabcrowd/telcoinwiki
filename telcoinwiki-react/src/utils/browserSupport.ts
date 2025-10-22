interface Connection {
  saveData?: boolean
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
}

interface NavigatorWithConnection extends Navigator {
  connection?: Connection
}

export const detectScrollTimelineSupport = (): boolean => {
  if (typeof window === 'undefined') return false
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false
  try {
    return CSS.supports('animation-timeline: scroll()') || CSS.supports('view-timeline-name: --stack')
  } catch {
    return false
  }
}

export const detectCompactViewport = (query: string): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(query).matches
}

export const getSaveDataPreference = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return (navigator as NavigatorWithConnection).connection?.saveData === true
}

export const getEffectiveConnectionType = (): 'slow-2g' | '2g' | '3g' | '4g' | undefined => {
  if (typeof navigator === 'undefined') return undefined
  return (navigator as NavigatorWithConnection).connection?.effectiveType
}

export const createMediaQueryListener = (
  query: string,
  callback: (matches: boolean) => void
): (() => void) | undefined => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined

  const mediaQueryList = window.matchMedia(query)
  const listener = (event: MediaQueryListEvent) => callback(event.matches)

  callback(mediaQueryList.matches)

  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', listener)
    return () => mediaQueryList.removeEventListener('change', listener)
  }

  if (typeof mediaQueryList.addListener === 'function') {
    mediaQueryList.addListener(listener)
    return () => mediaQueryList.removeListener(listener)
  }

  return undefined
}
