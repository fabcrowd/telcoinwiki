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
        <p>Telcoin combines three pillars: Telcoin Network (a modular L1 with instant finality), Digital Cash (regulated fiat-backed digital currency), and TELx (a user-owned liquidity layer). Together, they create a settlement environment where money moves globally with the efficiency of the internet. And because every transaction consumes TEL, the token’s utility grows with the system’s usage.</p>
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
        <p>This structure lets the network scale like the internet, not like monolithic chains that eventually choke under load. And because gas fees are paid in TEL, scalability directly feeds the token’s economic engine.</p>
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
        <p>For tokenholders, modularity strengthens TEL’s role as a settlement commodity for a network designed for massive, global usage.</p>
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
        <p>TEL’s value scales with throughput — not speculation.</p>
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
        <p>TELx is Telcoin’s decentralized liquidity engine, powered by Balancer and Uniswap v4 pools with TEL incentives. It ensures deep liquidity for TEL, Digital Cash, and supported assets across chains. TELx rewards liquidity providers with TEL, helping stabilize markets and improve wallet execution.</p>
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
        <p>TELx isn’t a gimmick — it’s the liquidity engine fueling broader ecosystem growth.</p>
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
        <p>Identity rails unlock high-value financial use cases, which in turn expand TEL’s utility footprint.</p>
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

  // 7. GETTING STARTED
  {
    question: 'How do I start using Telcoin?',
    answer: (
      <Fragment>
        <p>Start with the Telcoin app, downloaded from your device&apos;s official app store. You verify your identity once, which unlocks the ability to hold Digital Cash and move money, then you can send, hold, swap, and stake from the same place.</p>
        <p>Always install from the official store and check the publisher. Fake wallet apps are one of the most common ways people lose funds, and no amount of protocol security helps if the app itself is counterfeit.</p>
        <p>
          <Link to="/deep-dive#deep-wallet" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: The Telcoin Wallet
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Do I need to understand crypto to use Telcoin?',
    answer: (
      <Fragment>
        <p>No, and that is the entire design intent. The blockchain is meant to be invisible. You see balances, a send button, and an amount that will arrive — not gas fees, block confirmations, or hexadecimal addresses.</p>
        <p>Everything technical on this wiki describes what happens underneath. You do not need any of it to use the product, in the same way you do not need to understand BGP routing to send an email.</p>
        <p>
          <Link to="/deep-dive#deep-wallet" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: The Telcoin Wallet
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'What is the difference between TEL and Digital Cash?',
    answer: (
      <Fragment>
        <p>This is the single most common point of confusion, and the distinction is worth getting right.</p>
        <p><strong>TEL</strong> is the network&apos;s native token. Its price floats on the open market, and it exists to pay gas, secure the chain through staking, incentivize liquidity, and carry governance weight.</p>
        <p><strong>Digital Cash</strong> is regulated money — eUSD, eEUR, eJPY and others — issued by the bank entity and backed by reserves. One eUSD is intended to be worth one US dollar, always.</p>
        <p>Put simply: Digital Cash is what you spend and send. TEL is what makes the network run. If you want stability, you hold Digital Cash; TEL is a volatile asset.</p>
        <p>
          <Link to="/deep-dive#deep-tokenomics" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: TEL Tokenomics
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Which blockchains is TEL on?',
    answer: (
      <Fragment>
        <p>TEL launched as an ERC-20 token on Ethereum in 2017 and is also deployed on Polygon and Base, with bridges connecting them. A large share of everyday activity — staking and liquidity especially — has historically run on Polygon, because low transaction costs make small positions practical there.</p>
        <p>Telcoin Network is the purpose-built Layer 1 the ecosystem is oriented around. If you are moving TEL between chains, confirm the destination and the bridge through official channels first.</p>
        <p>
          <Link to="/deep-dive#deep-network" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Network and Technology
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 8. TOKENOMICS
  {
    question: "What is TEL's total supply?",
    answer: (
      <Fragment>
        <p>TEL has a fixed maximum supply of 100,000,000,000 — one hundred billion tokens. No new TEL is minted by the protocol, so staking rewards and liquidity incentives are funded from existing allocations rather than from inflation.</p>
        <p>The large number is just a denomination choice. A hundred billion tokens at a low unit price and a hundred million at a high one describe the same total network value, so market capitalization is the meaningful figure, never the price of one token.</p>
        <p>
          <Link to="/deep-dive#deep-tokenomics" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: TEL Tokenomics
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Why does TEL have only 2 decimal places?',
    answer: (
      <Fragment>
        <p>TEL uses 2 decimals rather than the 18 that most ERC-20 tokens use. For a currency-like asset this is intuitive — you get hundredths, just like cents.</p>
        <p>It does catch developers out constantly. A raw on-chain balance of <code>1000000</code> is 10,000.00 TEL. Divide raw contract values by 100, not by 10<sup>18</sup>, or your numbers will be wrong by sixteen orders of magnitude.</p>
        <p>
          <Link to="/deep-dive#deep-tokenomics" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: TEL Tokenomics
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How many people hold TEL?',
    answer: (
      <Fragment>
        <p>An independent community project, the Telcoin Proposal Tracker, publishes a reproducible on-chain census across Ethereum, Polygon, and Base. Its 16 August 2026 snapshot recorded roughly 99,700 holding addresses, of which about 74,000 were classified as retail once exchange, DEX, and treasury wallets were filtered out. Around 20.7 billion TEL sat in identified centralized-exchange wallets.</p>
        <p>Two caveats matter. Addresses are not people — one person may hold several, and a single exchange address can represent millions of customers. And these are community-derived figures using their own classification rules, not official Telcoin disclosures. They change daily.</p>
        <p>
          <Link to="/deep-dive#deep-tokenomics" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Where the Supply Sits
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 9. REMITTANCES AND PAYMENTS
  {
    question: 'What is a remittance corridor?',
    answer: (
      <Fragment>
        <p>A corridor is a directional country pair — Australia to the Philippines, the United States to Mexico. It is the unit that matters operationally, because each one needs its own licensing, banking relationships, payout partners, and compliance work.</p>
        <p>This is why money-transfer services expand one corridor at a time instead of launching everywhere at once, and why you should always check the app for what is actually live in your market rather than trusting a list on a community wiki.</p>
        <p>
          <Link to="/deep-dive#deep-remittances" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Remittances and Corridors
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Why are remittances so expensive?',
    answer: (
      <Fragment>
        <p>The cost has four parts, and usually only the first is advertised: the stated fee, the exchange-rate margin, deductions taken by intermediary banks in transit, and whatever the recipient pays to collect the money.</p>
        <p>The exchange-rate margin is the one to watch. A service promoting &quot;zero fees&quot; can still take several percent through the rate it quotes you. Pricing is also regressive — small transfers carry the highest effective cost, which falls hardest on the people sending the least.</p>
        <p>
          <Link to="/deep-dive#deep-remittances" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Where the Cost Actually Goes
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How does Telcoin make transfers cheaper?',
    answer: (
      <Fragment>
        <p>By removing the intermediaries and exposing the spread. Settling on a shared ledger means there is no chain of correspondent banks each taking a cut, and running currency conversion through transparent on-chain liquidity makes the exchange margin visible and contestable rather than set unilaterally.</p>
        <p>The honest caveat is the last mile. Getting value into a recipient&apos;s hands as spendable local money still requires local licences and payout partners in every market, which is the slow part of the work. Telcoin&apos;s telecom-first strategy exists precisely because carriers already operate that last mile.</p>
        <p>
          <Link to="/deep-dive#deep-remittances" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: The Last Mile
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 10. DIGITAL CASH DETAIL
  {
    question: 'Which currencies does Digital Cash support?',
    answer: (
      <Fragment>
        <p>Digital Cash is designed as a multi-currency family named with an <code>e</code> prefix plus the ISO code — eUSD, eEUR, eGBP, eJPY, eSGD, eMXN, eZAR and more.</p>
        <p>Multi-currency support matters more than it sounds. A remittance is a currency pair, not a single currency, so a dollar-only network forces every corridor through a dollar leg and charges you two conversions. The set designed for the system is broader than the set live to users at any given time, so check the app for current availability.</p>
        <p>
          <Link to="/deep-dive#deep-digital-cash" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Digital Cash
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Can I redeem Digital Cash for regular money?',
    answer: (
      <Fragment>
        <p>Yes — redeemability is the core promise of the instrument. You return Digital Cash to the issuer, the tokens are burned, and the corresponding fiat is released from reserve to your bank account or mobile-money wallet.</p>
        <p>Because minting and burning are the only ways units enter and leave circulation, on-chain supply should always correspond to reserves held. That correspondence is what makes the instrument auditable rather than a matter of trust.</p>
        <p>
          <Link to="/deep-dive#deep-digital-cash" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Mint, Redeem, and the Full Lifecycle
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Is Telcoin actually a bank?',
    answer: (
      <Fragment>
        <p>Yes. Telcoin Digital Asset Bank holds a Nebraska Digital Asset Depository Institution charter, finalized on 12 November 2025 — the first of its kind granted in the United States. It is authorized to issue eUSD, connect conventional US bank accounts to blockchain assets, and take deposits subject to further regulatory approval.</p>
        <p>Its role is narrow by design: hold fiat reserves (state law requires at least 100% liquid backing, with no FDIC insurance), run KYC and AML, and mint and redeem Digital Cash. It does not custody your crypto — the wallet is self-custodial — and it is a separate legal structure from the Association that governs the protocol. Operational rollout (which products are live, in which states) still moves faster than any wiki can track, so verify current scope against Telcoin&apos;s own announcements.</p>
        <p>
          <Link to="/deep-dive#deep-bank" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Telcoin Digital Asset Bank
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 11. SECURITY AND SAFETY
  {
    question: 'Does the Telcoin Wallet use a seed phrase?',
    answer: (
      <Fragment>
        <p>No. The wallet deliberately avoids the standard twelve-word recovery phrase, because it has a catastrophic failure mode for ordinary users: write it down and it can be stolen, lose it and the money is gone permanently with no recourse.</p>
        <p>Instead every wallet has three signing keys — one on your device, one held by Telcoin, one held by an independent trusted third party — and any two of the three authorize a transaction. Telcoin holds exactly one key, so it cannot move your funds alone; it needs a second key it does not control. Telcoin calls this &quot;assisted self-custody,&quot; and it&apos;s a real qualifier worth understanding: it is not the same guarantee as sole control of your own keys, but it trades that for a workable recovery story if you lose your phone.</p>
        <p>
          <Link to="/deep-dive#deep-wallet" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Assisted Self-Custody
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'How do I avoid scams?',
    answer: (
      <Fragment>
        <p>Most losses in this space are social engineering, not broken cryptography. A few rules cover almost every case:</p>
        <ul>
          <li>No legitimate party — support, admin, or moderator — ever needs your recovery credentials. Any such request is an attack.</li>
          <li>Anyone who messages you first is suspect. Impersonating support in community channels is the most common pattern there is.</li>
          <li>Type official addresses yourself rather than following links or search results, both of which get poisoned.</li>
          <li>Guaranteed returns are always fraud. &quot;Send tokens to receive more back&quot; is never real.</li>
          <li>Verify contract addresses through official channels before interacting with them.</li>
        </ul>
        <p>
          <Link to="/deep-dive#deep-security" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Security and Risks
          </Link>
        </p>
      </Fragment>
    ),
  },

  // 12. RISKS AND OPEN QUESTIONS
  {
    question: 'What are the main risks with Telcoin?',
    answer: (
      <Fragment>
        <p>Worth stating plainly rather than glossing over. <strong>Regulatory:</strong> being regulated cuts both ways — charter conditions can change and every new corridor needs its own approvals. <strong>Adoption:</strong> the telecom strategy depends on large, slow-moving organizations with multi-year procurement cycles. <strong>Concentration:</strong> a permissioned validator set is more concentrated than a permissionless one by construction. <strong>Technical:</strong> smart contracts can contain bugs despite audits, and cross-chain bridges have been among the most exploited components in the industry.</p>
        <p>There is also the plain observation that the project has been building since 2017. Infrastructure of this kind genuinely takes a long time, but the length of the roadmap deserves weighing alongside the strength of the thesis. None of this is financial advice.</p>
        <p>
          <Link to="/deep-dive#deep-security" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Risks and Open Questions
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Is Telcoin decentralized?',
    answer: (
      <Fragment>
        <p>Partially, and the honest answer is that it is a deliberate trade rather than a maximalist claim. Validator slots are intended for GSMA-member mobile operators rather than anonymous stakers, which makes the network permissioned at the consensus layer.</p>
        <p>What that buys is validators with legal identities, regulatory obligations, and a commercial reason to keep the chain running regardless of token price — properties a settlement network for regulated money arguably needs. What it costs is openness. Governance is distributed through elected councils, and the wallet is genuinely self-custodial, but nobody should describe the validator set as permissionless.</p>
        <p>
          <Link to="/deep-dive#deep-security" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Concentration and Technical Risk
          </Link>
        </p>
      </Fragment>
    ),
  },
  {
    question: 'Is this wiki official?',
    answer: (
      <Fragment>
        <p>No. Telcoin Wiki is a community-maintained resource. It is not published, reviewed, or endorsed by Telcoin, the Telcoin Association, or the Telcoin Digital Asset Bank, and it can be incomplete or out of date.</p>
        <p>Anything that would affect a real decision should be checked against a primary source: Telcoin&apos;s official documentation for product status, the Association&apos;s governance forums for proposals, the Nebraska Department of Banking and Finance for charter status, and block explorers for anything on-chain. Contract addresses especially should never be trusted from a wiki without confirming them officially.</p>
        <p>
          <Link to="/deep-dive#deep-glossary" className="text-telcoin-accent font-semibold inline-flex items-center gap-1">
            Learn More → Deep Dive: Glossary and Primary Sources
          </Link>
        </p>
      </Fragment>
    ),
  },
]

/**
 * Look up FAQ items by their exact question text.
 *
 * Groups used to reference `faqItems` by numeric index, which silently
 * re-pointed every later group whenever an item was inserted. Matching on the
 * question text keeps grouping stable when items move.
 *
 * An unmatched question is dropped rather than thrown, because this runs at
 * module scope: throwing here would blank the entire page over a typo. The
 * accompanying test (`data.test.ts`) asserts that nothing is ever actually
 * dropped, so mistakes fail the build instead of failing the visitor.
 */
export function pickFaqItems(questions: string[], catalogue: FAQItemData[] = faqItems): FAQItemData[] {
  const missing: string[] = []
  const found = questions.flatMap((question) => {
    const item = catalogue.find((candidate) => candidate.question === question)
    if (!item) {
      missing.push(question)
      return []
    }
    return [item]
  })

  if (missing.length) {
    console.error(`[faq] unknown question(s) referenced by a group: ${missing.join(' | ')}`)
  }

  return found
}

const pick = (...questions: string[]) => pickFaqItems(questions)

export const faqGroups: FAQGroup[] = [
  {
    title: 'Start Here',
    items: pick(
      'How do I start using Telcoin?',
      'Do I need to understand crypto to use Telcoin?',
      'What is the difference between TEL and Digital Cash?',
      'Which blockchains is TEL on?',
      'Is this wiki official?',
    ),
  },
  {
    title: 'About Telcoin',
    items: pick(
      'What is Telcoin?',
      'What problem is Telcoin trying to solve?',
      'Who is Telcoin for?',
      'What makes Telcoin different from crypto wallets and blockchain platforms?',
    ),
  },
  {
    title: 'Network and Technology',
    items: pick(
      'How is Telcoin Network architected?',
      'How does Telcoin reach consensus?',
      'What is Narwhal and why is it important?',
      'What is Bullshark and how does it work?',
      'What is instant finality?',
      'How does Telcoin handle smart contract execution?',
      "What is the benefit of Telcoin's modular structure?",
      'Why do telecom validators matter?',
      'How does Telcoin ensure data availability?',
      'How does Telcoin secure transactions?',
    ),
  },
  {
    title: 'Digital Cash and the Bank',
    items: pick(
      'What is Digital Cash?',
      'How is Digital Cash different from USDC or USDT?',
      'Which currencies does Digital Cash support?',
      'Can I redeem Digital Cash for regular money?',
      'What is the Telcoin Digital Asset Bank?',
      'Is Telcoin actually a bank?',
      'How do telecoms use Digital Cash?',
    ),
  },
  {
    title: 'Remittances and Payments',
    items: pick(
      'What is a remittance corridor?',
      'Why are remittances so expensive?',
      'How does Telcoin make transfers cheaper?',
    ),
  },
  {
    title: 'TEL Tokenomics',
    items: pick(
      "What is TEL's total supply?",
      'Why does TEL have only 2 decimal places?',
      'How many people hold TEL?',
      'How do TEL token economics work?',
      'How does TEL work as gas?',
    ),
  },
  {
    title: 'Incentives and Staking',
    items: pick(
      'How does user staking work?',
      'How does validator staking work?',
      'What is TELx?',
      'How do TELx emissions work?',
    ),
  },
  {
    title: 'Governance',
    items: pick(
      'How does Telcoin governance work?',
      'Who participates in Telcoin governance?',
    ),
  },
  {
    title: 'Security and Safety',
    items: pick(
      'Does the Telcoin Wallet use a seed phrase?',
      'How do I avoid scams?',
    ),
  },
  {
    title: 'Risks and Open Questions',
    items: pick(
      'What are the main risks with Telcoin?',
      'Is Telcoin decentralized?',
    ),
  },
  {
    title: 'Community and Access',
    items: pick(
      'How do users access Telcoin?',
      'How does Telcoin handle identity?',
    ),
  },
]
