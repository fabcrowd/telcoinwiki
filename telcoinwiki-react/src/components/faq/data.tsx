import type { FAQItemData, FAQGroup } from './FAQ'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const faqItems: FAQItemData[] = [
  // 1. ABOUT TELCOIN
  {
    question: 'What is Telcoin?',
    answer: (
      <Fragment>
        <p>Telcoin is a mobile-first financial network built to bring modern money movement to billions of people through telecom infrastructure. Rather than asking the world to learn crypto, Telcoin upgrades the financial systems people already rely on — mobile money, remittances, telecom billing, and everyday payments — by settling them on a fast, modular L1 blockchain designed to clear value instantly.</p>
        <p>Telcoin combines three pillars: Telcoin Network (a modular L1 with instant finality), Digital Cash (regulated fiat-backed digital currency), and TELx (a user-owned liquidity layer). Together, they create a settlement environment where money moves globally with the efficiency of the internet. And because every transaction consumes TEL, the token's utility grows with the system's usage.</p>
        <p>
          <Link to="/deep-dive#deep-about" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: About Telcoin
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What problem is Telcoin trying to solve?',
    answer: (
      <Fragment>
        <p>Global payments are slow, fragmented, and expensive. Mobile money systems rarely interoperate across borders. Telecoms move value slowly through outdated clearinghouses. Remittances cost a fortune. Stablecoins lack regulatory grounding. Telcoin solves this by creating a regulated, telecom-integrated settlement layer that finalizes transactions instantly, works globally, and remains open to developers.</p>
        <p>By anchoring this system to TEL — the gas and staking asset — Telcoin creates a financial network where user growth and transaction volume naturally drive demand for the token.</p>
        <p>
          <Link to="/deep-dive#deep-about" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: The Telcoin Problem Set
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Who is Telcoin for?',
    answer: (
      <Fragment>
        <p>Telcoin is designed for three major audiences:</p>
        <ul>
          <li><strong>Consumers</strong>, who need a simple, affordable way to store, send, and swap money on their phones.</li>
          <li><strong>Telecoms and financial institutions</strong>, who need a modern settlement layer that is global, compliant, and programmable.</li>
          <li><strong>Developers</strong>, who want to build mobile-first financial applications without wrestling with traditional banking infrastructure.</li>
        </ul>
        <p>All three groups ultimately interact with a network secured and powered by TEL.</p>
        <p>
          <Link to="/deep-dive#deep-about" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Users of Telcoin
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 2. NETWORK AND TECHNOLOGY
  {
    question: 'How is Telcoin Network architected?',
    answer: (
      <Fragment>
        <p>Telcoin Network is modular — consensus, execution, and data availability are separate, specialized components. This architecture mirrors real financial infrastructure, where clearing, settlement, and messaging systems operate independently. Telcoin takes this approach into the blockchain era. Consensus finalizes transactions with deterministic speed. Execution layers handle smart contract logic without slowing validators. Data availability ensures that every block is fully verifiable.</p>
        <p>This structure lets the network scale like the internet, not like monolithic chains that eventually choke under load. And because gas fees are paid in TEL, scalability directly feeds the token's economic engine.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Architecture
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does Telcoin reach consensus?',
    answer: (
      <Fragment>
        <p>Consensus is achieved with Narwhal and Bullshark — a modern, high-performance BFT system. Narwhal organizes transactions using a DAG so validators see all data upfront. Bullshark finalizes blocks in a single deterministic round. Once signatures are collected, finality is absolute.</p>
        <p>For telecoms and financial apps, this reliability is essential. For tokenholders, it means the network can support high-volume, high-frequency usage that generates real ongoing demand for TEL.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Consensus
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is Narwhal and why is it important?',
    answer: (
      <Fragment>
        <p>Narwhal removes bottlenecks in the mempool by processing transactions in parallel rather than queuing them linearly. This is critical for a settlement chain expected to handle millions of micro-transactions: mobile money payouts, merchant payments, remittances, and telecom-scale bursts of activity.</p>
        <p>Narwhal helps Telcoin remain performant during extreme load — the kind that drives steady gas usage in TEL.</p>
        <p>
          <Link to="/deep-dive#deep-consensus" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Narwhal
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is Bullshark and how does it work?',
    answer: (
      <Fragment>
        <p>Bullshark is a deterministic BFT consensus protocol. Validators finalize the next block in a single round, preventing forks and eliminating probabilistic settlement. This is closer to how clearing systems work than any traditional blockchain.</p>
        <p>Instant, irreversible finality makes Telcoin suitable for regulated financial flows — and every finalized block consumes TEL.</p>
        <p>
          <Link to="/deep-dive#deep-consensus" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Bullshark
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is instant finality?',
    answer: (
      <Fragment>
        <p>Instant finality means that as soon as a transaction is included in a block, it is fully and irreversibly settled. No waiting for confirmations. No reorgs. No risk.</p>
        <p>This is crucial for payments, mobile money, and telecom settlement. It also makes transaction-heavy applications realistic, which in turn increases demand for TEL as gas.</p>
        <p>
          <Link to="/deep-dive#deep-consensus" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Finality
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does Telcoin handle smart contract execution?',
    answer: (
      <Fragment>
        <p>Execution happens on EVM-compatible layers that operate independently of consensus. Developers use standard Ethereum tooling to deploy apps, but benefit from better scalability and predictable fees. Execution is isolated from consensus operations, allowing Telcoin to expand its compute capacity horizontally as the ecosystem grows.</p>
        <p>Every contract execution uses TEL, making developer growth directly tied to TEL utility.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Execution
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is the benefit of Telcoin\'s modular structure?',
    answer: (
      <Fragment>
        <p>Modularity allows Telcoin to scale with demand. Consensus remains lightweight. Execution expands as needed. Data availability grows with usage. This mirrors the evolution of the mobile internet, where modularity enabled billions of users to come online.</p>
        <p>For tokenholders, modularity strengthens TEL's role as a settlement commodity for a network designed for massive, global usage.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Modularity
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Why do telecom validators matter?',
    answer: (
      <Fragment>
        <p>Telecoms already run high-availability, mission-critical infrastructure. When they validate Telcoin Network, the chain gains trusted operators with massive reach. Telecom validators bring distribution, reliability, regulatory credibility, and the ability to settle mobile money flows at scale.</p>
        <p>Validators stake TEL, meaning telecom participation directly converts into long-term token demand.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Validators
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does Telcoin ensure data availability?',
    answer: (
      <Fragment>
        <p>Validators confirm transaction data is globally available before finalizing a block. This prevents withheld-data attacks and ensures that state transitions are auditable and verifiable — requirements for any financial-grade system.</p>
        <p>High-integrity data availability supports more apps, more users, and more throughput — all contributing to TEL consumption.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Data Availability
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does Telcoin secure transactions?',
    answer: (
      <Fragment>
        <p>Security is built across multiple layers: BFT consensus, telecom-class infrastructure, audited smart contracts, and a mempool structure that minimizes censorship vectors. Combined with instant finality and multi-key wallet architecture, Telcoin is designed for real money.</p>
        <p>Real money means real usage — and real usage means more TEL powering the network.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Security
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 3. PRODUCTS AND COMPLIANCE
  {
    question: 'What is Digital Cash?',
    answer: (
      <Fragment>
        <p>Digital Cash is a fiat-backed digital currency issued by the Telcoin Digital Asset Bank, a fully regulated U.S. digital asset bank. It behaves like a stablecoin but is governed by banking law rather than corporate discretion. Digital Cash transfers settle instantly on Telcoin Network, enabling mobile-first financial flows with bank-grade assurance and blockchain-grade speed.</p>
        <p>Because Digital Cash settles on-chain, its usage directly drives TEL gas consumption.</p>
        <p>
          <Link to="/deep-dive#deep-products" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Digital Cash
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How is Digital Cash different from USDC or USDT?',
    answer: (
      <Fragment>
        <p>Corporate stablecoins rely on voluntary disclosures. Digital Cash relies on statutory obligations enforced by state banking regulators. This makes it suitable not just for crypto, but for telecom clearing, mobile money, merchant payments, and cross-border value movement.</p>
        <p>This unlocks regulated, high-frequency financial use cases — the type that generate steady TEL demand.</p>
        <p>
          <Link to="/deep-dive#deep-digital-cash" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Stablecoins vs Digital Cash
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is the Telcoin Digital Asset Bank?',
    answer: (
      <Fragment>
        <p>The bank manages fiat custody, minting and redemption of Digital Cash, KYC, and compliance. The blockchain handles settlement. This division allows Telcoin to offer a global settlement system while remaining aligned with U.S. regulatory requirements. The bank anchors the system in legitimacy; the blockchain anchors it in efficiency.</p>
        <p>When regulated money moves through the chain, TEL becomes the fuel that moves it.</p>
        <p>
          <Link to="/deep-dive#deep-digital-cash" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Digital Asset Bank
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How do telecoms use Digital Cash?',
    answer: (
      <Fragment>
        <p>Telecoms can settle mobile wallet balances, prepaid airtime, data bundles, merchant flows, and cross-carrier reconciliations using Digital Cash. These are massive, recurring financial events. On Telcoin Network, they settle instantly and with programmable transparency.</p>
        <p>These flows do not require telecoms to hold TEL — but every one of them consumes TEL as gas.</p>
        <p>
          <Link to="/deep-dive#deep-products" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Telecom Settlement
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 4. INCENTIVES AND STAKING
  {
    question: 'How do TEL token economics work?',
    answer: (
      <Fragment>
        <p>TEL is the native asset powering gas, staking, governance, liquidity incentives, and validator alignment. It is not inflationary by default and does not rely on hype-driven tokenomics. Instead, TEL strengthens as the network processes more real-world settlement and more applications launch on the chain.</p>
        <p>TEL's value scales with throughput — not speculation.</p>
        <p>
          <Link to="/deep-dive#deep-incentives" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Token Economics
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does TEL work as gas?',
    answer: (
      <Fragment>
        <p>TEL powers every computation on Telcoin Network. Transfers, swaps, contract calls, telecom-settlement transactions, everything. Gas is predictable and low because the network is optimized for volume, not scarcity pricing. As more users adopt Digital Cash or Telcoin Wallet, TEL becomes the universal computational asset behind their activity.</p>
        <p>
          <Link to="/deep-dive#deep-incentives" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Gas Model
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does user staking work?',
    answer: (
      <Fragment>
        <p>Users stake TEL inside the Telcoin Wallet to unlock referral rewards, earn higher tiers, and gain governance power. Staked TEL reduces circulating supply and anchors users into the ecosystem. As the referral system and missions expand, staking becomes a central engagement vector.</p>
        <p>
          <Link to="/deep-dive#deep-incentives" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: User Staking
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does validator staking work?',
    answer: (
      <Fragment>
        <p>Telecom or enterprise validators stake TEL to secure the network. Staking aligns them economically with uptime, finality, and system reliability. This is operational staking at scale, not emissions-based farming.</p>
        <p>Validator-level staking can eventually represent institutional-sized TEL lockups.</p>
        <p>
          <Link to="/deep-dive#deep-incentives" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Validator Staking
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is TELx?',
    answer: (
      <Fragment>
        <p>TELx is Telcoin's decentralized liquidity engine, powered by Balancer and Uniswap v4 pools with TEL incentives. It ensures deep liquidity for TEL, Digital Cash, and supported assets across chains. TELx rewards liquidity providers with TEL, helping stabilize markets and improve wallet execution.</p>
        <p>Liquidity depth → better swaps → more volume → more gas → more TEL demand.</p>
        <p>
          <Link to="/deep-dive#deep-incentives" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: TELx
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How do TELx emissions work?',
    answer: (
      <Fragment>
        <p>TELx distributes TEL to LPs proportional to their share of a pool. Rewards accumulate on-chain in real time. This builds deep, user-owned liquidity that supports swaps in the Telcoin Wallet and reduces slippage.</p>
        <p>TELx isn't a gimmick — it's the liquidity engine fueling broader ecosystem growth.</p>
        <p>
          <Link to="/deep-dive#deep-incentives" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Emissions
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 5. GOVERNANCE
  {
    question: 'How does Telcoin governance work?',
    answer: (
      <Fragment>
        <p>Governance is community-driven through the Telcoin Association. TEL stakers elect councils, approve proposals, allocate budgets, and direct emissions. Governance is not symbolic — it actively influences how the network evolves.</p>
        <p>TEL is both a utility token and a governance asset, and governance demand grows as the network expands.</p>
        <p>
          <Link to="/deep-dive#deep-governance" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Governance
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Who participates in Telcoin governance?',
    answer: (
      <Fragment>
        <p>Anyone staking TEL can participate. Over time, telecom validators, liquidity providers, Digital Cash integrators, and large ecosystem contributors will also need governance influence. This introduces institutional demand for TEL as voting weight.</p>
        <p>
          <Link to="/deep-dive#deep-governance" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Governance Structure
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 6. COMMUNITY AND ACCESS
  {
    question: 'How do users access Telcoin?',
    answer: (
      <Fragment>
        <p>Most users interact through the Telcoin Wallet — a self-custodial, multi-key app that enables sending, swapping, and earning. The wallet abstracts complexity while anchoring everything to the underlying blockchain.</p>
        <p>The simpler the wallet becomes, the more users transact — and every transaction uses TEL.</p>
        <p>
          <Link to="/deep-dive#deep-community" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Wallet
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does Telcoin handle identity?',
    answer: (
      <Fragment>
        <p>Telcoin incorporates GSMA-aligned identity features through telecom validators. SIM registration, mobile KYC, and telecom authentication give the network access to a compliance-ready identity base without forcing users into centralized ID systems.</p>
        <p>Identity rails unlock high-value financial use cases, which in turn expand TEL's utility footprint.</p>
        <p>
          <Link to="/deep-dive#deep-community" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Identity
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What makes Telcoin different from crypto wallets and blockchain platforms?',
    answer: (
      <Fragment>
        <p>Telcoin is building infrastructure for real-world money movement: telecoms, cross-border payments, regulated Digital Cash, and mobile-first applications. It solves distribution through telecoms, compliance through the bank, and performance through its modular L1.</p>
        <p>Most chains aim for speculative apps. Telcoin aims for global settlement — and TEL is the fuel.</p>
        <p>
          <Link to="/deep-dive#deep-community" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Telcoin vs L1s
          </Link>
        </p>
      </Fragment>
    ),
  },
]

export const faqGroups: FAQGroup[] = [
  {
    title: 'About Telcoin',
    items: [
      faqItems[0], // What is Telcoin?
      faqItems[1], // What problem is Telcoin trying to solve?
      faqItems[2], // Who is Telcoin for?
    ],
  },
  {
    title: 'Network and Technology',
    items: [
      faqItems[3], // How is Telcoin Network architected?
      faqItems[4], // How does Telcoin reach consensus?
      faqItems[5], // What is Narwhal and why is it important?
      faqItems[6], // What is Bullshark and how does it work?
      faqItems[7], // What is instant finality?
      faqItems[8], // How does Telcoin handle smart contract execution?
      faqItems[9], // What is the benefit of Telcoin's modular structure?
      faqItems[10], // Why do telecom validators matter?
      faqItems[11], // How does Telcoin ensure data availability?
      faqItems[12], // How does Telcoin secure transactions?
    ],
  },
  {
    title: 'Products and Compliance',
    items: [
      faqItems[13], // What is Digital Cash?
      faqItems[14], // How is Digital Cash different from USDC or USDT?
      faqItems[15], // What is the Telcoin Digital Asset Bank?
      faqItems[16], // How do telecoms use Digital Cash?
    ],
  },
  {
    title: 'Incentives and Staking',
    items: [
      faqItems[17], // How do TEL token economics work?
      faqItems[18], // How does TEL work as gas?
      faqItems[19], // How does user staking work?
      faqItems[20], // How does validator staking work?
      faqItems[21], // What is TELx?
      faqItems[22], // How do TELx emissions work?
    ],
  },
  {
    title: 'Governance',
    items: [
      faqItems[23], // How does Telcoin governance work?
      faqItems[24], // Who participates in Telcoin governance?
    ],
  },
  {
    title: 'Community and Access',
    items: [
      faqItems[25], // How do users access Telcoin?
      faqItems[26], // How does Telcoin handle identity?
      faqItems[27], // What makes Telcoin different from crypto wallets and blockchain platforms?
    ],
  },
]
