export function HeroTicker() {
  return (
    <div className="flex w-full flex-wrap items-center gap-3 rounded-full border border-telcoin-border bg-telcoin-surface px-4 py-3 text-sm text-telcoin-ink md:gap-4">
      <span className="relative inline-flex h-2 w-2 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-telcoin-accent blur-[2px]" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-telcoin-accent" />
      </span>
      <span className="font-semibold uppercase tracking-[0.16em] text-telcoin-ink-subtle md:tracking-[0.2em]">
        <span className="md:hidden">Live community maintained</span>
        <span className="hidden md:inline">Live</span>
      </span>
      <span className="hidden text-base text-telcoin-ink md:inline">
        Community-maintained. Always improving. Confirm critical details via the official Telcoin Wallet or Telcoin Association documentation.
      </span>
    </div>
  )
}
