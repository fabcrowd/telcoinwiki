import { useMemo } from 'react'
import type { BreadcrumbNode, PageMeta, PageMetaMap } from '../config/types'

const buildTrail = (pageId: string, pageMeta: PageMetaMap): BreadcrumbNode[] => {
  const trail: BreadcrumbNode[] = []
  let pointer: string | null = pageId

  while (pointer) {
    const node: PageMeta | undefined = pointer ? pageMeta[pointer as keyof PageMetaMap] : undefined
    if (!node) {
      break
    }

    trail.unshift({ id: pointer, label: node.label, url: node.url })
    pointer = node.parent
  }

  if (!trail.length || trail[0].id !== 'home') {
    const home = pageMeta.home
    if (home) {
      trail.unshift({ id: 'home', label: home.label, url: home.url })
    }
  }

  return trail
}

export const useBreadcrumbTrail = (pageId: string, pageMeta: PageMetaMap): BreadcrumbNode[] =>
  useMemo(() => buildTrail(pageId, pageMeta), [pageId, pageMeta])
