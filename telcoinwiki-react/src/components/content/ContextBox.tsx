import type { ReactNode } from 'react'

interface ContextBoxProps {
  title: ReactNode
  children: ReactNode
  className?: string
}

export function ContextBox({ title, children, className }: ContextBoxProps) {
  return (
    <div className={`context-box${className ? ` ${className}` : ''}`}>
      <p className="context-box__title">{title}</p>
      {children}
    </div>
  )
}
