import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { InteractiveTopology } from '../components/network/InteractiveTopology'
import { Legend } from '../components/network/Legend'

export function NetworkPage() {
  return (
    <>
      <PageIntro
        id="network-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Telcoin Network"
        title="Carrier-secured DAG with BFT finality"
        lede="The Telcoin Network (TN) processes transactions through a directed acyclic graph, then finalizes blocks with a BFT committee of GSMA-member validators. TEL pays the gas while TELx and TAN programs feed liquidity and compliance back into the chain."
      />

      <section id="network-consensus" className="anchor-offset">
        <h2>Consensus snapshot</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Validators collect transactions in a DAG, allowing high throughput and locality, then commit finalized blocks via a BFT round. Each validator must be a GSMA-member carrier or telecom affiliate, aligning uptime and regulatory expectations with telecom best practices.
          </p>
          <p>
            The network exposes EVM compatibility so existing tooling works out of the box, while Association-managed smart contracts handle TEL burn rates, treasury routing, and Digital Cash settlement.
          </p>
        </div>
      </section>

      <section id="network-architecture" className="anchor-offset">
        <h2>The engine topology</h2>
        <Legend id="network-legend" className="mb-4" />
        <p>
          Explore how Association governance, validator operators, TELx liquidity, and app endpoints weave together to power Telcoin services. The interactive canvas below highlights how value and compliance signals move between pillars.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <InteractiveTopology describedById="network-legend" />

          <div className="flex flex-col gap-6">
            <article className="rounded-3xl border border-telcoin-ink/10 bg-white/80 p-6 shadow-lg shadow-telcoin-ink/10 backdrop-blur">
              <h3 className="text-xl font-semibold text-telcoin-ink">Governance orchestrates the engine</h3>
              <p className="mt-3 text-base text-telcoin-ink-muted">
                The Telcoin Association aligns validators and TAN operators so policy, upgrades, and reserve reporting keep the network compliant. Each touchpoint in the topology traces back to Association standards.
              </p>
              <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-telcoin-ink hover:text-telcoin-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telcoin-ink" href="/governance#governance-structure">
                Review the governance charter <span aria-hidden="true">→</span>
              </a>
            </article>

            <article className="rounded-3xl border border-telcoin-ink/10 bg-white/80 p-6 shadow-lg shadow-telcoin-ink/10 backdrop-blur">
              <h3 className="text-xl font-semibold text-telcoin-ink">Liquidity keeps TEL and TELx responsive</h3>
              <p className="mt-3 text-base text-telcoin-ink-muted">
                TEL staking rewards flow from validators into TELx pools, where Digital Cash pairs balance corridor demand. Hover a liquidity node to see how swaps, burns, and remittances stay synchronized with validator output.
              </p>
              <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-telcoin-ink hover:text-telcoin-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telcoin-ink" href="/pools#pools-overview">
                Explore TELx programs <span aria-hidden="true">→</span>
              </a>
            </article>

            <article className="rounded-3xl border border-telcoin-ink/10 bg-white/80 p-6 shadow-lg shadow-telcoin-ink/10 backdrop-blur">
              <h3 className="text-xl font-semibold text-telcoin-ink">Apps connect the experience</h3>
              <p className="mt-3 text-base text-telcoin-ink-muted">
                Telcoin Wallet endpoints and Digital Cash reserves translate network capacity into user-facing experiences. Their CTAs bridge to the Wallet, Digital Cash, and Home Engine sections so readers can keep following the storyline.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-ink hover:text-telcoin-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telcoin-ink" href="/wallet#wallet-overview">
                  See the wallet tour <span aria-hidden="true">→</span>
                </a>
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-ink hover:text-telcoin-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telcoin-ink" href="/digital-cash#digital-cash-use">
                  Learn about Digital Cash <span aria-hidden="true">→</span>
                </a>
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-ink hover:text-telcoin-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telcoin-ink" href="/#home-engine">
                  Revisit the Engine pillar <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="network-layers" className="anchor-offset">
        <h2>Layers that plug into TN</h2>
        <div className="card-grid" role="list">
          <article className="card" role="listitem">
            <h3 className="card__title">TAN: Telcoin Application Network</h3>
            <p>
              TAN bridges wallet activity, referrals, and compliance events into Association reporting so TEL rewards match genuine user adoption.
            </p>
            <p>
              <a href="https://docs.telcoin.org/telcoin-network/telcoin-application-network" target="_blank" rel="noopener noreferrer">
                TAN documentation →
              </a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">TELx: Liquidity layer</h3>
            <p>
              Automated market makers balance TEL with Digital Cash, feeding quotes back to the Wallet and amortizing validator rewards into real liquidity.
            </p>
            <p>
              <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                TELx docs →
              </a>
            </p>
          </article>
        </div>
      </section>

      <section id="network-security" className="anchor-offset">
        <h2>Security posture</h2>
        <div className="notice notice--info">
          <p>
            Validator operators implement telecom-grade infrastructure and must comply with Association security audits. Users should still verify contract addresses, monitor the security newsroom, and keep software updated.
          </p>
        </div>
        <ul>
          <li>
            <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
              Security newsroom
            </a>{' '}
            — incident reports and SOC updates.
          </li>
          <li>
            <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
              Status page
            </a>{' '}
            — network and service uptime information.
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin Network docs', href: 'https://docs.telcoin.org/telcoin-network/overview', external: true },
          { label: 'Telcoin Association — Network', href: 'https://www.telcoinassociation.org/network', external: true },
          { label: 'Telcoin Network landing', href: 'https://www.telcoinnetwork.org', external: true },
          { label: 'Security newsroom', href: 'https://telco.in/newsroom/security', external: true },
        ]}
      />
    </>
  )
}
