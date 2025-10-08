export type VideoSourceHttp = { src: string; type: string }
export type VideoSourceSupabase = {
  supabase: { bucket: string; path: string; expiresIn?: number }
  type: string
}
export type VideoSource = VideoSourceHttp | VideoSourceSupabase

export type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g'

export interface VideoPolicyConfig {
  /** Minimum connection type required to load videos (defaults to '3g'). */
  minEffectiveType?: EffectiveType
  /** If true, allow videos when Save-Data is enabled. Default false. */
  allowSaveData?: boolean
}

export interface HeroLayerConfig {
  id: string
  label: string
  poster?: string | null
  sources?: VideoSource[] | null
  /** Mask preset for reveal animation. */
  mask?: 'diagonal' | 'sweep' | 'hud' | 'inset'
  /** Animation duration in ms (per layer). */
  durationMs?: number
  /** Animation delay in ms (per layer). */
  delayMs?: number
  /** CSS timing function for this layer. */
  easing?: string
}

export interface MarqueeItemConfig {
  id: string
  label: string
  href?: string
  /** Optional path to a logo asset (svg/png/webp). */
  logoSrc?: string
  /** Optional accessible alt label if different from label. */
  alt?: string
}

export interface CinematicConfig {
  heroLayers: HeroLayerConfig[]
  videoPolicy?: VideoPolicyConfig
  marquee: {
    speedSec: number
    reverse?: boolean
    pauseOnHover?: boolean
    items: MarqueeItemConfig[]
  }
}

export const DEFAULT_CINEMATIC: CinematicConfig = {
  heroLayers: [
    { id: 'bg', label: 'Ambient background', poster: null, sources: null, mask: 'diagonal', durationMs: 1200 },
    { id: 'mid', label: 'Flow field', poster: null, sources: null, mask: 'sweep', durationMs: 1200, delayMs: 90 },
    { id: 'hud', label: 'HUD accents', poster: null, sources: null, mask: 'hud', durationMs: 1200, delayMs: 160 },
  ],
  videoPolicy: { minEffectiveType: '3g', allowSaveData: false },
  marquee: {
    speedSec: 33,
    reverse: false,
    pauseOnHover: true,
    items: [
      { id: 'brand-tn', label: 'Telcoin Network' },
      { id: 'brand-telx', label: 'TELx' },
      { id: 'brand-tan', label: 'TAN' },
      { id: 'brand-ramps', label: 'Licensed Ramps' },
      { id: 'brand-validators', label: 'GSMA Validators' },
      { id: 'brand-wallet', label: 'Telcoin Wallet' },
    ],
  },
}
