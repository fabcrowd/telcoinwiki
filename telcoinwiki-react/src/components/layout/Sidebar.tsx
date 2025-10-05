import type { SidebarHeading } from '../../config/types'

interface SidebarItemProps {
  id: string
  label: string
  href: string
}

interface SidebarProps {
  items: SidebarItemProps[]
  activeId?: string | null
  headings?: SidebarHeading[]
  isOpen?: boolean
}

export function Sidebar({ items, activeId, headings = [], isOpen = false }: SidebarProps) {
  return (
    <aside
      id="site-sidebar"
      className={`sidebar${isOpen ? ' is-open' : ''}`}
      data-sidebar
    >
      <div className="sidebar__inner tc-card">
        <p className="sidebar__heading">Knowledge base</p>
        <nav className="sidebar__nav" aria-label="Knowledge base">
          <ul className="sidebar__list" data-sidebar-list>
            {items.map((item) => {
              const isActive = item.id === activeId
              return (
                <li key={item.id} className="sidebar__item">
                  <a
                    id={`sidebar-link-${item.id}`}
                    className={`sidebar__link${isActive ? ' is-active' : ''}`}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                  {isActive && headings.length > 0 ? (
                    <ul className="sidebar__sublist" aria-labelledby={`sidebar-link-${item.id}`}>
                      {headings.map((heading) => (
                        <li key={heading.id} className="sidebar__subitem">
                          <a className="sidebar__sublink" href={`#${heading.id}`}>
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
