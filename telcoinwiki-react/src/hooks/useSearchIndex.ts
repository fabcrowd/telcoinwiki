import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SearchConfig } from '../config/types'
import type { FaqEntry } from '../lib/queries'
import { supabaseQueries } from '../lib/queries'
import { mapArtifactFaqEntries, type ArtifactFaqEntry } from '../utils/faq'
import { loadElasticlunr } from '../vendor/loadElasticlunr'

interface SearchPageEntry {
  id: string
  title: string
  summary?: string
  url: string
  headings?: { id: string; title: string }[]
  highlights?: string[]
  tags?: string[]
}

type SearchDocumentType = 'page' | 'faq'

export interface SearchDocument {
  ref: string
  type: SearchDocumentType
  title: string
  summary: string
  body: string
  url: string
  tags: string[]
}

export interface SearchResultItem {
  doc: SearchDocument
  snippet: string
  score: number
}

export interface SearchResultGroup {
  id: SearchDocumentType
  label: string
  items: SearchResultItem[]
}

type ElasticModule = Awaited<ReturnType<typeof loadElasticlunr>>
type ElasticIndex = ElasticModule['Index']
type ElasticBuilder = ElasticModule['default']

interface SearchIndexState {
  index: ElasticIndex<IndexedDocument> | null
  documents: Map<string, SearchDocument>
  isLoading: boolean
  error: Error | null
  isFallback: boolean
}

const INITIAL_STATE: SearchIndexState = {
  index: null,
  documents: new Map(),
  isLoading: false,
  error: null,
  isFallback: false,
}

const normalizeUrl = (url: string): string => {
  if (!url) return '#'
  const cleaned = url.replace(/index\.html$/i, '')
  return cleaned.replace(/\.html$/i, '') || '/'
}

const stripHtml = (value: string): string => {
  if (!value) return ''
  const temp = globalThis.document?.createElement('div') ?? null
  if (!temp) {
    return value.replace(/<[^>]+>/g, ' ')
  }
  temp.innerHTML = value
  return temp.textContent || temp.innerText || ''
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildNeedles = (query: string): string[] =>
  query
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1)
    .slice(0, 5)

const highlightTerms = (text: string, terms: string[]): string => {
  if (!text || !terms.length) {
    return escapeHtml(text)
  }

  const escaped = terms.map(escapeRegExp).filter(Boolean)
  if (!escaped.length) {
    return escapeHtml(text)
  }

  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')
  return escapeHtml(text).replace(pattern, '<mark>$1</mark>')
}

const buildSnippet = (doc: SearchDocument, query: string): string => {
  const source = doc.summary || doc.body
  if (!source) {
    return ''
  }

  const cleaned = source.replace(/\s+/g, ' ')
  const lower = cleaned.toLowerCase()
  const needles = buildNeedles(query)

  let matchIndex = -1
  let matchLength = 0

  needles.forEach((needle) => {
    const index = lower.indexOf(needle.toLowerCase())
    if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
      matchIndex = index
      matchLength = needle.length
    }
  })

  if (matchIndex === -1) {
    return highlightTerms(cleaned.slice(0, 160), needles)
  }

  const start = Math.max(0, matchIndex - 60)
  const end = Math.min(cleaned.length, matchIndex + matchLength + 80)
  const snippet = `${start > 0 ? '…' : ''}${cleaned.slice(start, end)}${end < cleaned.length ? '…' : ''}`
  return highlightTerms(snippet, needles)
}

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  return (await response.json()) as T
}

const buildPageBody = (page: SearchPageEntry): string => {
  const headings = Array.isArray(page.headings) ? page.headings.map((heading) => heading.title || '').join(' ') : ''
  const highlights = Array.isArray(page.highlights) ? page.highlights.join(' ') : ''
  return `${page.summary ?? ''} ${headings} ${highlights}`.trim()
}

