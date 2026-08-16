import type { PageMetaMap } from './types'

export const PAGE_META: PageMetaMap = {
  home: { label: 'Home', url: '/', parent: null, navId: 'home' },
  'deep-dive': { label: 'Deep Dive', url: '/deep-dive', parent: 'home', navId: 'deep-dive' },
  protocol: { label: 'Protocol', url: '/protocol', parent: 'home', navId: 'protocol' },
  '404': { label: 'Page not found', url: '/404', parent: 'home', navId: null },
}
