import { useMemo, type CSSProperties } from 'react'

export interface UsePinOptions {
  /** CSS top offset for sticky pinning (e.g., 64, '10vh'). Default '20vh'. */
  top?: number | string
  /** Disable pin behavior entirely. */
  disabled?: boolean
}

/**
 * Returns inline styles for CSS sticky pinning. Purely declarative; no layout changes
 * unless you apply the returned styles to your element. JS fallbacks can be added later
 * if required by a specific panel.
 */
export function usePin({ top = '20vh', disabled = false }: UsePinOptions = {}) {
  const pinStyle = useMemo<CSSProperties>(() => {
    if (disabled) return {}
    const resolvedTop = typeof top === 'number' ? `${top}px` : top
    return {
      position: 'sticky',
      top: resolvedTop,
      willChange: 'transform',
    }
  }, [top, disabled])

  return { pinStyle }
}

