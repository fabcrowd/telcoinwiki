import { NetworkAtlas } from '../components/atlas/NetworkAtlas'

export function AtlasPage() {
  return (
    <>
      <section id="atlas-hero" aria-labelledby="atlas-hero-heading" className="anchor-offset">
        <div className="mx-auto w-full max-w-[min(1600px,95vw)] px-4 sm:px-8 lg:px-12 xl:px-16 pt-[calc(var(--header-height)+3rem)] pb-6 sm:pb-8">
          <div className="text-center">
            <p className="proto-eyebrow">Interactive model</p>
            <h1 id="atlas-hero-heading" className="font-semibold text-telcoin-ink text-4xl sm:text-5xl lg:text-6xl mt-3">
              Network Atlas
            </h1>
            <p className="w-full max-w-3xl text-telcoin-ink-muted mt-4 mx-auto text-center text-base sm:text-lg">
              Telcoin Network splits its work in two: a <strong>DAG-based consensus layer</strong> decides the
              order of transactions, and a <strong>Reth-based EVM</strong> executes it. The scene below runs the
              consensus half live — four validator lanes, one certificate each per round, each anchored to a
              quorum of parents in the round before it. When a leader wins quorum support, its whole causal
              history commits at once, the gold wave sweeping back through the graph. Switch to{' '}
              <strong>Ecosystem</strong> to orbit how TEL, the network, TELx, the wallet and Digital Cash connect.
            </p>
          </div>
        </div>
      </section>

      <NetworkAtlas />

      <section className="mx-auto w-full max-w-[min(1120px,92vw)] px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <a className="atlas-deeper-card" href="/protocol#proto-consensus">
            <span className="atlas-deeper-kicker">Read more</span>
            <span className="atlas-deeper-title">Narwhal &amp; Bullshark</span>
            <span className="atlas-deeper-body">How the DAG mempool and the leader-election protocol actually work.</span>
          </a>
          <a className="atlas-deeper-card" href="/protocol#proto-lifecycle">
            <span className="atlas-deeper-kicker">Read more</span>
            <span className="atlas-deeper-title">Transaction lifecycle</span>
            <span className="atlas-deeper-body">Signature to irreversible finality, in under half a second.</span>
          </a>
          <a className="atlas-deeper-card" href="/deep-dive#deep-tokenomics">
            <span className="atlas-deeper-kicker">Read more</span>
            <span className="atlas-deeper-title">TEL tokenomics</span>
            <span className="atlas-deeper-body">Fixed supply, 2 decimals, and where the current holder count stands.</span>
          </a>
        </div>
        <p className="mt-8 text-sm text-telcoin-ink-subtle max-w-3xl mx-auto text-center">
          Protocol internals are grounded in the{' '}
          <a
            href="https://deepwiki.com/Telcoin-Association/telcoin-network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-telcoin-accent hover:underline"
          >
            Telcoin-Association/telcoin-network
          </a>{' '}
          source as documented on DeepWiki — the component names used here (Worker, Proposer, Certifier,
          Bullshark, CommittedSubDag, ConsensusOutput) are the ones in the codebase. The simulation is a faithful
          illustration of the protocol&rsquo;s shape, not a live feed of mainnet: round timing, validator count and
          parent selection are stylised for legibility. Ecosystem facts come from Telcoin&rsquo;s official
          documentation and public announcements — see the{' '}
          <a href="/protocol#proto-sources" className="text-telcoin-accent hover:underline">
            documentation index
          </a>{' '}
          for primary sources.
        </p>
      </section>
    </>
  )
}
