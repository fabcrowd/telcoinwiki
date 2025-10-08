import type { ReactNode } from 'react'

type FaqItem = {
  question: string
  answer: ReactNode
  learnMoreHref: string
  learnMoreLabel?: string
}

type DeepDiveSection = {
  id: string
  title: string
  faqs: FaqItem[]
}

const SECTIONS: DeepDiveSection[] = [
  {
    id: 'deep-broken-money',
    title: 'Broken Money',
    faqs: [
      {
        question: 'Why does Telcoin describe legacy rails as “broken money”?',
        answer: (
          <>
            <p>
              Telcoin’s platform documentation lays out how international transfers depend on nested correspondent banks and
              cash-out agents that add cost, delay, and risk for the people who need remittances the most. The Broken Money pillar
              starts by highlighting those frictions so readers understand the problems Telcoin is targeting before learning about
              solutions.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/telcoin-platform" rel="noreferrer" target="_blank">
                Telcoin Platform overview
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/problem#problem-fees',
        learnMoreLabel: 'Learn more about Broken Money →',
      },
      {
        question: 'How does Telcoin’s digital cash avoid the volatility critics worry about?',
        answer: (
          <>
            <p>
              Telcoin details that e-money such as eUSD is fully backed by reserves held at regulated financial institutions and
              issued under the Telcoin Platform framework. Stable value is a prerequisite for replacing remittances with digital
              cash, so collateral and audits are central to the Broken Money storyline.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/telcoin-platform" rel="noreferrer" target="_blank">
                Telcoin Platform overview
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/problem#problem-stability',
      },
      {
        question: 'Why bring telecom operators into financial services?',
        answer: (
          <>
            <p>
              Telcoin emphasizes that mobile network operators already meet strict GSMA and regulatory standards, giving them a
              trusted footprint in markets where bank access is limited. By aligning with telecom partners, Telcoin can plug
              remittances into phone-number based distribution without recreating traditional intermediaries.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/participation" rel="noreferrer" target="_blank">
                Telcoin participation guide
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/problem#problem-access',
      },
    ],
  },
  {
    id: 'deep-telcoin-model',
    title: 'Telcoin Model',
    faqs: [
      {
        question: 'Who is responsible for what across the Telcoin ecosystem?',
        answer: (
          <>
            <p>
              The Association governs the Telcoin Network and policy, Telcoin Holdings delivers compliant financial products, and
              the community contributes education and liquidity. Telcoin’s official Association documentation maps how these roles
              align so incentives stay balanced as adoption grows.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/association" rel="noreferrer" target="_blank">
                Telcoin Association overview
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/model#model-structure',
        learnMoreLabel: 'Learn more about the Telcoin Model →',
      },
      {
        question: 'Why is the TEL token essential instead of optional?',
        answer: (
          <>
            <p>
              TEL powers gas fees, validator staking, and TELx liquidity rewards across the Telcoin Network. Official token
              resources explain how issuance, burns, and rewards are calibrated to keep operators, liquidity providers, and users
              aligned with the network’s long-term health.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.network/telcoin-network/architecture/native-token" rel="noreferrer" target="_blank">
                TEL native token guide
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/model#model-incentives',
      },
      {
        question: 'How does governance prevent unilateral control?',
        answer: (
          <>
            <p>
              Governance materials show that Association councils, validator requirements, and policy committees share
              responsibility for major decisions. This checks-and-balances model is designed to maintain compliance and community
              accountability as new services come online.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/association-governance" rel="noreferrer" target="_blank">
                Association governance framework
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/model#model-guardrails',
      },
    ],
  },
  {
    id: 'deep-engine',
    title: 'Engine',
    faqs: [
      {
        question: 'What gives the Telcoin Network its throughput edge?',
        answer: (
          <>
            <p>
              Telcoin’s network documentation describes a Narwhal and Bullshark-based consensus design that separates transaction
              propagation from ordering for low-latency finality. This architecture is the backbone of the Engine pillar because it
              underpins the real-time settlement users expect.
            </p>
            <p>
              Source:{' '}
              <a
                href="https://docs.telcoin.network/telcoin-network/architecture/consensus-layer"
                rel="noreferrer"
                target="_blank"
              >
                Consensus layer reference
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/engine#engine-network',
        learnMoreLabel: 'Learn more about the Engine →',
      },
      {
        question: 'How are validators chosen and kept accountable?',
        answer: (
          <>
            <p>
              Participation guides explain that validators must meet telecom-grade compliance, security audits, and uptime
              metrics. Those guardrails pair with staking requirements so only qualified operators help secure the Engine.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/participation" rel="noreferrer" target="_blank">
                Participation requirements
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/engine#engine-ramps',
      },
      {
        question: 'Where does TELx fit inside the Engine story?',
        answer: (
          <>
            <p>
              TELx documentation shows how liquidity programs connect wallet swaps, remittance corridors, and partner ramps. The
              Engine pillar references TELx because balanced pools keep prices stable while users move value across the network.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telx.network/about/welcome-to-telx" rel="noreferrer" target="_blank">
                Welcome to TELx
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/engine#engine-liquidity',
      },
    ],
  },
  {
    id: 'deep-experience',
    title: 'Experience',
    faqs: [
      {
        question: 'What should newcomers expect during Telcoin Wallet onboarding?',
        answer: (
          <>
            <p>
              Telcoin’s application documentation walks through identity verification, device approval, and recovery controls so
              mobile-first users can get started quickly without sacrificing compliance. Setting expectations upfront reduces
              friction when inviting friends and family into the ecosystem.
            </p>
            <p>
              Source:{' '}
              <a
                href="https://www.telcoin.org/documentation/telcoin-platform/telcoin-application-network"
                rel="noreferrer"
                target="_blank"
              >
                Telcoin application network guide
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/experience#experience-onboarding',
        learnMoreLabel: 'Learn more about the Experience →',
      },
      {
        question: 'How transparent are remittance quotes and settlement?',
        answer: (
          <>
            <p>
              Telcoin details that wallet remittances provide upfront FX rates, final settlement times, and corridor availability
              powered by the Telcoin Network. Sharing these disclosures addresses concerns about hidden fees common in traditional
              money transfer services.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/telcoin-platform" rel="noreferrer" target="_blank">
                Telcoin Platform overview
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/experience#experience-transfers',
      },
      {
        question: 'What safeguards help protect Telcoin accounts?',
        answer: (
          <>
            <p>
              Participation resources outline security practices such as multi-factor recovery, device management, and fraud
              monitoring that are built into the Telcoin Wallet. These measures demonstrate how Telcoin balances usability with
              responsible controls.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation/participation" rel="noreferrer" target="_blank">
                Participation requirements
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/experience#experience-security',
      },
    ],
  },
  {
    id: 'deep-learn-more',
    title: 'Learn More',
    faqs: [
      {
        question: 'Where can I follow network and developer updates?',
        answer: (
          <>
            <p>
              The Telcoin Network documentation hub publishes release notes, architecture updates, and builder guides for people
              creating on the stack. Bookmarking it keeps you ahead of protocol changes mentioned throughout the Deep Dive.
            </p>
            <p>
              Source:{' '}
              <a href="https://docs.telcoin.network/telcoin-network/getting-started" rel="noreferrer" target="_blank">
                Telcoin Network getting started
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/learn#learn-deep-dive-pathways',
        learnMoreLabel: 'Learn more with Deep Dive pathways →',
      },
      {
        question: 'How do I monitor TELx rewards and pool performance?',
        answer: (
          <>
            <p>
              TELx maintains public dashboards covering liquidity programs, pool APRs, and historical rewards so contributors can
              track the incentives mentioned in the Engine pillar. Reviewing those numbers helps evaluate whether a strategy fits
              your risk tolerance.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telx.network/rewards" rel="noreferrer" target="_blank">
                TELx rewards hub
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/pools#pools-table',
      },
      {
        question: 'Where should I go for policy and compliance references?',
        answer: (
          <>
            <p>
              Telcoin curates legal resources, association policies, and transparency reports so stakeholders can verify the
              guardrails supporting the ecosystem. Keeping those links handy makes it easier to address objections about
              regulation and oversight.
            </p>
            <p>
              Source:{' '}
              <a href="https://www.telcoin.org/documentation" rel="noreferrer" target="_blank">
                Telcoin documentation index
              </a>
              .
            </p>
          </>
        ),
        learnMoreHref: '/links#links-governance',
      },
    ],
  },
]

export function DeepDiveFaqSections() {
  return (
    <>
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="dd-section anchor-offset">
          <h2 className="dd-heading">{section.title}</h2>
          <div className="dd-accordion">
            {section.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="dd-body">
                  {faq.answer}
                  <p className="dd-learn-more">
                    <a href={faq.learnMoreHref}>{faq.learnMoreLabel ?? 'Learn more →'}</a>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
