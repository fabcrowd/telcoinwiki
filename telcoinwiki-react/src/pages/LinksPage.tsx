import { CardGrid } from '../components/content/CardGrid'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function LinksPage() {
  return (
    <>
      <PageIntro
        id="links-overview"
        eyebrow="Official links"
        title="Verified Telcoin destinations"
        lede="Bookmark these official Telcoin channels for product information, governance updates, status notifications, legal notices, and security alerts."
      />

      <section id="links-grid" className="anchor-offset">
        <h2>Product &amp; services</h2>
        <CardGrid
          items={[
            {
              id: 'links-wallet',
              title: 'Telcoin Wallet',
              body: (
                <>
                  <p>Download links, feature overviews, and corridor availability.</p>
                  <p>
                    <a href="https://telco.in/wallet" target="_blank" rel="noopener noreferrer">
                      telco.in/wallet →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-digital-cash',
              title: 'Digital Cash',
              body: (
                <>
                  <p>Fiat-backed tokens (eUSD, eCAD, ePHP) with reserve and integration details.</p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      telco.in/digital-cash →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-remittances',
              title: 'Remittances',
              body: (
                <>
                  <p>Supported corridors, payout methods, and pricing.</p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      telco.in/remittances →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-status',
              title: 'Status page',
              body: (
                <>
                  <p>Live service availability and maintenance notifications.</p>
                  <p>
                    <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
                      status.telco.in →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="links-governance" className="anchor-offset">
        <h2>Governance &amp; documentation</h2>
        <CardGrid
          items={[
            {
              id: 'links-association',
              title: 'Telcoin Association',
              body: (
                <>
                  <p>Official governance site for the Association, validators, and councils.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org" target="_blank" rel="noopener noreferrer">
                      telcoinassociation.org →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-network',
              title: 'Telcoin Network',
              body: (
                <>
                  <p>Technical overview of the Telcoin Network and validator requirements.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Network docs →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-tel',
              title: 'TEL token',
              body: (
                <>
                  <p>Issuance policies, incentive programs, and governance roles.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/tel" target="_blank" rel="noopener noreferrer">
                      TEL documentation →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-telx',
              title: 'TELx',
              body: (
                <>
                  <p>Liquidity engine documentation and lifecycle policies.</p>
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

      <section id="links-compliance" className="anchor-offset">
        <h2>Compliance &amp; communications</h2>
        <CardGrid
          items={[
            {
              id: 'links-legal',
              title: 'Legal resources',
              body: (
                <>
                  <p>Privacy policy, terms of service, and jurisdictional statements.</p>
                  <p>
                    <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
                      telco.in/legal →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-security',
              title: 'Security newsroom',
              body: (
                <>
                  <p>Security advisories, compliance updates, and SOC milestones.</p>
                  <p>
                    <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
                      Security updates →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-newsroom',
              title: 'Newsroom',
              body: (
                <>
                  <p>Product announcements, corridor launches, and regulatory news.</p>
                  <p>
                    <a href="https://telco.in/newsroom" target="_blank" rel="noopener noreferrer">
                      Newsroom →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'links-social',
              title: 'Telcoin on X',
              body: (
                <>
                  <p>Official social channel for real-time updates and community highlights.</p>
                  <p>
                    <a href="https://x.com/telcoin" target="_blank" rel="noopener noreferrer">
                      x.com/telcoin →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin product hub', href: 'https://telco.in/', external: true },
          { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org', external: true },
          { label: 'Telcoin Newsroom', href: 'https://telco.in/newsroom', external: true },
        ]}
      />
    </>
  )
}
