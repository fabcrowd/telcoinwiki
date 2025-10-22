import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { loadCinematicConfig } from '../../lib/cinematicConfig'
import { preferCodecs, pickResolutionVariant } from '../../lib/videoSupport'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { getSaveDataPreference, getEffectiveConnectionType } from '../../utils/browserSupport'

type VideoSource = { src: string; type: string } | { supabase: { bucket: string; path: string; expiresIn?: number }; type: string }

// Temporary switch to keep cinematic videos disabled while we troubleshoot desktop FPS.
const ENABLE_HERO_VIDEO = false

const isPresent = <T,>(value: T | null | undefined): value is T => Boolean(value)

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

interface IdleCallbackOptions {
  timeout?: number
}

interface WindowWithIdleCallback extends Window {
  requestIdleCallback?: (callback: () => void, options?: IdleCallbackOptions) => number
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
    const win = window as WindowWithIdleCallback
    if (win.requestIdleCallback) {
      win.requestIdleCallback(run, { timeout: 800 })
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
  const [loadedLayers, setLoadedLayers] = useState<HeroLayer[] | null>(null)
  const [policy, setPolicy] = useState<{ minEffectiveType: 'slow-2g'|'2g'|'3g'|'4g'; allowSaveData: boolean }>({
    minEffectiveType: '3g',
    allowSaveData: false,
  })

  // Default ambient layers (CSS gradient fallbacks); can be replaced by real assets later
  // Load external config if available and map to layers, unless explicit props provided
  const layers = useMemo<HeroLayer[]>(() => loadedLayers ?? propLayers ?? [], [loadedLayers, propLayers])

  // Cache resolved video sources for layers that include direct URLs
  const [resolvedSources, setResolvedSources] = useState<Record<string, { src: string; type: string }[]>>({})

  useEffect(() => {
    if (!ENABLE_HERO_VIDEO) {
      setResolvedSources({})
      return
    }

    if (!isNear || !layers.length) {
      return
    }
    if (prefersReducedMotion) {
      setResolvedSources({})
      return
    }

    let cancelled = false

    ;(async () => {
      const entries = await Promise.all(
        layers.map(async (layer) => {
          if (!layer.sources?.length) {
            return null
          }

          const list = preferCodecs(layer.sources)
          const resolved = list
            .map((source) => ('supabase' in source ? null : { src: source.src, type: source.type }))
            .filter(isPresent)

          return resolved.length ? [layer.id, resolved] : null
        }),
      )

      if (cancelled) {
        return
      }

      const out = Object.fromEntries(entries.filter(isPresent))
      setResolvedSources(out)
    })()

    return () => {
      cancelled = true
    }
  }, [isNear, layers, prefersReducedMotion])

  useEffect(() => {
    if (!ENABLE_HERO_VIDEO) {
      return
    }

    if (propLayers || loadedLayers || !isNear) return
    let cancelled = false
    ;(async () => {
      const cfg = await loadCinematicConfig()
      if (cancelled) return
      setLoadedLayers(cfg.heroLayers as HeroLayer[])
      if (ENABLE_HERO_VIDEO && cfg.videoPolicy) {
        setPolicy({
          minEffectiveType: cfg.videoPolicy.minEffectiveType ?? '3g',
          allowSaveData: cfg.videoPolicy.allowSaveData ?? false,
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [propLayers, loadedLayers, isNear])

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
      {(layers.length ? layers : [
        { id: 'bg', label: 'Ambient background', poster: null, sources: null },
        { id: 'mid', label: 'Flow field', poster: null, sources: null },
        { id: 'hud', label: 'HUD accents', poster: null, sources: null },
      ]).map((layer, index) => {
        const saveData = getSaveDataPreference()
        const effectiveType = getEffectiveConnectionType()

        const rank: Record<'slow-2g'|'2g'|'3g'|'4g', number> = { 'slow-2g': 0, '2g': 1, '3g': 2, '4g': 3 }
        const meetsConnection = effectiveType ? rank[effectiveType] >= rank[policy.minEffectiveType] : true
        const canLoadVideo = ENABLE_HERO_VIDEO && !prefersReducedMotion && (!saveData || policy.allowSaveData) && meetsConnection
        const sourcesForLayer = resolvedSources[layer.id] ?? []
        const orderedSources = pickResolutionVariant(preferCodecs(sourcesForLayer))
        const hasVideo = !!(orderedSources.length) && canLoadVideo
        const z = 10 + index
        const style = {
          '--hero-layer-z': z,
          animationDuration: `${layer.durationMs ?? 1200}ms`,
          animationDelay: `${layer.delayMs ?? 0}ms`,
          animationTimingFunction: layer.easing ?? 'var(--transition-overshoot)',
        } as CSSProperties

        // Different masks per layer for more cinematic feel
        const mask = layer.mask ?? (layer.id === 'bg' ? 'diagonal' : layer.id === 'mid' ? 'sweep' : 'hud')
        const maskClass =
          mask === 'diagonal' ? 'mask-diagonal' : mask === 'sweep' ? 'mask-sweep' : mask === 'hud' ? 'mask-hud' : ''

        return (
          <div key={layer.id} className={cn('hero-layer', isStarted && 'animate-hero-mask', maskClass)} style={style}>
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
                {orderedSources.map((src) => (
                  <source key={src.src + src.type} src={src.src} type={src.type} />
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
