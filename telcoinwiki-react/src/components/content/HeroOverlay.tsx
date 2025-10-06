import type { ReactNode } from 'react'

interface HeroOverlayProps {
  children?: ReactNode
}

export function HeroOverlay({ children }: HeroOverlayProps) {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tc-blue-sky)_0%,transparent_65%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(85,51,255,0.3)_0%,transparent_70%)] mix-blend-screen" />
      {children}
    </>
  )
}
