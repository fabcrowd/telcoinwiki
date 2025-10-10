import { useCallback, useMemo } from 'react'
import type { SearchConfig } from '../config/types'

export interface SearchDocument {
  ref: string
  type: 'page' | 'faq'
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
  id: SearchDocument['type']
  label: string
  items: SearchResultItem[]
}

export interface UseSearchIndexResult {
  search: (query: string) => SearchResultGroup[]
  isLoading: boolean
  error: Error | null
  isFallback: boolean
  reload: () => void
  /** Indicates that the heavy client-side index has been removed. */
  isDisabled: boolean
}

const EMPTY_RESULTS: SearchResultGroup[] = []

export const useSearchIndex = (searchConfig: SearchConfig): UseSearchIndexResult => {
  void searchConfig
  const search = useCallback(() => EMPTY_RESULTS, [])
  const reload = useCallback(() => {}, [])

  return useMemo(
    () => ({
      search,
      isLoading: false,
      error: null,
      isFallback: false,
      reload,
      isDisabled: true,
    }),
    [search, reload],
  )
}
