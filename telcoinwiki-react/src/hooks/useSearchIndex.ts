import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SearchConfig } from '../config/types'

export interface SearchResultGroup {
  id: string
  label: string
  items: SearchResultItem[]
}

export interface SearchResultItem {
  doc: {
    ref: string
    title: string
    url: string
  }
  snippet: string
}

export interface UseSearchIndexResult {
  search: (query: string) => SearchResultGroup[]
  isLoading: boolean
  error: string | null
  isFallback: boolean
  reload: () => void
  isDisabled: boolean
}

interface RawIndexDoc {
  id: string
  kind: 'page' | 'section'
  title: string
  summary?: string
  url: string
  tags?: string[]
  headings?: Array<{ id: string; title: string }>
  body?: string
}

interface RawFaqDoc {
  id: string
  question: string
  answer: string
  group?: string
  url: string
}

/** A document flattened into weighted, pre-lowercased fields. */
interface Doc {
  ref: string
  title: string
  url: string
  group: 'faq' | 'section' | 'page'
  /** Original-case text used to build snippets. */
  text: string
  titleLower: string
  keywordsLower: string
  textLower: string
}

interface Payload {
  docs: Doc[]
  /** True when the page/section index failed but FAQ data loaded. */
  partial: boolean
}

const GROUP_LABELS: Record<Doc['group'], string> = {
  faq: 'FAQ',
  section: 'Deep Dive',
  page: 'Pages',
}

/** Rendering order in the results panel — most specific answers first. */
const GROUP_ORDER: Array<Doc['group']> = ['faq', 'section', 'page']

const FIELD_WEIGHTS = {
  title: 12,
  keywords: 5,
  text: 1,
}

const SNIPPET_RADIUS = 90
const MAX_SNIPPET = 220

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1)
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Count non-overlapping occurrences of `needle` in an already-lowercased haystack. */
function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0
  let count = 0
  let index = haystack.indexOf(needle)
  while (index !== -1) {
    count += 1
    index = haystack.indexOf(needle, index + needle.length)
  }
  return count
}

function scoreDoc(doc: Doc, tokens: string[]): number {
  let score = 0

  for (const token of tokens) {
    const inTitle = countOccurrences(doc.titleLower, token)
    const inKeywords = countOccurrences(doc.keywordsLower, token)
    const inText = countOccurrences(doc.textLower, token)

    // Require every token to appear somewhere: AND semantics keep short
    // queries from dragging in loosely related documents.
    if (!inTitle && !inKeywords && !inText) {
      return 0
    }

    score +=
      inTitle * FIELD_WEIGHTS.title +
      inKeywords * FIELD_WEIGHTS.keywords +
      Math.min(inText, 6) * FIELD_WEIGHTS.text
  }

  // Nudge whole-phrase matches above documents that merely contain the words.
  const phrase = tokens.join(' ')
  if (tokens.length > 1 && doc.textLower.includes(phrase)) {
    score += 15
  }

  return score
}

/**
 * Build an HTML snippet around the first match.
 *
 * Marking happens on the raw string and escaping is applied per-segment, so a
 * token can never end up splitting an HTML entity and the only tags in the
 * result are the `<mark>` elements added here. The consumer renders this with
 * `dangerouslySetInnerHTML`, so that guarantee matters.
 */
function buildSnippet(text: string, tokens: string[]): string {
  if (!text) return ''

  const lower = text.toLowerCase()

  let firstIndex = -1
  for (const token of tokens) {
    const index = lower.indexOf(token)
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index
    }
  }
  if (firstIndex === -1) firstIndex = 0

  let start = Math.max(0, firstIndex - SNIPPET_RADIUS)
  let end = Math.min(text.length, start + MAX_SNIPPET)
  // Avoid clipping mid-word at either edge.
  if (start > 0) {
    const space = text.indexOf(' ', start)
    if (space !== -1 && space < firstIndex) start = space + 1
  }
  if (end < text.length) {
    const space = text.lastIndexOf(' ', end)
    if (space > firstIndex) end = space
  }

  const window = text.slice(start, end)
  const windowLower = window.toLowerCase()

  // Collect and merge match ranges within the window.
  const ranges: Array<[number, number]> = []
  for (const token of tokens) {
    let index = windowLower.indexOf(token)
    while (index !== -1) {
      ranges.push([index, index + token.length])
      index = windowLower.indexOf(token, index + token.length)
    }
  }
  ranges.sort((a, b) => a[0] - b[0])

  const merged: Array<[number, number]> = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1]) {
      last[1] = Math.max(last[1], range[1])
    } else {
      merged.push([...range] as [number, number])
    }
  }

  let html = ''
  let cursor = 0
  for (const [from, to] of merged) {
    html += escapeHtml(window.slice(cursor, from))
    html += `<mark>${escapeHtml(window.slice(from, to))}</mark>`
    cursor = to
  }
  html += escapeHtml(window.slice(cursor))

  return `${start > 0 ? '…' : ''}${html}${end < text.length ? '…' : ''}`
}

