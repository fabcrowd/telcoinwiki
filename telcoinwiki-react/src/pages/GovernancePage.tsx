import { CardGrid } from '../components/content/CardGrid'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function GovernancePage() {
  return (
    <>
      <PageIntro
        id="governance-overview"
        eyebrow="Governance & Association"
        title="Who stewards Telcoin?"
        lede="The Telcoin Association, a Swiss Verein, leads Telcoin Network governance, validator onboarding, and issuance policies for TEL and Digital Cash. Community councils partner with the Association to review and advance proposals."
      />

      <section id="governance-structure" className="anchor-offset">
        <h2>Structure</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'governance-structure-board',
              title: 'Association board',
              body: (
                <>
                  <p>Sets strategic direction, approves validator additions, and ratifies TEL/TANIP issuance schedules.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org" target="_blank" rel="noopener noreferrer">
                      Association overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'governance-structure-councils',
              title: 'Community councils',
              body: (
                <>
                  <p>Subject-matter councils (network, product, compliance) assess proposals before they reach the Association for ratification.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
                      Council framework →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'governance-structure-groups',
              title: 'Working groups',
              body: (
                <>
                  <p>Specialized groups coordinate upgrades such as TELx lifecycle changes, compliance reviews, and mobile UX enhancements.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      TELx docs →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="proposal-flow" className="anchor-offset">
        <h2>Proposal flow</h2>
        <ol>
          <li>Ideas start in community channels or Association-led working groups.</li>
          <li>Councils evaluate scope, compliance impact, and technical readiness.</li>
          <li>The Association votes to approve, adjust, or reject proposals before implementation.</li>
        </ol>
        <p>Implementation details are published through Association announcements and coordinated with Telcoin Holdings for product rollouts.</p>
      </section>

      <section id="compliance" className="anchor-offset">
        <h2>Compliance &amp; transparency</h2>
        <div className="notice notice--info">
          <p>Telcoin Holdings provides SOC reporting and legal documentation while the Association ensures network governance meets telecom and financial regulatory expectations.</p>
        </div>
        <ul>
          <li>
            <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
              Legal resources
            </a>{' '}
            — privacy policies, terms, and jurisdictional notes.
          </li>
          <li>
            <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
              Security newsroom
            </a>{' '}
            — compliance announcements and security advisories.
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org', external: true },
          { label: 'Governance framework', href: 'https://www.telcoinassociation.org/governance', external: true },
          { label: 'Legal & compliance', href: 'https://telco.in/legal', external: true },
        ]}
      />
    </>
  )
}
