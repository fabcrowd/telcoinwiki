export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  menu?: NavChild[] | null
}

export type NavItems = NavItem[]

export interface PageMeta {
  label: string
  url: string
  parent: string | null
  navId: string | null
  sidebar?: boolean
}

export type PageMetaMap = Record<string, PageMeta>

export interface SearchConfig {
  dataUrl: string
  faqUrl: string
  maxResultsPerGroup: number
}

export interface SidebarHeading {
  id: string
  text: string
}

export interface BreadcrumbNode {
  id: string
  label: string
  url: string
}