function toIndexDocs(raw: RawIndexDoc[]): Doc[] {
  return raw.map((entry) => {
    const keywords = [...(entry.tags ?? []), ...(entry.headings ?? []).map((h) => h.title)].join(' ')
    const text = [entry.summary, entry.body].filter(Boolean).join(' ')
    return {
      ref: entry.id,
      title: entry.title,
      url: entry.url,
      group: entry.kind === 'section' ? 'section' : 'page',
      text,
      titleLower: entry.title.toLowerCase(),
      keywordsLower: keywords.toLowerCase(),
      textLower: text.toLowerCase(),
    }
  })
}

function toFaqDocs(raw: RawFaqDoc[]): Doc[] {
  return raw.map((entry) => ({
    ref: `faq-${entry.id}`,
    title: entry.question,
    url: entry.url,
    group: 'faq' as const,
    text: entry.answer,
    titleLower: entry.question.toLowerCase(),
    keywordsLower: (entry.group ?? '').toLowerCase(),
    textLower: entry.answer.toLowerCase(),
  }))
}

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`)
  }
  return (await response.json()) as T
}

/**
 * Shared across every mounted `SearchModal` so the payload is fetched once per
 * page load rather than once per modal instance.
 */
let payloadPromise: Promise<Payload> | null = null

async function loadPayload(config: SearchConfig, signal: AbortSignal): Promise<Payload> {
  const [indexResult, faqResult] = await Promise.allSettled([
    fetchJson<RawIndexDoc[]>(config.dataUrl, signal),
    fetchJson<RawFaqDoc[]>(config.faqUrl, signal),
  ])

  const docs: Doc[] = []
  if (indexResult.status === 'fulfilled') {
    docs.push(...toIndexDocs(indexResult.value))
  }
  if (faqResult.status === 'fulfilled') {
    docs.push(...toFaqDocs(faqResult.value))
  }

  if (!docs.length) {
    throw new Error('search payload unavailable')
  }

  return { docs, partial: indexResult.status === 'rejected' }
}

interface UseSearchIndexOptions {
  /**
   * Defer the network request until the UI actually needs it. The search
   * payload is a few tens of kB, and fetching it on every page load was part
   * of why search was switched off in the first place.
   */
  active?: boolean
}

export function useSearchIndex(
  config: SearchConfig,
  { active = true }: UseSearchIndexOptions = {},
): UseSearchIndexResult {
  const [payload, setPayload] = useState<Payload | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  const { dataUrl, faqUrl, maxResultsPerGroup } = config

  useEffect(() => {
    if (!active || payload) {
      return
    }

    const controller = new AbortController()
    let cancelled = false

    setIsLoading(true)
    setError(null)

    if (!payloadPromise) {
      payloadPromise = loadPayload({ dataUrl, faqUrl, maxResultsPerGroup }, controller.signal)
    }

    payloadPromise
      .then((result) => {
        if (cancelled) return
        setPayload(result)
      })
      .catch((cause: unknown) => {
        if (cancelled || controller.signal.aborted) return
        payloadPromise = null
        setError(cause instanceof Error ? cause.message : 'Unknown search error')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [active, payload, attempt, dataUrl, faqUrl, maxResultsPerGroup])

  const reload = useCallback(() => {
    payloadPromise = null
    setPayload(null)
    setError(null)
    setAttempt((value) => value + 1)
  }, [])

  const search = useMemo(() => {
    const docs = payload?.docs ?? []

    return (query: string): SearchResultGroup[] => {
      const tokens = tokenize(query)
      if (!tokens.length || !docs.length) {
        return []
      }

      const scored = docs
        .map((doc) => ({ doc, score: scoreDoc(doc, tokens) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)

      return GROUP_ORDER.map((group) => ({
        id: group,
        label: GROUP_LABELS[group],
        items: scored
          .filter((entry) => entry.doc.group === group)
          .slice(0, maxResultsPerGroup)
          .map(({ doc }) => ({
            doc: { ref: doc.ref, title: doc.title, url: doc.url },
            snippet: buildSnippet(doc.text, tokens),
          })),
      })).filter((group) => group.items.length > 0)
    }
  }, [payload, maxResultsPerGroup])

  return {
    search,
    isLoading,
    error,
    isFallback: payload?.partial ?? false,
    reload,
    isDisabled: false,
  }
}

/** Test seam — lets suites reset the module-level fetch cache. */
export function __resetSearchIndexCache() {
  payloadPromise = null
}
