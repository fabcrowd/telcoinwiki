import { Link } from 'react-router-dom'
import { FaqCard } from '../components/content/FaqCard'
import { SourceBox } from '../components/content/SourceBox'
import { StatusValue } from '../components/content/StatusValue'

const quickStartCards = [
  {
    id: 'wallet-setup',
    title: 'What is the Telcoin Wallet and what can it do?',
    summary: 'Download the official app, complete identity verification, and enable recovery safeguards before transacting.',
    body: (
      <p>
        The Telcoin Wallet is the official mobile app that lets verified users buy, sell, and store TEL alongside multi-currency
        digital cash. It provides direct access to Telcoin remittances, in-app swaps, and a secure account recovery path tied to
        your device and credentials.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/wallet">Explore the Telcoin Wallet guide</Link>,
    sources: [
      {
        label: 'Telcoin Wallet',
        href: 'https://telco.in/wallet',
        external: true,
      },
    ],
  },
  {
    id: 'telcoin-overview',
    title: 'What is Telcoin in one paragraph?',
    summary: 'See how the Wallet, Network, and Association align to deliver compliant, mobile-first financial services.',
    body: (
      <p>
        Telcoin pairs a global mobile-first financial app with the Telcoin Network, a carrier-secured EVM chain governed by the
        Telcoin Association. The ecosystem is designed to let users send money, hold digital cash, and interact with compliant
        DeFi services using their own smartphones.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/about">Understand the Telcoin ecosystem</Link>,
    sources: [
      {
        label: 'Telcoin overview',
        href: 'https://telco.in/',
        external: true,
      },
      {
        label: 'Telcoin Association overview',
        href: 'https://www.telcoinassociation.org',
        external: true,
      },
    ],
  },
  {
    id: 'digital-cash-basics',
    title: 'What is Digital Cash?',
    summary: 'Review supported currencies like eUSD, eCAD, and ePHP, plus how they settle instantly on the Telcoin Network.',
    body: (
      <p>
        Digital Cash is Telcoin’s multi-currency stablecoin suite, offering fiat-backed assets such as eUSD, eCAD, and ePHP that
        settle instantly on the Telcoin Network. These currencies are spendable in the Telcoin Wallet and integrate with
        remittances, merchant payouts, and TELx liquidity.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/digital-cash">Dive into Digital Cash</Link>,
    sources: [
      {
        label: 'Digital Cash overview',
        href: 'https://telco.in/digital-cash',
        external: true,
      },
    ],
  },
  {
    id: 'remittance-coverage',
    title: 'Where can I send remittances today?',
    summary: 'Confirm current send and receive markets, payout partners, and fee schedules before initiating transfers.',
    body: (
      <p>
        Telcoin currently supports remittance corridors across{' '}
        <StatusValue metricKey="remittanceCorridors" format="plus" />{' '}
        countries, focusing on fast and low-cost mobile money payouts. Live corridor availability and fees are listed inside the
        Telcoin Wallet and on the official remittance corridors page.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/remittances">View remittance coverage</Link>,
    sources: [
      {
        label: 'Remittance corridors',
        href: 'https://telco.in/remittances',
        external: true,
      },
    ],
  },
  {
    id: 'tel-utility',
    title: 'What is TEL (the token) used for?',
    summary: 'Learn how TEL powers network fees, staking incentives, and TELx liquidity programs that reward participation.',
    body: (
      <p>
        TEL is the native asset of the Telcoin Network. It functions as network gas, powers staking and governance incentives,
        and serves as the unit of account for TELx liquidity programs that reward users who deepen ecosystem liquidity.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/tel-token">Learn how TEL is used</Link>,
    sources: [
      {
        label: 'TEL token overview',
        href: 'https://www.telcoinassociation.org/tel',
        external: true,
      },
    ],
  },
  {
    id: 'telx-orientation',
    title: 'What is TELx?',
    summary: 'See how liquidity pools connect Wallet users to swaps and how incentives are distributed through TEL rewards.',
    body: (
      <p>
        TELx is Telcoin’s liquidity layer that connects the Telcoin Wallet, Network, and partner DeFi protocols. It lets users
        supply TEL and digital cash to earn rewards, driving the regulated liquidity that powers in-app swaps and remittance
        throughput.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/telx">Get started with TELx</Link>,
    sources: [
      {
        label: 'TELx overview',
        href: 'https://www.telcoinassociation.org/telx',
        external: true,
      },
      {
        label: 'TELx pools',
        href: 'https://www.telx.network/pools',
        external: true,
      },
    ],
  },
  {
    id: 'governance-basics',
    title: 'Who is the Telcoin Association and what do they do?',
    summary: 'Understand who stewards validator onboarding, issuance policies, and how community proposals are reviewed.',
    body: (
      <p>
        The Telcoin Association is a Swiss Verein responsible for Telcoin Network governance, validator onboarding, and the
        issuance policies for TEL and Digital Cash. The Association stewards proposals, security reviews, and compliance
        frameworks in collaboration with community councils.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/governance">Review governance structure</Link>,
    sources: [
      {
        label: 'Telcoin Association',
        href: 'https://www.telcoinassociation.org',
        external: true,
      },
    ],
  },
  {
    id: 'compliance-basics',
    title: 'Is Telcoin compliant?',
    summary: 'Stay current on SOC 2 progress, legal notices, and security advisories across Telcoin’s regulated entities.',
    body: (
      <p>
        Telcoin Holdings reports SOC 2 Type II attestation progress and operates a regulated digital asset bank in Nebraska,
        while the Association maintains governance that aligns with telecom and financial regulations. Legal resources and
        security updates are published on the official site.
      </p>
    ),
    cta: (
      <Link className="faq-card__cta" to="/governance#compliance">
        Check compliance overview
      </Link>
    ),
    sources: [
      {
        label: 'Security & compliance updates',
        href: 'https://telco.in/newsroom/security',
        external: true,
      },
      {
        label: 'Legal resources',
        href: 'https://telco.in/legal',
        external: true,
      },
    ],
  },
  {
    id: 'network-overview',
    title: 'What is the Telcoin Network?',
    summary: 'See how EVM compatibility, MNO validators, and staking policies create a telecom-grade blockchain.',
    body: (
      <p>
        The Telcoin Network is an EVM-compatible, proof-of-stake blockchain secured by mobile network operators who meet GSMA
        standards. It underpins Telcoin services and hosts smart contracts for digital cash, TEL staking, and TELx liquidity while
        remaining governed by the Telcoin Association.
      </p>
    ),
    cta: <Link className="faq-card__cta" to="/network">Explore the Telcoin Network</Link>,
    sources: [
      {
        label: 'Telcoin Network',
        href: 'https://www.telcoinassociation.org/network',
        external: true,
      },
      {
        label: 'Telcoin Network overview',
        href: 'https://www.telcoinnetwork.org',
        external: true,
      },
    ],
  },
  {
    id: 'official-updates',
    title: 'Where can I find official updates?',
    summary: 'Subscribe to the Newsroom, monitor the Status page, and follow @telcoin for live service announcements.',
    body: (
      <p>
        Official announcements ship through the Telcoin Newsroom, the Telcoin Status page, and verified social channels such as X
        (Twitter). You can also follow product updates directly inside the Telcoin Wallet for release notes and maintenance
        alerts.
      </p>
    ),
    cta: (
      <Link className="faq-card__cta" to="/links#links-compliance">
        See official update channels
      </Link>
    ),
    sources: [
      {
        label: 'Telcoin Newsroom',
        href: 'https://telco.in/newsroom',
        external: true,
      },
      {
        label: 'Status page',
        href: 'https://status.telco.in',
        external: true,
      },
      {
        label: 'Telcoin on X',
        href: 'https://x.com/telcoin',
        external: true,
      },
    ],
  },
]

export function StartHerePage() {
  return (
    <>
      <section id="start-intro" className="page-intro anchor-offset tc-card">
        <p className="page-intro__eyebrow">Start here</p>
        <h1 className="page-intro__title">Your Telcoin onboarding checklist</h1>
        <p className="page-intro__lede">
          Use these quick answers to ground yourself in the Telcoin Wallet, Digital Cash, remittance coverage, TEL utility, and
          the governance structure that keeps everything compliant.
        </p>
        <div className="notice" role="note">
          <p className="notice__title">How to use this page</p>
          <p>
            Each card links to the community FAQ for context and to the official Telcoin or Association resource for authoritative
            guidance. Bookmark the sections you rely on most—the cards will stay updated as the ecosystem evolves.
          </p>
        </div>
      </section>

      <section id="quick-actions" className="anchor-offset">
        <h2>Essential first steps</h2>
        <div className="card-grid card-grid--cols-2" role="list">
          {quickStartCards.map(({ id, title, summary, body, cta, sources }) => (
            <FaqCard key={id} id={id} title={title} summary={summary} cta={cta} sources={sources}>
              {body}
            </FaqCard>
          ))}
        </div>
      </section>

      <section id="support-links" className="anchor-offset">
        <h2>Need more help?</h2>
        <div className="notice notice--info">
          <p>
            If something looks off in the Telcoin Wallet, contact support from inside the app. For status updates, check{' '}
            <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
              status.telco.in
            </a>{' '}
            and the{' '}
            <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
              security newsroom feed
            </a>
            .
          </p>
        </div>
        <p>
          For builder resources, visit <Link to="/builders">the Builders section</Link>. To explore liquidity data, head to{' '}
          <Link to="/pools">TELx Pools</Link> or <Link to="/portfolio">Portfolio Explorer</Link>.
        </p>
      </section>

      <SourceBox
        title="From the source"
        links={[
          { label: 'Telcoin product hub', href: 'https://telco.in/', external: true },
          { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org', external: true },
          { label: 'Legal & compliance', href: 'https://telco.in/legal', external: true },
        ]}
      />
    </>
  )
}
