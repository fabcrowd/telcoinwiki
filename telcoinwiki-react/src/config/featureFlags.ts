// Central feature flags for experimental, opt-in functionality.
// Flags must not change layout or behavior unless explicitly enabled.

const boolFromEnv = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v === '1' || v === 'true' || v === 'yes' || v === 'on'
  }
  return defaultValue
}

// 1) Build-time flags injected into window by index.html (safe in Jest/CJS)
const runtimeFlags = (globalThis as unknown as { __FEATURE_FLAGS__?: Record<string, unknown> }).__FEATURE_FLAGS__ || {}
const runtimeScrollVal = runtimeFlags.SCROLL_STORY_ENABLED as boolean | undefined

// 2) Node env (tests / SSR) fallback
const nodeEnvVal =
  typeof process !== 'undefined' && process && (process.env?.VITE_SCROLL_STORY_ENABLED ?? process.env?.SCROLL_STORY_ENABLED)

const urlOverride = (() => {
  try {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('story')
    if (!raw) return null
    const v = raw.trim().toLowerCase()
    return v === '1' || v === 'true' || v === 'yes' || v === 'on'
      ? true
      : v === '0' || v === 'false' || v === 'no' || v === 'off'
        ? false
        : null
  } catch {
    return null
  }
})()

export const SCROLL_STORY_ENABLED: boolean = (
  urlOverride ?? (typeof runtimeScrollVal === 'boolean' ? runtimeScrollVal : boolFromEnv(nodeEnvVal, false))
)

export const SCROLL_DEBUG_ENABLED: boolean = (() => {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('debug') === 'scroll'
  } catch {
    return false
  }
})()

// Mega menu (header) enablement — disabled by default in production.
const runtimeNavVal = runtimeFlags.MEGA_MENU_ENABLED as boolean | undefined

const urlNavOverride = (() => {
  try {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('nav')
    if (!raw) return null
    const v = raw.trim().toLowerCase()
    return v === '1' || v === 'true' || v === 'yes' || v === 'on'
      ? true
      : v === '0' || v === 'false' || v === 'no' || v === 'off'
        ? false
        : null
  } catch {
    return null
  }
})()

export const MEGA_MENU_ENABLED: boolean = (
  // URL override wins first
  urlNavOverride ??
  // then any runtime/env flag injected at build time
  (typeof runtimeNavVal === 'boolean' ? runtimeNavVal : undefined) ??
  // finally default to true across environments
  true
)
