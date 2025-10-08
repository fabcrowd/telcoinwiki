import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { InteractiveTopology } from '../components/network/InteractiveTopology'

export function NetworkPage() {
  return (
    <>
      <PageIntro
        id="network-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Telcoin Network"
        title="Carrier-secured, EVM compatible"
        lede="The Telcoin Network is an EVM chain whose validators are GSMA-member mobile network operators. It connects remittances, Digital Cash, TEL staking, and TELx liquidity under a compliance-first governance model."
      />

      <section id="network-architecture" className="anchor-offset">
        <h2>The engine topology</h2>
        <p>
          Explore how Association governance, validator operators, TELx liquidity, and app endpoints weave together to power Telcoin services. The interactive canvas below highlights how value and compliance signals move between pillars.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <InteractiveTopology />

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

      <section id="network-governance" className="anchor-offset">
        <h2>Governance &amp; upgrades</h2>
        <p>The Telcoin Association manages validator onboarding, approves protocol upgrades, and coordinates TEL issuance policies with community councils. Proposals flow through Association review before activation.</p>
        <p>
          <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
            Read the governance charter →
          </a>
        </p>
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
          { label: 'Telcoin Association — Network', href: 'https://www.telcoinassociation.org/network', external: true },
          { label: 'Telcoin Network landing', href: 'https://www.telcoinnetwork.org', external: true },
          { label: 'Security newsroom', href: 'https://telco.in/newsroom/security', external: true },
        ]}
      />
    </>
  )
}
