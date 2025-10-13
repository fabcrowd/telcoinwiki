import type { PageMetaMap } from './types'

export const PAGE_META: PageMetaMap = {
  home: { label: 'Home', url: '/', parent: null, navId: null },
  governance: {
    label: 'Governance',
    url: '/governance',
    parent: 'home',
    navId: 'governance',
    sidebar: true,
  },
  network: {
    label: 'Network',
    url: '/network',
    parent: 'home',
    navId: 'network',
    sidebar: true,
  },
  bank: {
    label: 'Bank',
    url: '/bank',
    parent: 'home',
    navId: 'bank',
    sidebar: true,
  },
  tokenomics: {
    label: 'Tokenomics',
    url: '/tokenomics',
    parent: 'home',
    navId: 'tokenomics',
    sidebar: true,
  },
  faq: { label: 'FAQ', url: '/faq', parent: 'home', navId: 'learn', sidebar: true },
  'deep-dive': {
    label: 'Deep Dive',
    url: '/deep-dive',
    parent: 'faq',
    navId: 'learn',
  },
  builders: {
    label: 'Builders',
    url: '/builders',
    parent: 'network',
    navId: 'network',
    sidebar: true,
  },
  links: {
    label: 'Official Links',
    url: '/links',
    parent: 'faq',
    navId: 'learn',
    sidebar: true,
  },
  pools: {
    label: 'TELx Pools Dashboard',
    url: '/pools',
    parent: 'tokenomics',
    navId: 'tokenomics',
  },
  portfolio: {
    label: 'TELx Portfolio Explorer',
    url: '/portfolio',
    parent: 'tokenomics',
    navId: 'tokenomics',
  },
  about: {
    label: 'About this project',
    url: '/about',
    parent: 'faq',
    navId: 'about',
  },
  '404': {
    label: 'Page not found',
    url: '/404',
    parent: 'home',
    navId: null,
  },
}
