import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { SourceBox, type SourceLink } from './SourceBox'

interface FaqCardProps {
  id: string
  title: string
  summary: ReactNode
  description?: ReactNode
  children: ReactNode
  cta?: ReactNode
  sources?: SourceLink[]
  defaultOpen?: boolean
}

export function FaqCard({
  id,
  title,
  summary,
  description,
  children,
  cta,
  sources,
  defaultOpen = false,
}: FaqCardProps) {
  const generatedId = useId()
  const toggleId = `${id || generatedId}-toggle`
  const panelId = `${id || generatedId}-panel`
  const [open, setOpen] = useState(defaultOpen)

  return (
    <article className="accordion faq-card anchor-offset" role="listitem" id={id}>
      <div>
        <button
          type="button"
          className="accordion__summary faq-card__summary"
          aria-expanded={open}
          aria-controls={panelId}
          id={toggleId}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="faq-card__summary-text">
            <h3 className="card__title">{title}</h3>
            <p>{summary}</p>
            {description ? <div className="faq-card__summary-extra">{description}</div> : null}
          </div>
          <span className="accordion__icon" aria-hidden="true">
            {open ? '⌃' : '⌄'}
          </span>
        </button>
      </div>
      <div
        className="accordion__content faq-card__content"
        id={panelId}
        role="region"
        aria-labelledby={toggleId}
        hidden={!open}
      >
        <div className="faq-card__answer">{children}</div>
        {cta ? <div className="faq-card__actions">{cta}</div> : null}
        {sources && sources.length ? <SourceBox links={sources} className="faq-card__sources" /> : null}
      </div>
    </article>
  )
}