const buildDocuments = (pages: SearchPageEntry[], faqs: FaqEntry[]): Map<string, SearchDocument> => {
  const documents = new Map<string, SearchDocument>()

  pages.forEach((page) => {
    const ref = `page:${page.id}`
    const doc: SearchDocument = {
      ref,
      type: 'page',
      title: page.title,
      summary: page.summary ?? '',
      body: buildPageBody(page),
      url: normalizeUrl(page.url),
      tags: page.tags ?? [],
    }
    documents.set(ref, doc)
  })

  faqs.forEach((faq) => {
    const ref = `faq:${faq.id}`
    const body = stripHtml(faq.answerHtml)
    const doc: SearchDocument = {
      ref,
      type: 'faq',
      title: faq.question,
      summary: body.slice(0, 220),
      body,
      url: `/faq#${faq.id}`,
      tags: faq.tags.map((tag) => tag.label),
    }
    documents.set(ref, doc)
  })

  return documents
}

type IndexedDocument = SearchDocument & { tagsText: string }

const buildIndex = (
  documents: Map<string, SearchDocument>,
  elasticlunr: ElasticBuilder,
): ElasticIndex<IndexedDocument> => {
  const index = elasticlunr<IndexedDocument>()
  index.setRef('ref')
  index.addField('title')
  index.addField('summary')
  index.addField('body')
  index.addField('tagsText')

  documents.forEach((doc) => {
    index.addDoc({ ...doc, tagsText: doc.tags.join(' ') })
  })

  return index
}

export interface UseSearchIndexResult {
  search: (query: string) => SearchResultGroup[]
  isLoading: boolean
  error: Error | null
  isFallback: boolean
  reload: () => void
}

export const useSearchIndex = (searchConfig: SearchConfig): UseSearchIndexResult => {
  const [state, setState] = useState<SearchIndexState>(INITIAL_STATE)
  const requestIdRef = useRef(0)

  const loadIndex = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setState((current) => ({ ...current, isLoading: true, error: null }))

    try {
      const [pageData, faqResult] = await Promise.all([
        fetchJson<SearchPageEntry[]>(searchConfig.dataUrl),
        (async () => {
          try {
            const faqs = await supabaseQueries.fetchFaqList()
            return { faqs, fallback: false }
          } catch (error) {
            const fallbackFaqs = await fetchJson<ArtifactFaqEntry[]>(searchConfig.faqUrl)
            return { faqs: mapArtifactFaqEntries(fallbackFaqs), fallback: true, error: error as Error }
          }
        })(),
      ])

      if (requestId !== requestIdRef.current) {
        return
      }

      const documents = buildDocuments(pageData, faqResult.faqs)
      const { default: elasticlunr } = await loadElasticlunr()
      const index = buildIndex(documents, elasticlunr)

      setState({ index, documents, isLoading: false, error: null, isFallback: faqResult.fallback })
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return
      }
      setState({ index: null, documents: new Map(), isLoading: false, error: error as Error, isFallback: false })
    }
  }, [searchConfig.dataUrl, searchConfig.faqUrl])

  useEffect(() => {
    loadIndex()
  }, [loadIndex])

  const search = useCallback(
    (query: string): SearchResultGroup[] => {
      const trimmed = query.trim()
      if (!trimmed || !state.index) {
        return []
      }

      try {
        const rawResults = state.index.search(trimmed, { expand: true })
        const grouped: Record<SearchDocumentType, SearchResultItem[]> = {
          page: [],
          faq: [],
        }

        rawResults.forEach((result) => {
          const doc = state.documents.get(result.ref)
          if (!doc) {
            return
          }
          grouped[doc.type].push({
            doc,
            score: result.score,
            snippet: buildSnippet(doc, trimmed),
          })
        })

        return (
          [
            { id: 'page', label: 'Pages', items: grouped.page },
            { id: 'faq', label: 'FAQ', items: grouped.faq },
          ] as SearchResultGroup[]
        ).map((group) => ({
          ...group,
          items: group.items.slice(0, searchConfig.maxResultsPerGroup),
        }))
      } catch (error) {
        console.error('Search failed', error)
        return []
      }
    },
    [state.index, state.documents, searchConfig.maxResultsPerGroup],
  )

  const reload = useCallback(() => {
    loadIndex()
  }, [loadIndex])

  return useMemo(
    () => ({
      search,
      isLoading: state.isLoading,
      error: state.error,
      isFallback: state.isFallback,
      reload,
    }),
    [search, state.isLoading, state.error, state.isFallback, reload],
  )
}
