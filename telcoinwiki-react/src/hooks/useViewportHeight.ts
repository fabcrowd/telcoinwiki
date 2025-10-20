import { useEffect, useState } from 'react'

const getViewportHeight = () => {
  if (typeof window === 'undefined') return null
  return Math.round(window.visualViewport?.height ?? window.innerHeight)
}

export function useViewportHeight(): number | null {
  const [viewportHeight, setViewportHeight] = useState<number | null>(() => getViewportHeight())

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(getViewportHeight())
    }

    updateHeight()

    window.addEventListener('resize', updateHeight)
    window.visualViewport?.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
      window.visualViewport?.removeEventListener('resize', updateHeight)
    }
  }, [])

  return viewportHeight
}
