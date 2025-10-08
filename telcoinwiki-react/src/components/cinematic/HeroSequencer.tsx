import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type VideoSource = { src: string; type: string }

export interface HeroLayer {
  id: string
  label: string
  poster?: string | null
  sources?: VideoSource[] | null
}

interface HeroSequencerProps {
  layers?: HeroLayer[]
  className?: string
}

function useIdleStart(active: boolean, cb: () => void) {
  useEffect(() => {
    if (!active) return
    let done = false
    const run = () => {
      if (done) return
      done = true
      cb()
    }
    // Prefer idle callback; fall back to a short timeout
    if ('requestIdleCallback' in window) {
      ;(window as unknown as { requestIdleCallback: (fn: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(
        run,
        { timeout: 800 },
      )
    } else {
      const t = window.setTimeout(run, 500)
      return () => window.clearTimeout(t)
    }
  }, [active, cb])
}

export function HeroSequencer({ layers: propLayers, className }: HeroSequencerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isNear, setIsNear] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  // Default ambient layers (CSS gradient fallbacks); can be replaced by real assets later
  const layers = useMemo<HeroLayer[]>(
    () =>
      propLayers ?? [
        { id: 'bg', label: 'Ambient background', poster: null, sources: null },
        { id: 'mid', label: 'Flow field', poster: null, sources: null },
        { id: 'hud', label: 'HUD accents', poster: null, sources: null },
      ],
    [propLayers],
  )

  // Observe proximity to viewport to avoid hurting LCP
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.intersectionRatio > 0) {
            setIsNear(true)
          }
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: [0, 0.01] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useIdleStart(isNear && !prefersReducedMotion, () => setIsStarted(true))

  return (
    <div ref={containerRef} className={cn('hero-sequencer', className)} aria-hidden>
      {layers.map((layer, index) => {
        const hasVideo = !!(layer.sources && layer.sources.length) && !prefersReducedMotion
        const z = 10 + index
        const style = { '--hero-layer-z': z } as CSSProperties

        return (
          <div key={layer.id} className={cn('hero-layer', isStarted && 'animate-hero-mask')} style={style}>
            {hasVideo ? (
              <video
                className="hero-video"
                playsInline
                muted
                loop
                preload={isStarted ? 'auto' : 'metadata'}
                poster={layer.poster ?? undefined}
                autoPlay={isStarted}
              >
                {layer.sources!.map((src) => (
                  <source key={src.src} src={src.src} type={src.type} />
                ))}
              </video>
            ) : (
              <div className={cn('hero-fallback', `hero-fallback--${layer.id}`)} />
            )}
          </div>
        )
      })}
    </div>
  )
}

