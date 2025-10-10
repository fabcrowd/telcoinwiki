const STAGE_HOST_SELECTOR = '[data-stage-host]'

export const STAGE_VARIABLE_KEYS = [
  '--tc-stage-hue',
  '--tc-stage-accent-hue',
  '--tc-stage-overlay-opacity',
  '--tc-stage-spot-opacity',
  '--tc-stage-card-overlay-opacity',
  '--tc-stage-card-border-opacity',
  '--tc-stage-card-shadow-opacity',
] as const

export type StageVariableName = (typeof STAGE_VARIABLE_KEYS)[number]
export type StageVariableUpdates = Partial<Record<StageVariableName, string>>

const hostUpdates = new WeakMap<HTMLElement, Map<string, string | null>>()
const hostValues = new WeakMap<HTMLElement, Map<string, string>>()
const pendingHosts: HTMLElement[] = []
const pendingHostSet = new WeakSet<HTMLElement>()
let scheduled = false
let rafId: number | null = null

const enqueueFlush = () => {
  if (scheduled) {
    return
  }

  scheduled = true

  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    rafId = window.requestAnimationFrame(flushUpdates)
  } else {
    rafId = null
    setTimeout(flushUpdates, 16)
  }
}

const queueHost = (host: HTMLElement) => {
  if (!pendingHostSet.has(host)) {
    pendingHostSet.add(host)
    pendingHosts.push(host)
  }
}

const queueUpdate = (host: HTMLElement, key: string, value: string | null) => {
  let updates = hostUpdates.get(host)

  if (!updates) {
    updates = new Map()
    hostUpdates.set(host, updates)
  }

  updates.set(key, value)
  queueHost(host)
  enqueueFlush()
}

function flushUpdates() {
  scheduled = false

  if (rafId !== null && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }

  if (pendingHosts.length === 0) {
    return
  }

  const hosts = pendingHosts.splice(0, pendingHosts.length)
  hosts.forEach((host) => pendingHostSet.delete(host))

  for (const host of hosts) {
    const updates = hostUpdates.get(host)

    if (!updates || updates.size === 0) {
      continue
    }

    let cache = hostValues.get(host)

    if (!cache) {
      cache = new Map()
      hostValues.set(host, cache)
    }

    updates.forEach((value, key) => {
      if (value === null) {
        if (cache.has(key)) {
          host.style.removeProperty(key)
          cache.delete(key)
        }
        return
      }

      const cached = cache.get(key)
      if (cached !== value) {
        host.style.setProperty(key, value)
        cache.set(key, value)
      }
    })

    updates.clear()
  }
}

export function getStageHostElement(): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null
  }

  const explicitHost = document.querySelector<HTMLElement>(STAGE_HOST_SELECTOR)
  if (explicitHost) {
    return explicitHost
  }

  if (document.body instanceof HTMLElement) {
    return document.body
  }

  return document.documentElement instanceof HTMLElement ? document.documentElement : null
}

export function setStageVariables(updates: StageVariableUpdates): void {
  if (typeof document === 'undefined') {
    return
  }

  const host = getStageHostElement()
  if (!host) {
    return
  }

  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === 'string') {
      queueUpdate(host, key, value)
    }
  }
}

export function clearStageVariables(keys: readonly StageVariableName[] = STAGE_VARIABLE_KEYS): void {
  if (typeof document === 'undefined') {
    return
  }

  const host = getStageHostElement()
  if (!host) {
    return
  }

  keys.forEach((key) => queueUpdate(host, key, null))
}

export function toggleStageHostAttribute(attribute: string, enabled: boolean): void {
  if (typeof document === 'undefined') {
    return
  }

  const host = getStageHostElement()
  if (!host) {
    return
  }

  if (enabled) {
    host.setAttribute(attribute, '')
  } else {
    host.removeAttribute(attribute)
  }
}
