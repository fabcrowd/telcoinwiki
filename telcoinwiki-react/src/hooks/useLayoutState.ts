import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PageMetaMap } from '../config/types'

const buildSidebarItems = (pageMeta: PageMetaMap) =>
  Object.entries(pageMeta)
    .filter(([, meta]) => meta.sidebar)
    .map(([id, meta]) => ({ id, label: meta.label, href: meta.url }))

type SidebarItem = {
  id: string
  label: string
  href: string
}

type LayoutStateOptions = {
  pageId: string
  pageMeta: PageMetaMap
}

type LayoutState = {
  activeNavId: string | null
  sidebarItems: SidebarItem[]
  isSidebarOpen: boolean
  openSidebar: (origin?: HTMLElement | null) => void
  closeSidebar: () => void
  toggleSidebar: (origin?: HTMLElement | null) => void
}

export const useLayoutState = ({ pageId, pageMeta }: LayoutStateOptions): LayoutState => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const focusReturnRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  const currentMeta = useMemo(() => pageMeta[pageId] ?? pageMeta.home, [pageMeta, pageId])
  const activeNavId = currentMeta?.navId ?? pageId ?? null

  const sidebarItems = useMemo<SidebarItem[]>(() => buildSidebarItems(pageMeta), [pageMeta])

  const openSidebar = useCallback((origin?: HTMLElement | null) => {
    if (origin instanceof HTMLElement) {
      focusReturnRef.current = origin
    }
    setSidebarOpen(true)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const toggleSidebar = useCallback(
    (origin?: HTMLElement | null) => {
      if (isSidebarOpen) {
        closeSidebar()
      } else {
        openSidebar(origin)
      }
    },
    [isSidebarOpen, closeSidebar, openSidebar],
  )

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeSidebar()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isSidebarOpen, closeSidebar])

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', isSidebarOpen)
    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [isSidebarOpen])

  useEffect(() => {
    if (wasOpenRef.current && !isSidebarOpen) {
      const origin = focusReturnRef.current
      if (origin) {
        origin.focus({ preventScroll: true })
      }
      focusReturnRef.current = null
    }
    wasOpenRef.current = isSidebarOpen
  }, [isSidebarOpen])

  useEffect(() => {
    if (isSidebarOpen) {
      closeSidebar()
    }
  }, [pageId, closeSidebar, isSidebarOpen])

  return {
    activeNavId,
    sidebarItems,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  }
}
