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
  const heroLayers = Array.isArray(user.heroLayers) && user.heroLayers.length > 0 ? user.heroLayers : base.heroLayers
  const marqueeBase = base.marquee
  const marqueeUser = user.marquee ?? {}
  const marquee = {
    speedSec: marqueeUser.speedSec ?? marqueeBase.speedSec,
    reverse: marqueeUser.reverse ?? marqueeBase.reverse ?? false,
    pauseOnHover: marqueeUser.pauseOnHover ?? marqueeBase.pauseOnHover ?? true,
    items:
      Array.isArray(marqueeUser.items) && marqueeUser.items.length > 0 ? marqueeUser.items : marqueeBase.items,
  }

  const videoPolicy = {
    minEffectiveType: user.videoPolicy?.minEffectiveType ?? base.videoPolicy?.minEffectiveType ?? '3g',
    allowSaveData: user.videoPolicy?.allowSaveData ?? base.videoPolicy?.allowSaveData ?? false,
  }

  return { heroLayers, marquee, videoPolicy }
}
