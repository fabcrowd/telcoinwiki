import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { loadCinematicConfig } from '../../lib/cinematicConfig'
import { tryGetSupabaseClient } from '../../lib/supabaseClient'
import { preferCodecs, pickResolutionVariant } from '../../lib/videoSupport'
import type { EffectiveType, HeroLayerConfig } from '../../config/cinematic'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type HeroLayer = HeroLayerConfig

type VideoPolicyState = { minEffectiveType: EffectiveType; allowSaveData: boolean }

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
      const t = setTimeout(run, 500)
      return () => clearTimeout(t)
    }
  }, [active, cb])
}

export function HeroSequencer({ layers: propLayers, className }: HeroSequencerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isNear, setIsNear] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [loadedLayers, setLoadedLayers] = useState<HeroLayer[] | null>(null)
  const [policy, setPolicy] = useState<VideoPolicyState>({ minEffectiveType: '3g', allowSaveData: false })

  // Default ambient layers (CSS gradient fallbacks); can be replaced by real assets later
  // Load external config if available and map to layers, unless explicit props provided
  const layers = useMemo<HeroLayer[]>(() => loadedLayers ?? propLayers ?? [], [loadedLayers, propLayers])

  // Resolve Supabase-signed URLs if needed
  const [resolvedSources, setResolvedSources] = useState<Record<string, { src: string; type: string }[]>>({})

  useEffect(() => {
    let mounted = true
    const client = tryGetSupabaseClient()
    ;(async () => {
      const out: Record<string, { src: string; type: string }[]> = {}
      for (const layer of layers) {
        const list = layer.sources ?? []
        const resolved: { src: string; type: string }[] = []
        for (const s of list) {
          if ('supabase' in s) {
            if (!client) continue
            const { bucket, path, expiresIn = 3600 } = s.supabase
            try {
              const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresIn)
              if (!error && data?.signedUrl) {
                resolved.push({ src: data.signedUrl, type: s.type })
              }
            } catch {
              // ignore and continue
            }
          } else {
            resolved.push({ src: s.src, type: s.type })
          }
        }
        if (resolved.length) out[layer.id] = resolved
      }
      if (mounted) setResolvedSources(out)
    })()
    return () => {
      mounted = false
    }
  }, [layers])

  useEffect(() => {
    if (propLayers) return
    let mounted = true
    ;(async () => {
      const cfg = await loadCinematicConfig()
      if (!mounted) return
      setLoadedLayers(cfg.heroLayers)
      if (cfg.videoPolicy) {
        setPolicy({
          minEffectiveType: cfg.videoPolicy.minEffectiveType ?? '3g',
          allowSaveData: cfg.videoPolicy.allowSaveData ?? false,
        })
      }
    })()
    return () => {
      mounted = false
    }
  }, [propLayers])

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
        const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData === true
        const effectiveType = (navigator as unknown as { connection?: { effectiveType?: string } }).connection
          ?.effectiveType as EffectiveType | undefined

        const rank: Record<EffectiveType, number> = { 'slow-2g': 0, '2g': 1, '3g': 2, '4g': 3 }
        const meetsConnection = effectiveType ? rank[effectiveType] >= rank[policy.minEffectiveType] : true
        const canLoadVideo = !prefersReducedMotion && (!saveData || policy.allowSaveData) && meetsConnection
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
