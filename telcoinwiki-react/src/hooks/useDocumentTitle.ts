import { useEffect } from 'react'

const SITE_NAME = 'Telcoin Wiki'

/**
 * Keeps the browser document title in sync with the active route.
 * The home page shows the bare site name; other pages are suffixed with it
 * so browser tabs, history entries, and bookmarks stay distinguishable.
 */
export function useDocumentTitle(pageLabel?: string | null, isHome = false) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.title = !pageLabel || isHome ? SITE_NAME : `${pageLabel} · ${SITE_NAME}`
  }, [pageLabel, isHome])
}
