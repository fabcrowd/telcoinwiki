export type VideoSource = { src: string; type: string }

export interface HeroLayerConfig {
  id: string
  label: string
  poster?: string | null
  sources?: VideoSource[] | null
}

export interface MarqueeItemConfig {
  id: string
  label: string
  href?: string
}

export interface CinematicConfig {
  heroLayers: HeroLayerConfig[]
  marquee: { speedSec: number; items: MarqueeItemConfig[] }
}

export const DEFAULT_CINEMATIC: CinematicConfig = {
  heroLayers: [
    { id: 'bg', label: 'Ambient background', poster: null, sources: null },
    { id: 'mid', label: 'Flow field', poster: null, sources: null },
    { id: 'hud', label: 'HUD accents', poster: null, sources: null },
  ],
  marquee: {
    speedSec: 33,
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

