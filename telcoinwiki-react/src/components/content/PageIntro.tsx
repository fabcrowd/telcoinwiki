import type { ReactNode } from 'react'

interface PageIntroProps {
  id: string
  eyebrow: ReactNode
  title: ReactNode
  lede: ReactNode
  children?: ReactNode
}

export function PageIntro({ id, eyebrow, title, lede, children }: PageIntroProps) {
  return (
    <section id={id} className="page-intro anchor-offset tc-card">
      <p className="page-intro__eyebrow">{eyebrow}</p>
      <h1 className="page-intro__title">{title}</h1>
      <p className="page-intro__lede">{lede}</p>
      {children}
    </section>
  )
}
