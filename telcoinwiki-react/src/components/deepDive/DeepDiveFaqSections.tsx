import type { ReactNode } from 'react'

type FaqItem = {
  question: string
  answer: ReactNode
}

type DeepDiveSection = {
  id: string
  title: string
  faqs: FaqItem[]
}

const SECTIONS: DeepDiveSection[] = [
  {
    id: 'deep-problem',
    title: 'The Problem',
    faqs: [
      {
        question: 'How do transfers lose value midstream?',
        answer: (
          <>
            <p>
              Traditional payments move through multiple middlemen and fee layers, each taking a cut. Telcoin compresses these layers inside the wallet, reducing costs and delays.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/remittances" rel="noreferrer" target="_blank">
                Remittance overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'Why is mobile-first design necessary?',
        answer: (
          <>
            <p>
              Telcoin designs onboarding so users can access services without needing a bank account. Mobile-native verification and recovery flows make financial services accessible to billions of unbanked users.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/wallet" rel="noreferrer" target="_blank">
                Wallet overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does compliance need transparency?',
        answer: (
          <>
            <p>
              TAN reporting and Association-led policy keep telecom-grade oversight at the heart of the system. Transparency in compliance helps build trust and ensures regulatory alignment.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoinassociation.org/governance" rel="noreferrer" target="_blank">
                Governance framework
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'deep-governance',
    title: 'Governance',
    faqs: [
      {
        question: 'How does the Association approve validators and upgrades?',
        answer: (
          <>
            <p>
              Telcoin's governance framework explains that validator candidates must be GSMA members, pass compliance reviews, and receive a board vote after council diligence. Protocol upgrades and treasury releases follow similar checkpoints before activation.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoinassociation.org/governance" rel="noreferrer" target="_blank">
                Governance framework
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'What keeps Association treasuries accountable?',
        answer: (
          <>
            <p>
              TAN documentation details how TEL allocations unlock only after milestones are met and reports are filed. Councils can pause or adjust future releases if KPIs or compliance evidence fall short.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.org/telcoin-network/telcoin-application-network" rel="noreferrer" target="_blank">
                TAN documentation
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'Where can I confirm legal and compliance status?',
        answer: (
          <>
            <p>
              Telcoin maintains a legal hub with terms, privacy notices, and jurisdiction-specific disclosures so users and partners can verify availability before transacting.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/legal" rel="noreferrer" target="_blank">
                Telcoin legal resources
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'deep-network',
    title: 'Network',
    faqs: [
      {
        question: 'What architecture underpins the Telcoin Network?',
        answer: (
          <>
            <p>
              The Telcoin Network overview highlights DAG-based transaction propagation with BFT finality handled by GSMA-member validators. TEL is the native asset that pays gas and routes burn and treasury flows.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.org/telcoin-network/overview" rel="noreferrer" target="_blank">
                Telcoin Network overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does the modular stack optimize consensus?',
        answer: (
          <>
            <p>
              Telcoin uses Narwhal for mempool ordering, Bullshark for BFT finality, and the EVM for execution—all modular, all optimized for performance and scalability.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.org/telcoin-network/overview" rel="noreferrer" target="_blank">
                Telcoin Network overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How do TELx and TAN plug into the chain?',
        answer: (
          <>
            <p>
              TELx smart contracts manage liquidity incentives while TAN APIs collect usage and compliance events. Together they inform Association policy and direct TEL rewards toward real activity.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.org/telcoin-network/telcoin-application-network" rel="noreferrer" target="_blank">
                TAN documentation
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'What happens when incidents occur?',
        answer: (
          <>
            <p>
              Telcoin's security newsroom publishes incident reports, maintenance windows, and remediation status so the community can track uptime and response steps.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/newsroom/security" rel="noreferrer" target="_blank">
                Security newsroom
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'deep-bank',
    title: 'Bank',
    faqs: [
      {
        question: 'How does the Telcoin Wallet deliver a fintech-grade UX while staying self-custodied?',
        answer: (
          <>
            <p>
              The wallet overview walks through device binding, recovery phrase coaching, and mobile-first guardrails that help non-crypto natives stay safe without surrendering keys.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/wallet" rel="noreferrer" target="_blank">
                Wallet overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'What backs Digital Cash assets like eUSD and eCAD?',
        answer: (
          <>
            <p>
              Digital Cash documentation lists each currency's custodians, reserve attestations, and redemption processes so holders can confirm collateralization and risk controls.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/digital-cash" rel="noreferrer" target="_blank">
                Digital Cash documentation
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How are remittance corridors activated and monitored?',
        answer: (
          <>
            <p>
              Remittance guides describe licensing requirements, reporting obligations, and how TAN events surface corridor status back to the Association.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/remittances" rel="noreferrer" target="_blank">
                Remittance overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does KYC work on mobile?',
        answer: (
          <>
            <p>
              Mobile-native verification with recovery flows helps anyone onboard without needing a desktop or seed phrase. The process is designed to be accessible and secure.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/wallet" rel="noreferrer" target="_blank">
                Wallet overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does corridor pricing show transparency?',
        answer: (
          <>
            <p>
              Corridor pricing shows fees, FX, and timing up front—aligned with TAN compliance tracking. This transparency helps users make informed decisions before sending.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/remittances" rel="noreferrer" target="_blank">
                Remittance overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How is security built into the wallet?',
        answer: (
          <>
            <p>
              Notifications, 2FA prompts, and alerts give users confidence without slowing them down. Security features are integrated seamlessly into the user experience.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/wallet" rel="noreferrer" target="_blank">
                Wallet overview
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'deep-tokenomics',
    title: 'Tokenomics',
    faqs: [
      {
        question: 'How do TEL burns and regen releases balance supply?',
        answer: (
          <>
            <p>
              TEL documentation shows that transaction fees burn TEL while treasury-controlled programs reintroduce supply only when usage or liquidity milestones are met, keeping growth tethered to real demand.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoinassociation.org/tel" rel="noreferrer" target="_blank">
                TEL overview
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'What is the purpose of TELx lifecycle stages?',
        answer: (
          <>
            <p>
              TELx documentation outlines Active, Deprecated, and Archived stages that guide liquidity providers toward the pairs that still need depth while tapering rewards on mature pools.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoinassociation.org/telx" rel="noreferrer" target="_blank">
                TELx documentation
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does TANIP support wallet adoption?',
        answer: (
          <>
            <p>
              TANIP directs TEL rewards toward referrals, usage streaks, and compliant integrations. Each cohort is staged and must report results before further TEL unlocks.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.org/telcoin-network/telcoin-application-network" rel="noreferrer" target="_blank">
                TAN documentation
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does TELx keep flows instant?',
        answer: (
          <>
            <p>
              TELx liquidity pools pair TEL with Digital Cash so users can swap, send, and settle without bottlenecks. The liquidity engine ensures instant availability for transactions.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoinassociation.org/telx" rel="noreferrer" target="_blank">
                TELx documentation
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'deep-faq',
    title: 'FAQ tiebacks',
    faqs: [
      {
        question: 'Where can I fact-check community talking points?',
        answer: (
          <>
            <p>
              The FAQ explorer links every answer to Telcoin documentation, governance releases, or official announcements so you can verify claims quickly.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation" rel="noreferrer" target="_blank">
                Telcoin documentation portal
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'What is the fastest way to share context with newcomers?',
        answer: (
          <>
            <p>
              Point them to the home storyline and Start Here checklist. These walk through the Problem → Model → Engine → Experience → FAQ flow before linking deeper.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation" rel="noreferrer" target="_blank">
                Telcoin documentation portal
              </a>
              .
            </p>
          </>
        ),
      },
      {
        question: 'How does the wiki stay aligned with official updates?',
        answer: (
          <>
            <p>
              Contributors monitor the Telcoin newsroom and Association feeds so content reflects the latest releases. Each section cites the primary source it is derived from.
            </p>
            <p>
              Source:{' '}
              <a href="https://telco.in/newsroom" rel="noreferrer" target="_blank">
                Telcoin newsroom
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
]

export function DeepDiveFaqSections() {
  return (
    <div className="deep-dive-grid">
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="deep-dive-section anchor-offset">
          <h2>{section.title}</h2>
          <div className="deep-dive-faqs" role="list">
            {section.faqs.map((faq) => (
              <article key={faq.question} className="deep-dive-faq" role="listitem">
                <h3>{faq.question}</h3>
                {faq.answer}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

