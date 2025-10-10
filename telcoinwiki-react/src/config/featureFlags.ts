// Central feature flags for experimental, opt-in functionality.
// Flags must not change layout or behavior unless explicitly enabled.

const boolFromEnv = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v === '1' || v === 'true' || v === 'yes' || v === 'on'
  }
  return defaultValue
}

// Vite exposes import.meta.env at build time; type as unknown to avoid 'any'.
const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
export const SCROLL_STORY_ENABLED: boolean = boolFromEnv(viteEnv?.VITE_SCROLL_STORY_ENABLED, false)

export const SCROLL_DEBUG_ENABLED: boolean = (() => {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('debug') === 'scroll'
  } catch {
    return false
  }
})()
