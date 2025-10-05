import { CardGrid } from '../components/content/CardGrid'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { StatusValue } from '../components/content/StatusValue'

export function RemittancesPage() {
  return (
    <>
      <PageIntro
        id="remittance-overview"
        eyebrow="Remittances"
        title="Send money with Telcoin"
        lede={
          <>
            The Telcoin Wallet offers fast, low-cost remittances across more than{' '}
            <StatusValue metricKey="remittanceCorridors" /> corridors. Use the official corridor directory to confirm supported routes, payout partners, and fees before you transfer.
          </>
        }
      />

      <section id="remittance-coverage" className="anchor-offset">
        <h2>Coverage snapshot</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'remittance-countries',
              title: 'Supported countries',
              body: (
                <>
                  <p>Telcoin currently focuses on routes across North America, Asia, and Africa with a growing list of payout partners.</p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      View corridor list →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'remittance-payouts',
              title: 'Payout methods',
              body: (
                <>
                  <p>Mobile money, bank deposit, and cash-out options vary by corridor. The Wallet displays live availability before you send.</p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      Check payouts →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'remittance-pricing',
              title: 'Transparent pricing',
              body: (
                <>
                  <p>Fees and FX rates are shown in-app prior to confirmation. TEL staking incentives can reduce costs in select routes.</p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      See pricing details →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="remittance-steps" className="anchor-offset">
        <h2>How to send</h2>
        <ol>
          <li>Verify your Telcoin Wallet account and add a payout recipient.</li>
          <li>Select the send amount and choose the payout method available in the destination corridor.</li>
          <li>Review the fee, FX rate, and estimated delivery time. Confirm the transfer and track status in the Wallet.</li>
        </ol>
        <p>For Digital Cash holders, swaps can be used to prefund in eUSD or eCAD before sending to reduce FX volatility.</p>
      </section>

      <section id="remittance-safety" className="anchor-offset">
        <h2>Safety checks</h2>
        <div className="notice notice--info">
          <p>
            Only send from the official Telcoin Wallet. Avoid third-party escrow services. If you see a delay, check{' '}
            <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
              status.telco.in
            </a>{' '}
            and contact in-app support.
          </p>
        </div>
        <ul>
          <li>
            Monitor the{' '}
            <a href="https://telco.in/newsroom" target="_blank" rel="noopener noreferrer">
              Telcoin Newsroom
            </a>{' '}
            for corridor expansions or temporary pauses.
          </li>
          <li>
            Follow{' '}
            <a href="https://x.com/telcoin" target="_blank" rel="noopener noreferrer">
              @telcoin
            </a>{' '}
            for live service notices and community updates.
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'Remittance corridors', href: 'https://telco.in/remittances', external: true },
          { label: 'Telcoin Wallet', href: 'https://telco.in/wallet', external: true },
          { label: 'Status page', href: 'https://status.telco.in', external: true },
        ]}
      />
    </>
  )
}
