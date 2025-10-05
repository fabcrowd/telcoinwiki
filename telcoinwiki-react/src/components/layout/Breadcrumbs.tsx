import type { BreadcrumbNode } from '../../config/types'

interface BreadcrumbsProps {
  trail: BreadcrumbNode[]
}

export function Breadcrumbs({ trail }: BreadcrumbsProps) {
  
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
