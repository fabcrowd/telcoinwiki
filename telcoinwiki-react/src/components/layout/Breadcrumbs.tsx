import type { BreadcrumbNode, PageMeta, PageMetaMap } from '../../config/types'

interface BreadcrumbsProps {
  pageId: string
  pageMeta: PageMetaMap
}

function buildBreadcrumbsTrail(pageId: string, pageMeta: PageMetaMap): BreadcrumbNode[] {
  const trail: BreadcrumbNode[] = []
  let pointer: string | null = pageId

  while (pointer) {
    const node: PageMeta | undefined = pageMeta[pointer]
    if (!node) break
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

export function Breadcrumbs({ pageId, pageMeta }: BreadcrumbsProps) {
  const trail = buildBreadcrumbsTrail(pageId, pageMeta)

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb" data-breadcrumbs>
      {trail.map((node, index) => {
        const isLast = index === trail.length - 1
        return (
          <span key={node.id} className="breadcrumbs__segment">
            {index > 0 ? <span className="breadcrumbs__separator">/</span> : null}
            {isLast ? (
              <span aria-current="page">{node.label}</span>
            ) : (
              <a href={node.url}>{node.label}</a>
            )}
          </span>
        )
      })}
    </nav>
  )
}
