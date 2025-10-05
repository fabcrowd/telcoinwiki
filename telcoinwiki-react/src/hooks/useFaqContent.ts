import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FaqEntry, FaqTag } from '../lib/queries'
import { supabaseQueries } from '../lib/queries'
import { mapArtifactFaqEntries, type ArtifactFaqEntry } from '../utils/faq'

interface FaqContentState {
  items: FaqEntry[]
  isLoading: boolean
  error: Error | null
  isFallback: boolean
}

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  return (await response.json()) as T
}

export const useFaqContent = (faqUrl: string) => {
  const [state, setState] = useState<FaqContentState>({
    items: [],
    isLoading: true,
    error: null,
    isFallback: false,
  })

  const loadFaqs = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }))

    try {
      const faqs = await supabaseQueries.fetchFaqList()
      setState({ items: faqs, isLoading: false, error: null, isFallback: false })
    } catch (error) {
      console.warn('Falling back to cached FAQs', error)
      try {
        const fallback = await fetchJson<ArtifactFaqEntry[]>(faqUrl)
        const mapped = mapArtifactFaqEntries(fallback)
        setState({ items: mapped, isLoading: false, error: null, isFallback: true })
      } catch (fallbackError) {
        setState({ items: [], isLoading: false, error: fallbackError as Error, isFallback: false })
      }
    }
  }, [faqUrl])

  useEffect(() => {
    void loadFaqs()
  }, [loadFaqs])

  const tags = useMemo(() => {
    const tagMap = new Map<string, FaqTag>()
    state.items.forEach((faq) => {
      faq.tags.forEach((tag) => {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag)
        }
      })
    })
    return Array.from(tagMap.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [state.items])

  return {
    ...state,
    tags,
    reload: loadFaqs,
  }
}
