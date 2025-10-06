import { CardGrid } from '../components/content/CardGrid'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

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
        <h2>Architecture highlights</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'network-architecture-evm',
              title: 'EVM smart contracts',
              body: (
                <>
                  <p>Developers can deploy Solidity contracts and integrate with tooling familiar to the broader Ethereum ecosystem.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Association technical overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'network-architecture-validators',
              title: 'Validator criteria',
              body: (
                <>
                  <p>Mobile network operators that meet Association-defined security and compliance standards can operate validators.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Validator requirements →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'network-architecture-performance',
              title: 'Settlement performance',
              body: (
                <>
                  <p>Transactions finalize in seconds, enabling instant settlement for Digital Cash, remittances, and TELx liquidity flows.</p>
                  <p>
                    <a href="https://www.telcoinnetwork.org" target="_blank" rel="noopener noreferrer">
                      Network landing →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
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
