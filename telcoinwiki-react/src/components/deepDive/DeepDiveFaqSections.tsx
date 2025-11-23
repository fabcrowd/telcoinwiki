import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

type DeepDiveSection = {
  id: string
  title: string
  content: ReactNode
}

interface ExpandableSectionProps {
  section: DeepDiveSection
  open: boolean
  onToggle: () => void
}

function ExpandableSection({ section, open, onToggle }: ExpandableSectionProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!contentRef.current) return
    setHeight(open ? contentRef.current.scrollHeight : 0)
  }, [open, section.content])

  return (
    <section id={section.id} className="deep-dive-section anchor-offset">
      <h2 className="deep-dive-section-header">
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="deep-dive-section-button"
        >
          <span>{section.title}</span>
          <svg
            className={`deep-dive-section-icon ${open ? 'open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      <div
        className="deep-dive-content-wrapper"
        style={{
          overflow: 'hidden',
          maxHeight: height,
          transition: 'max-height 300ms ease',
        }}
        ref={contentRef}
      >
        <div className="deep-dive-content">
          {section.content}
        </div>
      </div>
    </section>
  )
}

const SECTIONS: DeepDiveSection[] = [
  {
    id: 'deep-about',
    title: 'About Telcoin — Deep Dive',
    content: (
      <>
        <h3>What Telcoin Is Really Trying to Build</h3>
        <p>
          Telcoin's core ambition isn't to be another blockchain competing for DeFi liquidity. The vision is far bigger: Telcoin wants to become the financial layer of the mobile internet. It aims to plug directly into the systems that already serve billions of people — telecoms, mobile money, remittance networks, and emerging-market payments — and give them an instant-settlement foundation that works globally, compliantly, and without the friction that makes traditional finance slow.
        </p>
        <p>
          Most blockchains assume that adoption will come from users discovering "crypto." Telcoin assumes adoption will come from users who never even realize they're interacting with a blockchain. The chain becomes invisible infrastructure, just like TCP/IP under the modern web. What users see is Digital Cash — money that moves instantly, settles with certainty, and integrates into mobile-first workflows.
        </p>
        <p>
          This only works with a token that acts as the computation fuel of the system. TEL is that fuel. It is the unit of computation, coordination, and settlement across the entire economic surface area. As more users join, as telecoms integrate, and as developers build new financial flows on Telcoin Network, TEL becomes more deeply entrenched in the system's physiology.
        </p>

        <h3>The Problem Telcoin Solves</h3>
        <p>
          Financial rails worldwide are fragmented: national mobile-money systems don't interoperate, telecom clearing takes hours or days, remittances are slow and expensive, and stablecoins lack regulatory legitimacy outside crypto. Telcoin solves all of this by offering a settlement framework where:
        </p>
        <ul>
          <li>money is regulated at the banking layer,</li>
          <li>settlement is global and instant at the blockchain layer,</li>
          <li>distribution is handled by telecoms with billions of users,</li>
          <li>programmability is unlocked through an EVM-compatible environment.</li>
        </ul>
        <p>
          It is the first time regulated fiat, mobile identity, telecom rails, and a modular L1 are integrated into a single economic system — and the glue that holds this system together is TEL.
        </p>

        <h3>Who Telcoin Serves</h3>
        <p>
          The Telcoin ecosystem is designed for three overlapping groups:
        </p>
        <p>
          <strong>Consumers</strong> get a self-custodial wallet where they can send, store, and swap digital assets — including Digital Cash — with the speed of messaging.
        </p>
        <p>
          <strong>Telecoms</strong> get a settlement backend that removes clearing delays and modernizes mobile-money flows.
        </p>
        <p>
          <strong>Developers</strong> get an execution environment built for payments and financial apps, not gambling or speculation.
        </p>
        <p>
          Each group's participation increases throughput, and throughput increases TEL's utility.
        </p>
      </>
    ),
  },
  {
    id: 'deep-network',
    title: 'Network and Technology — Deep Dive',
    content: (
      <>
        <h3>Architectural Foundations: Why Telcoin Is Modular</h3>
        <p>
          Telcoin Network is built on a modular architecture because monolithic blockchains simply cannot support the throughput required for global mobile financial flows. In a monolithic design, consensus, execution, and data availability fight over the same computational pipeline. This leads to congestion, high fees, and unpredictable performance.
        </p>
        <p>
          Telcoin sidesteps this by separating responsibilities entirely. Consensus nodes handle ordering and finality. Execution layers independently process smart contract logic. Data availability ensures every block's data is globally visible and auditable. These layers communicate but never compete, allowing the network to scale like modern distributed systems rather than like yesterday's blockchains.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/network.svg" alt="Telcoin Network Architecture" className="deep-dive-icon" />
        </div>
        <p>
          This architecture mirrors real-world financial infrastructure: SWIFT for messaging, ACH for clearing, domestic banking systems for finality. Telcoin recreates this model as a programmable, decentralized system capable of scaling far beyond typical L1 ceilings. And because gas is paid in TEL, the economic value tied to network activity grows as the architecture supports more throughput.
        </p>

        <h3>Execution on Telcoin: EVM Without the Bottlenecks</h3>
        <p>
          Developers interact with Telcoin like they interact with Ethereum: Solidity, Foundry, Hardhat, and RPC endpoints behave exactly as expected. But Telcoin isolates execution from consensus, which means smart contracts never slow down block production. The chain can scale its execution capacity by adding more execution layers without touching the validator set.
        </p>
        <p>
          This creates an environment where developers always have predictable gas fees, predictable performance, and predictable finality. For TEL holders, execution growth means more gas usage and a higher baseline demand for the token.
        </p>

        <h3>Scalability Path</h3>
        <p>
          Because Telcoin is modular, scalability is limited only by how much execution the ecosystem demands. Consensus remains fast even if execution layers grow massively. Telecom validators can scale their infrastructure independently. Data availability expands as usage expands. Telcoin is designed to scale into billions of daily transactions — something no monolithic chain can claim.
        </p>
      </>
    ),
  },
  {
    id: 'deep-consensus',
    title: 'Consensus — Deep Dive',
    content: (
      <>
        <h3>Consensus: Narwhal and Bullshark</h3>
        <p>
          Narwhal and Bullshark are the beating heart of Telcoin Network. Narwhal handles transaction ingestion using a DAG (Directed Acyclic Graph) so validators can process and propagate data in parallel. Bullshark establishes deterministic consensus in a single round. Together, they produce instant, irreversible finality — a property that's essential for payments.
        </p>
        <p>
          In most blockchains, finality is probabilistic. You wait for six confirmations or more to be sure your transaction won't be reorganized. Bullshark eliminates this uncertainty. Once a block is signed, it is permanently finalized. There is no chance of rollback, no fork risk, no ambiguity.
        </p>
        <p>
          This reliability is the reason telecoms, remittance firms, and banks can consider building on Telcoin. It transforms TEL from a speculative token into a settlement commodity.
        </p>

        <h3>Why Narwhal Matters for Real Financial Workloads</h3>
        <p>
          Telecoms often settle millions of microtransactions: airtime, data bundles, mobile-money transfers, and roaming charges. Traditional blockchain mempools collapse under this kind of transactional concurrency. Narwhal's DAG structure allows Telcoin to ingest and broadcast transactions at telecom-grade throughput.
        </p>
        <p>
          When you remove mempool bottlenecks, you enable entire classes of high-frequency payment flows. And when those flows hit the settlement layer, TEL is burned as gas. Narwhal's parallelism directly supports the economic capacity of the token.
        </p>

        <h3>Why Bullshark Matters for Regulatory Institutions</h3>
        <p>
          Bullshark's deterministic finality satisfies requirements that banks and telecoms cannot compromise on. Transactions must be final, not probably final. Systems must be auditable. Settlements cannot roll back. These rules are non-negotiable in regulated environments.
        </p>
        <p>
          Bullshark gives Telcoin the certainty needed to replace clearinghouses that have existed for decades. TEL becomes the economic unit behind a system regulated entities can trust.
        </p>
      </>
    ),
  },
  {
    id: 'deep-digital-cash',
    title: 'Digital Cash — Deep Dive',
    content: (
      <>
        <h3>Digital Cash: Regulated Money Built for the Blockchain Era</h3>
        <p>
          Digital Cash is the first fiat-backed digital currency issued by a U.S. chartered digital asset bank designed for blockchain-native settlement. Unlike USDC or USDT, Digital Cash carries statutory obligations. It must be redeemable, fully reserved, and compliant with U.S. banking law.
        </p>
        <p>
          The Telcoin Digital Asset Bank mints and burns Digital Cash. Telcoin Network settles it. The separation of responsibilities creates a hybrid system where fiat currency gains the programmability of blockchain without sacrificing regulatory compliance.
        </p>
        <p>
          When Digital Cash moves across Telcoin Network, TEL is consumed as gas. The more Digital Cash becomes a preferred instrument for remittances, merchant payments, telecom settlement, and mobile-money interoperability, the more TEL becomes the universal settlement asset behind it.
        </p>
        <div className="deep-dive-currency-grid">
          <img src="/media/deep-dive/digital-cash/eAUD.svg" alt="eAUD - Australian Dollar Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eCAD.svg" alt="eCAD - Canadian Dollar Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eCHF.png" alt="eCHF - Swiss Franc Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eCZK.png" alt="eCZK - Czech Koruna Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eDKK.png" alt="eDKK - Danish Krone Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eEUR.png" alt="eEUR - Euro Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eGBP.svg" alt="eGBP - British Pound Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eHKD.svg" alt="eHKD - Hong Kong Dollar Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eHUF.png" alt="eHUF - Hungarian Forint Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eISK.png" alt="eISK - Icelandic Króna Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eJPY.svg" alt="eJPY - Japanese Yen Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eMXN.svg" alt="eMXN - Mexican Peso Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eNOK.png" alt="eNOK - Norwegian Krone Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eNZD.svg" alt="eNZD - New Zealand Dollar Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eSDR.svg" alt="eSDR - Special Drawing Rights Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eSEK.png" alt="eSEK - Swedish Krona Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eSGD.svg" alt="eSGD - Singapore Dollar Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eUSD.png" alt="eUSD - US Dollar Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eXOF.svg" alt="eXOF - West African CFA Franc Digital Cash" />
          <img src="/media/deep-dive/digital-cash/eZAR.svg" alt="eZAR - South African Rand Digital Cash" />
        </div>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/wallet-mockup-home-r.png" alt="Telcoin Wallet with Digital Cash" />
        </div>
      </>
    ),
  },
  {
    id: 'deep-products',
    title: 'Products and Compliance — Deep Dive',
    content: (
      <>
        <h3>Telcoin Digital Asset Bank: The Compliance Anchor</h3>
        <p>
          The Telcoin Digital Asset Bank acts as a regulated bridge between fiat and digital currency. It handles custody, KYC, AML, surveillance, and USD settlement. The blockchain never touches customer fiat — it only processes the digital representation of it.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/telcoin-bank-logo.svg" alt="Telcoin Digital Asset Bank Logo" className="deep-dive-icon" />
          <img src="/media/deep-dive/digital-cash/icon-crypto-bank.svg" alt="Crypto Bank Icon" className="deep-dive-icon" />
        </div>
        <p>
          This separation is what gives Telcoin the credibility to integrate with telecoms, merchants, and financial institutions. And because the bank is legally obligated to maintain reserves and redemption processes, Digital Cash becomes a legitimate monetary instrument, not a corporate IOU.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/vault.png" alt="Digital Cash Vault and Reserves" />
        </div>

        <h3>Telecom Integration</h3>
        <p>
          Telecoms operate one of the world's largest financial rails: mobile money. These networks move trillions annually. Yet cross-carrier settlement is slow and fragmented. Digital Cash gives telecoms a uniform settlement instrument and Telcoin gives them instant finality.
        </p>
        <p>
          Telecoms do not need TEL to operate mobile-money systems, but all of their Digital Cash settlement runs on Telcoin Network — and that consumes TEL. This is how enterprise adoption converts into direct token demand without forcing enterprises into speculative token holdings.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/gsma.svg" alt="GSMA Partnership" className="deep-dive-icon" />
          <img src="/media/deep-dive/digital-cash/icon-mnos.svg" alt="Mobile Network Operators" className="deep-dive-icon" />
        </div>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/inter-carrier-settlements.jpg" alt="Inter-Carrier Settlements" />
        </div>
      </>
    ),
  },
  {
    id: 'deep-incentives',
    title: 'Incentives and Staking — Deep Dive',
    content: (
      <>
        <h3>Token Economics: TEL as the Settlement Commodity</h3>
        <p>
          TEL functions as gas, governance, staking collateral, reward fuel, liquidity incentive, and validator alignment. Its utility is multi-dimensional and woven throughout the system. Because Telcoin is built for real financial flows rather than speculative activity, its economics hinge on transaction volume rather than inflationary reward structures.
        </p>
        <p>
          As remittances, mobile money, wallet swaps, and telecom settlements grow, the network processes more transactions. Each transaction requires TEL at the settlement layer. This gives TEL a utility profile closer to a commodity — a resource consumed in proportion to economic activity.
        </p>

        <h3>User Staking</h3>
        <p>
          Users stake TEL inside the Telcoin Wallet to unlock referral tiers and governance power. Staked TEL is removed from circulation, creating natural supply restriction. As more users adopt staking for rewards or participation, TEL becomes increasingly scarce relative to demand.
        </p>

        <h3>Validator Staking</h3>
        <p>
          Telecom validators stake TEL to secure the chain. This is not a yield-maximization exercise. It is an operational requirement tied to real financial activity. Telecoms that settle millions of dollars daily have a profound incentive to keep the network secure and stable. Staking TEL becomes part of their operational footprint, locking large quantities of the token out of circulation.
        </p>

        <h3>TELx: The Decentralized Liquidity Engine</h3>
        <p>
          TELx uses Uniswap v4 and Balancer under the hood but layers TEL incentives on top. This encourages deep liquidity in TEL, Digital Cash, and other assets in the Telcoin Wallet. Deep liquidity improves execution quality, which improves user experience, which increases wallet activity, which increases transaction throughput — and throughput consumes TEL.
        </p>
        <p>
          TELx is the economic flywheel that stabilizes TEL markets and powers trading throughout the ecosystem.
        </p>
        <div className="deep-dive-telx-logos">
          <div className="deep-dive-logo-group deep-dive-logo-group--prominent">
            <h4>TELx Platform</h4>
            <div className="deep-dive-logo-grid deep-dive-logo-grid--prominent">
              <img src="/media/deep-dive/digital-cash/TELx.svg" alt="TELx" className="deep-dive-icon deep-dive-icon--large" />
            </div>
          </div>
          <div className="deep-dive-logo-group">
            <h4>DEX Partners</h4>
            <div className="deep-dive-logo-grid">
              <img src="/media/deep-dive/telx/uniswap-uni-logo.png" alt="Uniswap" />
              <img src="/media/deep-dive/telx/balancer-bal-logo.png" alt="Balancer" />
            </div>
          </div>
          <div className="deep-dive-logo-group">
            <h4>Supported Chains</h4>
            <div className="deep-dive-logo-grid">
              <img src="/media/deep-dive/telx/polygon-logo.png" alt="Polygon" />
              <img src="/media/deep-dive/telx/base-logo.png" alt="Base" />
              <img src="/media/deep-dive/telx/eth.png" alt="Ethereum" />
            </div>
          </div>
          <div className="deep-dive-logo-group">
            <h4>Supported Assets</h4>
            <div className="deep-dive-logo-grid">
              <img src="/media/deep-dive/digital-cash/TEL.svg" alt="TEL Token" className="deep-dive-icon" />
              <img src="/media/deep-dive/telx/usdc.svg" alt="USDC" className="deep-dive-icon" />
              <img src="/media/deep-dive/telx/wbtc.png" alt="WBTC" />
              <img src="/media/deep-dive/telx/weth.png" alt="WETH" />
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'deep-governance',
    title: 'Governance — Deep Dive',
    content: (
      <>
        <h3>How Governance Shapes the Network</h3>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/ta.svg" alt="Telcoin Association" className="deep-dive-icon" />
          <img src="/media/deep-dive/digital-cash/TAN.svg" alt="Telcoin Association Network" className="deep-dive-icon" />
        </div>
        <p>
          The Telcoin Association governs emissions, network decisions, ecosystem funding, and protocol direction. TEL stakers elect councils, submit proposals, and shape the trajectory of the financial network. Governance is not a symbolic add-on — it directly impacts how TELx emissions flow, how incentives evolve, and how the network grows.
        </p>
        <p>
          As more ecosystem participants emerge — telecoms, integrators, liquidity providers, developers — governance influence becomes valuable. Demand for influence becomes demand for TEL.
        </p>
      </>
    ),
  },
  {
    id: 'deep-community',
    title: 'Community and Access — Deep Dive',
    content: (
      <>
        <h3>The Telcoin Wallet: Self-Custody for the Real World</h3>
        <p>
          The Telcoin Wallet uses a multi-key structure instead of seed phrases. Keys are stored across devices, making it far harder for a user to lose access or be compromised. This makes self-custody viable for mainstream audiences who will never adopt seed-phrase security.
        </p>
        <p>
          The wallet abstracts blockchain complexity entirely. Users simply see Digital Cash, crypto assets, swaps, and earnings. Behind the scenes, TEL powers settlement.
        </p>

        <h3>Identity and GSMA Integration</h3>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/icon-blockchain.svg" alt="Blockchain Identity" className="deep-dive-icon" />
        </div>
        <p>
          Telecoms already handle KYC and SIM registration for billions of users. Telcoin leverages this infrastructure to enable optional identity on-chain. This is essential for compliance-heavy applications like remittances, merchant payments, and regulated money transfers.
        </p>
        <p>
          Identity rails unlock institutional participation — which drives high-value settlement and steady TEL usage.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/support-center.png" alt="Wallet Support and Help Center" />
        </div>

        <h3>Where Telcoin Fits in the Landscape</h3>
        <p>
          Most blockchains aim at DeFi or gaming. Telcoin aims at payments, telecom settlement, and regulated digital money. Its architecture, partnerships, compliance posture, and throughput model place it in a category of its own: a global settlement network for mobile-first economies.
        </p>
        <p>
          TEL becomes the resource consumed by this system — the economic token that scales as global usage scales.
        </p>
      </>
    ),
  },
]

export function DeepDiveFaqSections() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="deep-dive-grid">
      {SECTIONS.map((section) => (
        <ExpandableSection
          key={section.id}
          section={section}
          open={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  )
}
