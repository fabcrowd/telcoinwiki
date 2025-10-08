import { CardGrid } from '../components/content/CardGrid'
import { ContextBox } from '../components/content/ContextBox'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function ModelPage() {
  return (
    <>
      <PageIntro
        id="model-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Pillar two"
        title="How the Telcoin model aligns incentives"
        lede="See how the Association, the Telcoin company, and the community split responsibilities so the network, wallet, and liquidity engine stay mission aligned."
      >
        <nav className="toc-chips" aria-label="Model sections">
          <a className="toc-chip" href="#model-structure">
            Operating structure
          </a>
          <a className="toc-chip" href="#model-incentives">
            TEL incentives
          </a>
          <a className="toc-chip" href="#model-guardrails">
            Guardrails &amp; policy
          </a>
        </nav>
      </PageIntro>

      <section id="model-structure" className="anchor-offset">
        <h2>Three groups, one mission</h2>
        <p>
          Telcoin combines a member-run association, a regulated technology company, and an engaged community. Each has a
          distinct charter so product, infrastructure, and education remain focused on affordable, compliant financial access.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'model-structure-association',
              title: 'Telcoin Association',
              body: (
                <>
                  <p>
                    The Swiss-based Association stewards validator onboarding, monetary policy for TEL and Digital Cash, and the
                    governance processes that guide roadmap decisions.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org" target="_blank" rel="noopener noreferrer">
                      Association overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'model-structure-company',
              title: 'Telcoin company',
              body: (
                <>
                  <p>
                    Telcoin Holdings builds the Wallet experience, manages telecom and payments partnerships, and operates a
                    regulated digital asset bank in Nebraska.
                  </p>
                  <p>
                    <a href="https://telco.in" target="_blank" rel="noopener noreferrer">
                      Telcoin corporate site →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'model-structure-community',
              title: 'Community knowledge base',
              body: (
                <>
                  <p>
                    Contributors maintain documentation, FAQ entries, and dashboards that complement official releases. This wiki
                    aggregates those resources with citations.
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="model-incentives" className="anchor-offset">
        <h2>TEL aligns operators and liquidity partners</h2>
        <p>
          TEL is the native asset of the Telcoin Network. It powers transaction fees, validator staking, and the TELx incentives
          that encourage liquidity where it is most needed.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'model-incentives-fees',
              title: 'Network gas',
              body: (
                <>
                  <p>
                    Every Telcoin Network transaction pays gas in TEL, creating baseline demand as usage scales.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Network documentation →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'model-incentives-staking',
              title: 'Validator staking',
              body: (
                <>
                  <p>
                    Mobile network operators and infrastructure partners stake TEL to secure validator seats and earn emissions
                    when performance targets are met.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org/tel" target="_blank" rel="noopener noreferrer">
                      TEL token utility →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'model-incentives-telx',
              title: 'TELx liquidity programs',
              body: (
                <>
                  <p>
                    TELx pools route TEL-denominated rewards to liquidity providers who deepen stable-value and remittance pairs.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      TELx overview →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="model-guardrails" className="anchor-offset">
        <h2>Guardrails keep growth compliant</h2>
        <p>
          Policy, audits, and communications channels help the ecosystem scale responsibly. Review the resources below to stay up
          to date on regulatory posture and community governance.
        </p>
        <ContextBox title="Where to monitor policy updates">
          <ul>
            <li>
              <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
                Telcoin legal resources
              </a>{' '}
              outline licenses, disclosures, and customer agreements.
            </li>
            <li>
              <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
                Security newsroom posts
              </a>{' '}
              track incident response, SOC 2 progress, and customer advisories.
            </li>
            <li>
              <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
                Association governance updates
              </a>{' '}
              document proposal flows and council activity.
            </li>
          </ul>
        </ContextBox>
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org', external: true },
          { label: 'TEL token utility', href: 'https://www.telcoinassociation.org/tel', external: true },
          { label: 'Legal resources', href: 'https://telco.in/legal', external: true },
        ]}
      />
    </>
  )
}
