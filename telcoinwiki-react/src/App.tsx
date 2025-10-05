import type { SidebarHeading } from './config/types'
import { AppLayout } from './components/layout/AppLayout'
import { NAV_ITEMS } from './config/navigation'
import { PAGE_META } from './config/pageMeta'
import { SEARCH_CONFIG } from './config/search'

const demoHeadings: SidebarHeading[] = [
  { id: 'welcome', text: 'Welcome' },
  { id: 'next-steps', text: 'Next steps' },
]

function App() {
  return (
    <AppLayout
      pageId="home"
      navItems={NAV_ITEMS}
      pageMeta={PAGE_META}
      searchConfig={SEARCH_CONFIG}
      headings={demoHeadings}
    >
      <section id="welcome" className="page-intro anchor-offset tc-card">
        <p className="page-intro__eyebrow">Community Q&amp;A for Telcoin</p>
        <h1 className="page-intro__title">React layout shell</h1>
        <p className="page-intro__lede">
          This demo renders the site header, sidebar, and breadcrumb trail from the shared
          configuration so content authors only touch JSON-like data files.
        </p>
      </section>

      <section id="next-steps" className="tc-card">
        <h2>Next steps</h2>
        <p>
          Replace the placeholder sections with real page content. Update navigation, breadcrumb, and
          search behaviour exclusively through the configuration modules in <code>src/config</code>.
        </p>
      </section>
    </AppLayout>
  )
}

export default App
