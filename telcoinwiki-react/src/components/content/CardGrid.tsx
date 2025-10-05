import type { ReactNode } from 'react'

export interface CardGridItem {
  id: string
  title: ReactNode
  body: ReactNode
  footer?: ReactNode
}

interface CardGridProps {
  columns?: 1 | 2 | 3
  items: CardGridItem[]
  role?: 'list' | 'presentation'
}

export function CardGrid({ columns = 2, items, role = 'list' }: CardGridProps) {
  const columnClass = `card-grid card-grid--cols-${columns}`

  return (
    <div className={columnClass} role={role}>
      {items.map(({ id, title, body, footer }) => (
        <article key={id} className="card" role={role === 'list' ? 'listitem' : undefined}>
          <h3 className="card__title">{title}</h3>
          {body}
          {footer ?? null}
        </article>
      ))}
    </div>
  )
}
