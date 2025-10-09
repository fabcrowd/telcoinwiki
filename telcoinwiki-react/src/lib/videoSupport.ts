export type Codec = 'video/webm; codecs="vp9"' | 'video/webm' | 'video/mp4; codecs="avc1.42E01E"' | 'video/mp4'

export function preferCodecs(sources: { src: string; type: string }[]): { src: string; type: string }[] {
  if (typeof document === 'undefined') return sources
  const video = document.createElement('video')
  const can = (t: string) => (video.canPlayType ? video.canPlayType(t) : '')

  const webmPreferred = can('video/webm; codecs="vp9"') || can('video/webm')
  const mp4Preferred = can('video/mp4; codecs="avc1.42E01E"') || can('video/mp4')

  const webm = sources.filter((s) => s.type.includes('webm'))
  const mp4 = sources.filter((s) => s.type.includes('mp4'))

  if (webmPreferred && webm.length) return [...webm, ...mp4]
  if (mp4Preferred && mp4.length) return [...mp4, ...webm]
  return sources
}

export function pickResolutionVariant<T extends { src: string }>(variants: T[]): T[] {
  if (!variants.length || typeof window === 'undefined') return variants
  const w = Math.max(window.innerWidth, window.innerHeight)
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const target = Math.min(Math.round(w * dpr), 1920)

  // Naive pick: choose the first variant whose filename hints a width >= target
  const scored = variants.map((v) => {
    const m = v.src.match(/(\d{3,4})(?=\.(?:webm|mp4)$)/)
    const vw = m ? parseInt(m[1], 10) : 0
    const score = Math.abs((vw || 1920) - target)
    return { v, score }
  })
  scored.sort((a, b) => a.score - b.score)
  const best = scored[0]?.v
  if (best) {
    // put best first
    return [best, ...variants.filter((v) => v !== best)]
  }
  return variants
}
