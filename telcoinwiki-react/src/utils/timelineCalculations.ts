import { clampPercent } from './cssUtils'

export interface TimelineWindow {
  start: number
  end: number
}

interface TimelineCalculationParams {
  itemCount: number
  minWindowSpan: number
  initialDelayPct: number
  windowGapPct: number
  lastCardHoldPct: number
  targetWindowPct: number
}

export const calculateTimelineWindows = ({
  itemCount,
  minWindowSpan,
  initialDelayPct,
  windowGapPct,
  lastCardHoldPct,
  targetWindowPct,
}: TimelineCalculationParams): TimelineWindow[] => {
  if (itemCount === 0) return []

  const animatedCount = Math.max(itemCount - 1, 1)
  const gapTotal = windowGapPct * Math.max(animatedCount - 1, 0)
  const fixedSpan = initialDelayPct + gapTotal
  const maxActiveSpan = Math.min(100 - lastCardHoldPct, targetWindowPct * animatedCount + fixedSpan)
  const minActiveSpan = minWindowSpan * animatedCount + fixedSpan
  const activeTimelineSpan = Math.max(minActiveSpan, maxActiveSpan)
  const baseWindow = (activeTimelineSpan - fixedSpan) / animatedCount

  let cursor = initialDelayPct
  const windows: TimelineWindow[] = []

  for (let index = 0; index < itemCount; index++) {
    if (index === 0) {
      windows.push({ start: 0, end: initialDelayPct })
      continue
    }

    const start = Number(cursor.toFixed(3))
    const holdEnd = 100 - lastCardHoldPct
    let end = Number((start + baseWindow).toFixed(3))

    if (index === itemCount - 1) {
      const minEnd = start + minWindowSpan
      end = Math.min(holdEnd, Math.max(minEnd, end))
      end = Number(end.toFixed(3))
    }

    cursor = end + (index === itemCount - 1 ? 0 : windowGapPct)
    windows.push({ start, end })
  }

  if (windows.length > 0) {
    const lastIndex = windows.length - 1
    const holdEnd = 100 - lastCardHoldPct
    const start = windows[lastIndex].start
    const plannedEnd = windows[lastIndex].end
    const minEnd = start + minWindowSpan
    const endRaw = Math.min(holdEnd, Math.max(minEnd, plannedEnd))
    windows[lastIndex] = {
      start,
      end: Number(endRaw.toFixed(3)),
    }
  }

  return windows
}

export const calculateFallbackWindow = (
  index: number,
  windowSize: number,
  initialDelayPct: number
): TimelineWindow => {
  if (index === 0) return { start: 0, end: initialDelayPct }
  const start = (index - 1) * windowSize
  const end = Math.min(100, index * windowSize)
  return { start, end }
}

export const calculateActiveIndex = (
  progress: number,
  windows: TimelineWindow[],
  itemCount: number
): number => {
  if (itemCount <= 1) return 0

  const pct = progress * 100
  let current = 0

  for (let i = 1; i < windows.length; i++) {
    const window = windows[i]
    if (!window) continue
    const windowEnd = i === windows.length - 1 ? 100 : window.end
    if (pct >= window.start - 0.001 && pct < windowEnd + 0.001) {
      current = i
    }
  }

  const lastWindow = windows[windows.length - 1]
  if (lastWindow && pct >= lastWindow.end - 0.001) {
    current = windows.length - 1
  }

  return Math.min(itemCount - 1, Math.max(0, current))
}

export const calculateCardProgress = (
  index: number,
  progressPct: number,
  window: TimelineWindow,
  initialDelayPct: number
): number => {
  if (index === 0) {
    return Math.max(0, Math.min(1, progressPct / Math.max(1, initialDelayPct)))
  }

  const windowSpan = Math.max(0, window.end - window.start)

  if (windowSpan <= 0.001) {
    return progressPct >= window.start ? 1 : 0
  }

  const raw = (progressPct - window.start) / windowSpan
  return Math.max(0, Math.min(1, raw))
}
