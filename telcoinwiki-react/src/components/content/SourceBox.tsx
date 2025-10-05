import type { ReactNode } from 'react'

export interface SourceLink {
  label: ReactNode
  href: string
  external?: boolean
}

interface SourceBoxProps {
  title?: ReactNode
  links: SourceLink[]
  className?: string
}

export function SourceBox({ title = 'Official resources', links, className }: SourceBoxProps) {
  return (
    <div className={`source-box${className ? ` ${className}` : ''}`}>
      <p className="source-box__title">{title}</p>
      <ul className="source-box__links">
        {links.map(({ label, href, external }, index) => (
          <li key={index}>
            <a
              className="source-box__link"
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
