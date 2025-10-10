// Central feature flags for experimental, opt-in functionality.
// Flags must not change layout or behavior unless explicitly enabled.

const boolFromEnv = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v === '1' || v === 'true' || v === 'yes' || v === 'on'
  }
  return defaultValue
}

// Read from process.env in tests/Node, and from Vite env at build via env injection.
// Avoid `import.meta` so Jest (CJS) doesn't choke on the syntax.
const nodeEnvVal =
  typeof process !== 'undefined' && process && (process.env?.VITE_SCROLL_STORY_ENABLED ?? process.env?.SCROLL_STORY_ENABLED)

export const SCROLL_STORY_ENABLED: boolean = boolFromEnv(nodeEnvVal, false)

export const SCROLL_DEBUG_ENABLED: boolean = (() => {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('debug') === 'scroll'
  } catch {
    return false
  }
})()
