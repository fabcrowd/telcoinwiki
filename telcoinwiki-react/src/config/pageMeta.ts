import type { PageMetaMap } from './types'

export const PAGE_META: PageMetaMap = {
  home: { label: 'Home', url: '/', parent: null, navId: 'home' },
  '404': { label: 'Page not found', url: '/404', parent: 'home', navId: null },
}
