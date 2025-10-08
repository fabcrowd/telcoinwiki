import { CardGrid } from '../components/content/CardGrid'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function TokenomicsPage() {
  return (
    <>
      <PageIntro
        id="tokenomics-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Tokenomics"
        title="How TEL fuels, recycles, and governs Telcoin"
        lede="TEL powers every layer of the Telcoin stack: it pays gas on the Telcoin Network, rewards GSMA-member validators, and cycles through TELx and TAN programs that recycle supply toward actual usage."
      />

      <section id="tokenomics-utility" className="anchor-offset">
        <h2>Utility pillars</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'tokenomics-gas',
              title: 'Gas & execution',
              body: (
                <>
                  <p>TEL is required to execute smart contracts on the Telcoin Network, including Digital Cash mints, swaps, and TAN settlement flows.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Network overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tokenomics-staking',
              title: 'Validator & partner rewards',
              body: (
                <>
                  <p>GSMA-aligned validators and licensed partners earn TEL for securing consensus and delivering compliant remittance capacity.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/tel" target="_blank" rel="noopener noreferrer">
                      TEL issuance policy →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tokenomics-liquidity',
              title: 'TELx liquidity engine',
              body: (
                <>
                  <p>TEL is staked alongside Digital Cash pairs in TELx pools so remittances and swaps clear instantly across corridors.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      TELx documentation →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="tokenomics-cycle" className="anchor-offset">
        <h2>Burn &amp; regen cycle</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Every Telcoin Network transaction burns a portion of TEL while the remainder routes to Association-controlled treasuries. TEL issued through TAN or TELx incentive programs must be earned by driving app usage or liquidity, then can be recycled back into staking or burned through fees. This cycle keeps supply expansion tied to real activity instead of speculation.
          </p>
          <p>
            TAN incentive releases are staged, with each cohort requiring measurable wallet growth and compliance milestones before additional TEL is unlocked. TELx programs follow lifecycle stages (Active → Deprecated → Archived) so rewards taper as liquidity goals are met.
          </p>
        </div>
      </section>

      <section id="tokenomics-treasury" className="anchor-offset">
        <h2>Treasury orchestration</h2>
        <CardGrid
          columns={2}
          items={[
            {
              id: 'tokenomics-association',
              title: 'Association treasury',
              body: (
                <>
                  <p>The Telcoin Association retains the policy treasury, approving validator onboarding, TEL issuance schedules, and burn parameters alongside council oversight.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
                      Governance framework →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tokenomics-operating',
              title: 'Operating treasury',
              body: (
                <>
                  <p>Telcoin Holdings deploys operational reserves toward product growth, TAN deployment, and regulatory requirements, reporting progress back to the Association.</p>
                  <p>
                    <a href="https://docs.telcoin.org/" target="_blank" rel="noopener noreferrer">
                      Documentation hub →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tokenomics-community',
              title: 'Community programs',
              body: (
                <>
                  <p>Councils and working groups can propose TEL allocations for education, tooling, or liquidity top-ups, but must publish KPIs and reporting to continue receiving funds.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
                      Council roles →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="tokenomics-programs" className="anchor-offset">
        <h2>Active incentive programs</h2>
        <CardGrid
          columns={2}
          items={[
            {
              id: 'tokenomics-telx',
              title: 'TELx liquidity mining',
              body: (
                <>
                  <p>Liquidity providers stake TEL with Digital Cash pairs to qualify for TELx rewards. Pools are reviewed quarterly to confirm settlement volume and compliance coverage.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      TELx lifecycle →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tokenomics-tanip',
              title: 'TAN incentive program (TANIP)',
              body: (
                <>
                  <p>TANIP unlocks TEL for wallet referrals, usage streaks, and compliant on/off-ramp integrations across the Telcoin Application Network.</p>
                  <p>
                    <a href="https://docs.telcoin.org/telcoin-network/telcoin-application-network" target="_blank" rel="noopener noreferrer">
                      TAN overview →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="tokenomics-risk" className="anchor-offset">
        <h2>Risk considerations</h2>
        <div className="notice notice--info">
          <p>
            TEL remains a volatile digital asset. Always verify contract addresses through the Telcoin Association, confirm jurisdictional availability, and review security advisories before committing liquidity or staking.
          </p>
        </div>
        <p>Official references:</p>
        <ul>
          <li>
            <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
              Legal resources
            </a>{' '}
            — regional availability and disclosures.
          </li>
          <li>
            <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
              Security newsroom
            </a>{' '}
            — fraud alerts and security advisories.
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'TEL overview', href: 'https://www.telcoinassociation.org/tel', external: true },
          { label: 'TELx programs', href: 'https://www.telcoinassociation.org/telx', external: true },
          { label: 'TAN documentation', href: 'https://docs.telcoin.org/telcoin-network/telcoin-application-network', external: true },
        ]}
      />
    </>
  )
}
