import { renderHook, waitFor, act } from '@testing-library/react'
import { useSearchIndex, __resetSearchIndexCache } from '../useSearchIndex'
import type { SearchConfig } from '../../config/types'

const config: SearchConfig = {
  dataUrl: '/data/search-index.json',
  faqUrl: '/data/faq.json',
  maxResultsPerGroup: 5,
}

const INDEX = [
  {
    id: 'deep-consensus',
    kind: 'section',
    title: 'Consensus — Deep Dive',
    summary: 'Narwhal and Bullshark',
    url: '/deep-dive#deep-consensus',
    tags: ['Deep Dive'],
    headings: [],
    body: 'Narwhal handles transaction ingestion using a DAG so validators work in parallel.',
  },
  {
    id: 'home',
    kind: 'page',
    title: 'Telcoin Wiki',
    summary: 'Community guide to the Telcoin ecosystem.',
    url: '/',
    tags: ['Overview'],
    headings: [{ id: 'faq-section', title: 'Frequently asked questions' }],
    body: '',
  },
]

const FAQ = [
  {
    id: 'what-is-narwhal',
    question: 'What is Narwhal and why is it important?',
    answer: 'Narwhal removes bottlenecks in the mempool by processing transactions in parallel.',
    group: 'Network and Technology',
    url: '/#faq-what-is-narwhal',
  },
  {
    id: 'escaping',
    question: 'Escaping check',
    answer: 'A pool of <script>alert(1)</script> & other markup should never execute.',
    group: 'Security and Safety',
    url: '/#faq-escaping',
  },
]

function mockFetch(overrides: Record<string, unknown | Error> = {}) {
  return jest.fn((input: RequestInfo | URL) => {
    const url = String(input)
    const key = url.includes('faq') ? 'faq' : 'index'
    const value = overrides[key] ?? (key === 'faq' ? FAQ : INDEX)

    if (value instanceof Error) {
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve(null) })
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(value) })
  })
}

describe('useSearchIndex', () => {
  beforeEach(() => {
    __resetSearchIndexCache()
    jest.restoreAllMocks()
  })

  it('does not fetch until it is activated', async () => {
    const fetchMock = mockFetch()
    global.fetch = fetchMock as unknown as typeof fetch

    const { rerender } = renderHook(({ active }) => useSearchIndex(config, { active }), {
      initialProps: { active: false },
    })

    expect(fetchMock).not.toHaveBeenCalled()

    rerender({ active: true })
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
  })

  it('returns grouped results with FAQ ranked first', async () => {
    global.fetch = mockFetch() as unknown as typeof fetch

    const { result } = renderHook(() => useSearchIndex(config, { active: true }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const groups = result.current.search('narwhal')

    expect(groups.map((group) => group.id)).toEqual(['faq', 'section'])
    expect(groups[0].items[0].doc.url).toBe('/#faq-what-is-narwhal')
    expect(groups[1].items[0].doc.url).toBe('/deep-dive#deep-consensus')
  })

  it('highlights matches and escapes markup in snippets', async () => {
    global.fetch = mockFetch() as unknown as typeof fetch

    const { result } = renderHook(() => useSearchIndex(config, { active: true }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const [faqGroup] = result.current.search('markup')
    const snippet = faqGroup.items[0].snippet

    expect(faqGroup.items[0].doc.url).toBe('/#faq-escaping')
    expect(snippet).toContain('<mark>markup</mark>')
    // The raw answer contains a script tag; it must arrive inert because the
    // consumer renders snippets with dangerouslySetInnerHTML.
    expect(snippet).not.toContain('<script>')
    expect(snippet).toContain('&lt;script&gt;')
    expect(snippet).toContain('&amp;')
  })

  it('requires every token to match', async () => {
    global.fetch = mockFetch() as unknown as typeof fetch

    const { result } = renderHook(() => useSearchIndex(config, { active: true }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.search('narwhal mempool').length).toBeGreaterThan(0)
    expect(result.current.search('narwhal zzzznomatch')).toEqual([])
  })

  it('falls back to FAQ-only when the page index fails', async () => {
    global.fetch = mockFetch({ index: new Error('boom') }) as unknown as typeof fetch

    const { result } = renderHook(() => useSearchIndex(config, { active: true }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isFallback).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.search('narwhal').map((group) => group.id)).toEqual(['faq'])
  })

  it('reports an error when nothing loads, and recovers on reload', async () => {
    global.fetch = mockFetch({
      index: new Error('boom'),
      faq: new Error('boom'),
    }) as unknown as typeof fetch

    const { result } = renderHook(() => useSearchIndex(config, { active: true }))
    await waitFor(() => expect(result.current.error).not.toBeNull())

    global.fetch = mockFetch() as unknown as typeof fetch
    act(() => result.current.reload())

    await waitFor(() => expect(result.current.error).toBeNull())
    await waitFor(() => expect(result.current.search('narwhal').length).toBeGreaterThan(0))
  })
})
