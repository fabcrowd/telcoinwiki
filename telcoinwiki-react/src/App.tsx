import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { NAV_ITEMS } from './config/navigation'
import { PAGE_META } from './config/pageMeta'
import { SEARCH_CONFIG } from './config/search'
import { APP_ROUTES } from './routes'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {APP_ROUTES.map(({ path, pageId, Component, headings }) => (
        <Route
          key={path}
          path={path}
          element={
            <AppLayout
              pageId={pageId}
              navItems={NAV_ITEMS}
              pageMeta={PAGE_META}
              searchConfig={SEARCH_CONFIG}
              headings={headings}
            >
              <Component />
            </AppLayout>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <AppLayout
            pageId="404"
            navItems={NAV_ITEMS}
            pageMeta={PAGE_META}
            searchConfig={SEARCH_CONFIG}
          >
            <NotFoundPage />
          </AppLayout>
        }
      />
    </Routes>
  )
}

export default App
