import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { CinematicLayout } from './components/layout/CinematicLayout'
import { NAV_ITEMS } from './config/navigation'
import { PAGE_META } from './config/pageMeta'
import { SEARCH_CONFIG } from './config/search'
import { HomePage } from './pages/HomePage'
import { DeepDivePage } from './pages/DeepDivePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Reference content is long and rarely the entry point; keep it off the main bundle.
const ProtocolPage = lazy(() =>
  import('./pages/ProtocolPage').then((m) => ({ default: m.ProtocolPage })),
)
// The WebGL engine and its shaders are meaningful weight for a page most
// visitors won't land on directly; keep it out of the main and Protocol chunks.
const AtlasPage = lazy(() => import('./pages/AtlasPage').then((m) => ({ default: m.AtlasPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={
            <CinematicLayout
              pageId="home"
              navItems={NAV_ITEMS}
              pageMeta={PAGE_META}
              searchConfig={SEARCH_CONFIG}
            >
              <HomePage />
            </CinematicLayout>
          }
        />
        <Route
          path="/deep-dive"
          element={
            <CinematicLayout
              pageId="deep-dive"
              navItems={NAV_ITEMS}
              pageMeta={PAGE_META}
              searchConfig={SEARCH_CONFIG}
            >
              <DeepDivePage />
            </CinematicLayout>
          }
        />
        <Route
          path="/protocol"
          element={
            <CinematicLayout
              pageId="protocol"
              navItems={NAV_ITEMS}
              pageMeta={PAGE_META}
              searchConfig={SEARCH_CONFIG}
            >
              <Suspense fallback={<div className="min-h-screen" />}>
                <ProtocolPage />
              </Suspense>
            </CinematicLayout>
          }
        />
        <Route
          path="/atlas"
          element={
            <CinematicLayout
              pageId="atlas"
              navItems={NAV_ITEMS}
              pageMeta={PAGE_META}
              searchConfig={SEARCH_CONFIG}
            >
              <Suspense fallback={<div className="min-h-screen" />}>
                <AtlasPage />
              </Suspense>
            </CinematicLayout>
          }
        />
        <Route
          path="*"
          element={
            <CinematicLayout
              pageId="404"
              navItems={NAV_ITEMS}
              pageMeta={PAGE_META}
              searchConfig={SEARCH_CONFIG}
            >
              <NotFoundPage />
            </CinematicLayout>
          }
        />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
