import { createElement, Fragment, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { FaqCard } from './FaqCard'
import { StatusValue } from './StatusValue'
import { useFaqContent } from '../../hooks/useFaqContent'

interface FaqExplorerProps {
  faqDataUrl: string
}

const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const createDomParser = (): DOMParser | null => {
  if (typeof DOMParser === 'undefined') {
    return null
  }
  return new DOMParser()
}

const renderAnswerHtml = (html: string, keyPrefix: string): ReactNode => {
  if (!html) return null

  const parser = createDomParser()

  if (!parser || typeof Node === 'undefined') {
    return <span key={keyPrefix}>{stripHtml(html)}</span>
  }

  const doc = parser.parseFromString(html, 'text/html')
  const nodes = Array.from(doc.body.childNodes)

  const convertNode = (node: ChildNode, key: string): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }
    const element = node as HTMLElement
    const statusKey = element.getAttribute('data-status-key')
    if (statusKey) {
      const format = element.getAttribute('data-status-format') === 'plus' ? 'plus' : 'number'
      return <StatusValue key={key} metricKey={statusKey} format={format} />
    }

    const props: Record<string, unknown> = { key }
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name === 'class') {
        props.className = attr.value
      } else if (attr.name === 'for') {
        props.htmlFor = attr.value
      } else if (attr.name !== 'data-status-format') {
        props[attr.name] = attr.value
      }
    })

    const children = Array.from(element.childNodes).map((child, index) =>
      convertNode(child, `${key}-${index}`),
    )

    return createElement(element.tagName.toLowerCase(), props, ...children)
  }

  return nodes.map((node, index) => convertNode(node, `${keyPrefix}-${index}`))
}

const truncate = (value: string, length: number): string => {
  if (value.length <= length) {
    return value
  }
  return `${value.slice(0, length - 1).trim()}…`
}

export function FaqExplorer({ faqDataUrl }: FaqExplorerProps) {
  const { items, isLoading, error, isFallback, tags, reload } = useFaqContent(faqDataUrl)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (slug: string) => {
    setSelectedTags((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    )
  }

  const clearFilters = () => setSelectedTags([])

  const filteredItems = useMemo(() => {
    if (!selectedTags.length) {
      return items
    }
    return items.filter((faq) => selectedTags.every((slug) => faq.tags.some((tag) => tag.slug === slug)))
  }, [items, selectedTags])

  return (
    <section className="faq-explorer">
      <div className="faq-explorer__controls">
        <p className="faq-explorer__count">
          {filteredItems.length} question{filteredItems.length === 1 ? '' : 's'}
          {selectedTags.length ? ` filtered by ${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'}` : ''}
        </p>
        <div className="faq-explorer__tags" role="list">
          {tags.map((tag) => {
            const isActive = selectedTags.includes(tag.slug)
            return (
              <button
                key={tag.slug}
                type="button"
                className={`faq-tag${isActive ? ' is-active' : ''}`}
                aria-pressed={isActive}
                onClick={() => toggleTag(tag.slug)}
              >
                {tag.label}
              </button>
            )
          })}
        </div>
        {selectedTags.length ? (
          <button type="button" className="faq-explorer__clear" onClick={clearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      {isFallback ? (
        <p className="faq-explorer__notice">Showing cached FAQ data while Supabase is unavailable.</p>
      ) : null}

      {isLoading ? <p className="faq-explorer__status">Loading FAQs…</p> : null}

      {error ? (
        <div className="faq-explorer__status faq-explorer__status--error">
          <p>We couldn’t load FAQs right now. Please check your connection and try again.</p>
          <button type="button" onClick={() => reload()} className="faq-explorer__retry">
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !error && !filteredItems.length ? (
        <p className="faq-explorer__status">No questions match the selected tags yet.</p>
      ) : null}

      <div className="faq-explorer__list" role="list">
        {filteredItems.map((faq) => {
          const summary = truncate(stripHtml(faq.answerHtml), 160)
          return (
            <FaqCard
              key={faq.id}
              id={faq.id}
              title={faq.question}
              summary={summary}
              defaultOpen={false}
              sources={faq.sources.map((source) => ({ label: source.label, href: source.url, external: true }))}
            >
              <div className="faq-explorer__answer">{renderAnswerHtml(faq.answerHtml, faq.id)}</div>
              {faq.tags.length ? (
                <p className="faq-explorer__tagline">
                  {faq.tags.map((tag, index) => (
                    <Fragment key={`${faq.id}-${tag.slug}`}>
                      {index > 0 ? ', ' : ''}
                      {tag.label}
                    </Fragment>
                  ))}
                </p>
              ) : null}
            </FaqCard>
          )
        })}
      </div>
    </section>
  )
}
