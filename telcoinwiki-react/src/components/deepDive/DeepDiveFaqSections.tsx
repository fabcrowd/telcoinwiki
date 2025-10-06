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
    id: 'deep-network',
    title: 'Telcoin Network',
    faqs: [
      {
        question: 'What is the Telcoin Network and why is it important?',
        answer:
          'EVM-compatible L1 using Narwhal (DAG mempool) + Bullshark (BFT) for fast, secure ordering; enables low-cost stablecoin transfers and invites telecom validators.',
      },
      {
        question: 'When will the Telcoin Network launch?',
        answer:
          'Core services are live; fuller rollout tracks MNO integrations and regulatory steps.',
      },
      {
        question: 'Which MNOs are partnering?',
        answer:
          'GSMA member MNOs across regions; names are announced when live. Historic: GCash (PH), Telkom (ZA).',
      },
      {
        question: 'How many MNOs will join?',
        answer:
          'Dozens to potentially hundreds over time, reaching billions of mobile users.',
      },
      {
        question: 'Impact of MNO partnerships?',
        answer:
          'Immediate distribution, trust, and compliance leverage; phone-number money transfers at scale.',
      },
    ],
  },
  {
    id: 'deep-token',
    title: '$TEL Token',
    faqs: [
      {
        question: 'What is $TEL used for?',
        answer:
          '$TEL is gas/utility, collateral in TELx modules, staking/liquidity, and future governance; used for P2P, swaps, payments.',
      },
      {
        question: 'How to buy Telcoin ($TEL)?',
        answer:
          'Listed on CEXs (KuCoin, Gate.io) and DEXs (Uniswap). Confirm network (Polygon vs ERC-20).',
      },
      {
        question: 'How to swap TEL between networks?',
        answer:
          'Use the app bridge or trusted Telcoin-listed bridges—never send directly cross-chain.',
      },
      {
        question: 'What can I do with my $TEL?',
        answer:
          'Stake in TELx, provide liquidity, pay gas, payments; governance participation is planned.',
      },
      {
        question: 'Price/volume/liquidity & predictions?',
        answer: 'Metrics vary with cycles/listings/usage; no price forecasts.',
      },
    ],
  },
  {
    id: 'deep-telx',
    title: 'TELx Liquidity Engine',
    faqs: [
      {
        question: 'Main use cases (incl. TELx)?',
        answer:
          'Remittances, mobile payments, DeFi services, and stablecoin infra; TELx coordinates on-chain liquidity & incentives.',
      },
      {
        question: 'What makes Telcoin unique?',
        answer: 'Telecom distribution, DADI bank charter, performant L1, and mobile-first UX.',
      },
      {
        question: 'Recent highlights',
        answer:
          'DADI charter approval, network deployment, eUSD launch, growing MNO onboarding.',
      },
    ],
  },
  {
    id: 'deep-governance',
    title: 'Association & Governance',
    faqs: [
      {
        question: 'Laws/legislation Telcoin contributed to?',
        answer:
          'Helped shape Nebraska’s NFIA, enabling the DADI framework for compliant digital-asset banking.',
      },
      {
        question: 'Compliance & expansion (MiCA, data)?',
        answer:
          'MiCA status TBD; focus on US/Asia first. Adheres to AML/KYC and lawful requests per jurisdiction.',
      },
      {
        question: 'Key partnerships',
        answer:
          'Beyond MNOs: GSMA and ecosystem integrations (e.g., The Game Company); more fintech/infra partners developing.',
      },
    ],
  },
  {
    id: 'deep-holdings',
    title: 'Telcoin Holdings',
    faqs: [
      {
        question: 'When will the Telcoin Bank launch?',
        answer:
          'Regulatory approval in place; launch timing depends on systems, partner onboarding, and disclosures.',
      },
      {
        question: 'What is the Telcoin Bank / offerings?',
        answer:
          'Regulated, blockchain-native bank under DADI; issuer of eUSD; programmable custody/payment rails; compliant on-chain services.',
      },
      {
        question: 'What is eUSD?',
        answer:
          'Fully reserved, USD-backed stablecoin (reserves at FDIC-insured banks) functioning as digital cash.',
      },
      {
        question: 'Revenue & timing',
        answer:
          'eUSD spread, transaction & network fees, custody, integrations, and TELx-driven liquidity; ramps with adoption.',
      },
      {
        question: 'Do I need an account in Nebraska?',
        answer: 'No—digital-first access where permitted via the Telcoin app.',
      },
    ],
  },
]

export function DeepDiveFaqSections() {
  return (
    <>
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="dd-section">
          <h2>{section.title}</h2>
          <div className="dd-accordion">
            {section.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="dd-body">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
