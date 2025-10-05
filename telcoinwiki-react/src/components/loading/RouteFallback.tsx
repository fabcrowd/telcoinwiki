import { memo } from 'react'

export const RouteFallback = memo(function RouteFallback() {
  return (
    <div className="route-fallback tc-card" role="status" aria-live="polite">
      <span className="route-fallback__spinner" aria-hidden="true" />
      <p className="route-fallback__message">Loading the latest Telcoin insights…</p>
    </div>
  )
})
