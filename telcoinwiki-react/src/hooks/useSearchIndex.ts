import { useMemo } from 'react'
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

/**
 * Search index hook - currently disabled for performance
 * Per CHANGELOG: Search was disabled to improve performance
 * This is a minimal stub that returns empty results
 */
export function useSearchIndex(_searchConfig: SearchConfig): UseSearchIndexResult {
  const search = useMemo(
    () => (query: string): SearchResultGroup[] => {
      // Search is disabled - return empty results
      return []
    },
    [],
  )

  return {
    search,
    isLoading: false,
    error: null,
    isFallback: false,
    reload: () => {
      // No-op - search is disabled
    },
    isDisabled: true, // Search is disabled
  }
}

