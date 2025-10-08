import { CardGrid } from '../components/content/CardGrid'
import { ContextBox } from '../components/content/ContextBox'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function ExperiencePage() {
  return (
    <>
      <PageIntro
        id="experience-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Pillar four"
        title="What the Telcoin experience feels like"
        lede="Walk through the Telcoin Wallet journey so newcomers know what to expect and how to stay safe."
      >
        <nav className="toc-chips" aria-label="Experience sections">
          <a className="toc-chip" href="#experience-onboarding">
            Onboarding
          </a>
          <a className="toc-chip" href="#experience-transfers">
            Transfers
          </a>
          <a className="toc-chip" href="#experience-security">
            Safety
          </a>
        </nav>
      </PageIntro>

      <section id="experience-onboarding" className="anchor-offset">
        <h2>Verification built for mobile-first users</h2>
        <p>
          The Telcoin Wallet guides you through identity checks, device approvals, and recovery safeguards using clear language
          and contextual tips.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'experience-onboarding-download',
              title: 'Download the Wallet',
              body: (
                <>
                  <p>Install the official Telcoin Wallet app from the iOS App Store or Google Play.</p>
                  <p>
                    <a href="https://telco.in/wallet" target="_blank" rel="noopener noreferrer">
                      telco.in/wallet →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'experience-onboarding-kyc',
              title: 'Complete identity verification',
              body: (
                <>
                  <p>
                    Capture your ID, submit biometric checks, and answer region-specific compliance questions directly in the app.
                  </p>
                </>
              ),
            },
            {
              id: 'experience-onboarding-recovery',
              title: 'Secure recovery options',
              body: (
                <>
                  <p>
                    Enable multi-factor recovery and keep your device list current so you can restore access if a phone is lost or
                    replaced.
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="experience-transfers" className="anchor-offset">
        <h2>Transparent global transfers</h2>
        <p>
          Sending money with Telcoin surfaces real-time FX, fees, and delivery windows before you confirm. Mobile money partners
          receive funds in seconds once corridors are verified.
        </p>
        <ContextBox title="Sending checklist">
          <ol>
            <li>Select a verified recipient or add a new contact with the correct payout details.</li>
            <li>Choose the send amount and review fees and FX presented in-app before you confirm.</li>
            <li>Track delivery status, notifications, and potential delays from within the Wallet.</li>
          </ol>
        </ContextBox>
      </section>

      <section id="experience-security" className="anchor-offset">
        <h2>Keep your account protected</h2>
        <p>
          Security reminders, notification controls, and official support channels keep your account safe. Bookmark the links
          below and avoid third-party escrow services.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'experience-security-status',
              title: 'Monitor status updates',
              body: (
                <>
                  <p>
                    Outage reports and maintenance windows are published at status.telco.in so you can verify service health.
                  </p>
                  <p>
                    <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
                      status.telco.in →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'experience-security-support',
              title: 'Use official support',
              body: (
                <>
                  <p>
                    Reach Telcoin support through the in-app messenger. Never share recovery phrases or personal details in public
                    channels.
                  </p>
                </>
              ),
            },
            {
              id: 'experience-security-newsroom',
              title: 'Stay current on advisories',
              body: (
                <>
                  <p>Security newsroom posts cover phishing alerts, compliance notices, and SOC 2 progress.</p>
                  <p>
                    <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
                      Security newsroom →
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
          { label: 'Telcoin Wallet', href: 'https://telco.in/wallet', external: true },
          { label: 'Remittance corridors', href: 'https://telco.in/remittances', external: true },
          { label: 'Security newsroom', href: 'https://telco.in/newsroom/security', external: true },
        ]}
      />
    </>
  )
}
