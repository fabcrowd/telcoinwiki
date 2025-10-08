import { DEFAULT_CINEMATIC, type CinematicConfig } from '../config/cinematic'

export async function loadCinematicConfig(): Promise<CinematicConfig> {
  try {
    const res = await fetch('/data/cinematic.json', { cache: 'no-store' })
    if (!res.ok) return DEFAULT_CINEMATIC
    const user = (await res.json()) as Partial<CinematicConfig>
    return mergeConfig(DEFAULT_CINEMATIC, user)
  } catch {
    return DEFAULT_CINEMATIC
  }
}

function mergeConfig(base: CinematicConfig, user: Partial<CinematicConfig>): CinematicConfig {
  return {
    heroLayers: user.heroLayers && Array.isArray(user.heroLayers) && user.heroLayers.length > 0 ? user.heroLayers : base.heroLayers,
    marquee: {
      speedSec: user.marquee?.speedSec ?? base.marquee.speedSec,
      items:
        user.marquee?.items && Array.isArray(user.marquee.items) && user.marquee.items.length > 0
          ? user.marquee.items
          : base.marquee.items,
    },
  }
}

