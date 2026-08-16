import type { ReactNode } from 'react'

export type DeepDiveSection = {
  id: string
  title: string
  content: ReactNode
}

/**
 * Deep Dive content.
 *
 * Kept out of the component module so the array can be imported by the search
 * index generator (`tools/build-search-index.mjs`) and the anchor regression
 * test without tripping react-refresh's single-export rule.
 */
export const SECTIONS: DeepDiveSection[] = [
  {
    id: 'deep-about',
    title: 'About Telcoin — Deep Dive',
    content: (
      <>
        <h3>What Telcoin Is Really Trying to Build</h3>
        <p>
          Telcoin’s core ambition isn’t to be another blockchain competing for DeFi liquidity. The vision is far bigger: Telcoin wants to become the financial layer of the mobile internet. It aims to plug directly into the systems that already serve billions of people — telecoms, mobile money, remittance networks, and emerging-market payments — and give them an instant-settlement foundation that works globally, compliantly, and without the friction that makes traditional finance slow.
        </p>
        <p>
          Most blockchains assume that adoption will come from users discovering ”crypto.” Telcoin assumes adoption will come from users who never even realize they’re interacting with a blockchain. The chain becomes invisible infrastructure, just like TCP/IP under the modern web. What users see is Digital Cash — money that moves instantly, settles with certainty, and integrates into mobile-first workflows.
        </p>
        <p>
          This only works with a token that acts as the computation fuel of the system. TEL is that fuel. It is the unit of computation, coordination, and settlement across the entire economic surface area. As more users join, as telecoms integrate, and as developers build new financial flows on Telcoin Network, TEL becomes more deeply entrenched in the system’s physiology.
        </p>

        <h3>Origins and Founding Thesis</h3>
        <p>
          Telcoin was founded in 2017 by Paul Neuner and Claude Eguienta. Neuner’s background was in telecom fraud management, which is where the founding insight came from: mobile network operators already run enormous, tightly regulated financial operations, and they already have billing relationships and verified identity for a large share of the planet. What they lack is a fast, neutral settlement layer that works across borders and across carriers.
        </p>
        <p>
          The original TEL token launched as an ERC-20 on Ethereum in 2017. The project’s structure has evolved considerably since then — from a token plus wallet, to a governed association, a liquidity layer, a regulated bank entity, and finally a dedicated Layer 1 — but the founding thesis has been consistent: reach users through the carriers who already serve them, and make compliance a design input rather than an afterthought.
        </p>

        <h3>The Four Pillars</h3>
        <p>
          It helps to keep the moving parts distinct, because they are separate entities with separate roles:
        </p>
        <ul>
          <li><strong>Telcoin Network</strong> — the EVM-compatible Layer 1 where transactions settle.</li>
          <li><strong>Telcoin Association</strong> — the member-governed body that stewards the protocol, emissions, and network policy.</li>
          <li><strong>Telcoin Digital Asset Bank</strong> — the regulated entity that issues and redeems Digital Cash.</li>
          <li><strong>TELx</strong> — the liquidity layer that makes markets in TEL and Digital Cash.</li>
        </ul>
        <p>
          The Telcoin Wallet (the consumer app) sits on top of all four and hides them from the user.
        </p>

        <h3>The Problem Telcoin Solves</h3>
        <p>
          Financial rails worldwide are fragmented: national mobile-money systems don’t interoperate, telecom clearing takes hours or days, remittances are slow and expensive, and stablecoins lack regulatory legitimacy outside crypto. Telcoin solves all of this by offering a settlement framework where:
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
          Each group’s participation increases throughput, and throughput increases TEL’s utility.
        </p>
      </>
    ),
  },
  {
    id: 'deep-problem',
    title: 'The Problem: Broken Money — Deep Dive',
    content: (
      <>
        <h3>Why Moving Money Is Still Hard in a Connected World</h3>
        <p>
          You can send a photograph to the other side of the planet in under a second, for free. Sending fifty dollars to the same place can take three days and cost six of them. That gap is not a technology problem — the technology has existed for years. It is a structural problem, and it has three distinct causes that Telcoin addresses separately.
        </p>

        <h3>Cause One: Correspondent Banking</h3>
        <p>
          Cross-border payments still largely travel through correspondent banking, a chain of bilateral relationships between banks that each hold accounts with one another. A transfer from a small bank in one country to a small bank in another may hop through two or three intermediaries. Every hop adds a fee, a cut-off time, a compliance check, and a point of failure.
        </p>
        <p>
          Worse, the system requires pre-funded accounts. Banks must park capital in foreign currencies just to be able to settle, which ties up liquidity and pushes costs back onto the sender. Instant settlement on a shared ledger removes the need for that pre-funding entirely — both parties settle against the same record.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/cross-border-payments.jpg" alt="Cross-border payment flows" />
        </div>

        <h3>Cause Two: Mobile Money Islands</h3>
        <p>
          Mobile money has been genuinely transformative — services across Africa, South Asia, and Southeast Asia brought hundreds of millions of people into the financial system using nothing but a feature phone. But each deployment is effectively a closed loop. Value inside one carrier’s mobile-money system generally cannot move natively to another carrier’s, let alone across a border.
        </p>
        <p>
          The result is a map of financial islands. Users are served, but they are not connected. Telcoin’s proposition is that the islands do not need to be replaced — they need a shared settlement layer between them, and telecoms are the natural operators of that layer.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/mfs-2.jpg" alt="Mobile financial services" />
        </div>

        <h3>Cause Three: The Cost Falls on the People Least Able to Bear It</h3>
        <p>
          Remittance pricing is regressive. Fees are often a flat component plus a percentage, plus an exchange-rate margin that is rarely disclosed clearly. Small transfers — the kind sent by migrant workers supporting family — carry the highest effective cost. The United Nations has a Sustainable Development Goal target of reducing remittance costs to 3 percent; global averages have remained stubbornly above that for years.
        </p>
        <p>
          The exchange-rate spread deserves particular attention, because it is where much of the real cost hides. A service advertising ”zero fees” may still take several percent through the rate it quotes. Transparent, on-chain settlement makes that spread visible and competitive.
        </p>

        <h3>Why Crypto Hasn’t Fixed It Yet</h3>
        <p>
          Cryptocurrency solved the settlement problem and then created three new ones: volatility, custody, and compliance. A worker sending wages home cannot accept a 10 percent price swing in transit. A first-time user cannot be handed a seed phrase and told that losing it means losing everything. And a regulated business cannot accept funds from a system with no identity layer.
        </p>
        <p>
          Telcoin’s answer to each is structural rather than cosmetic: Digital Cash removes volatility by being fiat-denominated and redeemable, the wallet’s multi-key design removes the seed phrase, and telecom-anchored identity plus a chartered bank supply the compliance layer. Any payments network aimed at ordinary users has to solve all three at once — solving two is the same as solving none.
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
          Telcoin sidesteps this by separating responsibilities entirely. Consensus nodes handle ordering and finality. Execution layers independently process smart contract logic. Data availability ensures every block’s data is globally visible and auditable. These layers communicate but never compete, allowing the network to scale like modern distributed systems rather than like yesterday’s blockchains.
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

        <h3>Who Actually Runs the Validators</h3>
        <p>
          This is the design decision that most distinguishes Telcoin Network from other Layer 1s. Validator slots are intended for GSMA-member mobile network operators rather than anonymous stakers. The GSMA is the industry body representing mobile operators worldwide, and its members are precisely the organizations that already hold telecom licences, run national-scale infrastructure, and answer to financial regulators in the markets they serve.
        </p>
        <p>
          The tradeoff is explicit and worth stating plainly. A permissioned validator set is less open than a permissionless one. In exchange, the network gets validators with legal identities, regulatory obligations, existing security operations, and a commercial reason to keep the chain running that has nothing to do with token price. For a settlement network handling regulated money, that tradeoff is the point rather than a compromise.
        </p>

        <h3>Multi-Chain Presence Today</h3>
        <p>
          TEL did not begin on Telcoin Network, and the token still circulates across several chains. TEL originated as an ERC-20 on Ethereum and is also present on Polygon and Base, with bridges connecting the deployments. A meaningful share of everyday user activity — staking and liquidity in particular — has historically run on Polygon because of its low transaction costs.
        </p>
        <p>
          One quirk trips up almost everyone reading raw chain data for the first time: <strong>TEL uses 2 decimals</strong>, not the 18 that most ERC-20 tokens use. A raw balance of <code>100000</code> is 1,000.00 TEL, not a fraction of a token. Any script reading balances directly from a contract must divide by 100.
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
          Narwhal and Bullshark are the beating heart of Telcoin Network. Narwhal handles transaction ingestion using a DAG (Directed Acyclic Graph) so validators can process and propagate data in parallel. Bullshark establishes deterministic consensus in a single round. Together, they produce instant, irreversible finality — a property that’s essential for payments.
        </p>
        <p>
          In most blockchains, finality is probabilistic. You wait for six confirmations or more to be sure your transaction won’t be reorganized. Bullshark eliminates this uncertainty. Once a block is signed, it is permanently finalized. There is no chance of rollback, no fork risk, no ambiguity.
        </p>
        <p>
          This reliability is the reason telecoms, remittance firms, and banks can consider building on Telcoin. It transforms TEL from a speculative token into a settlement commodity.
        </p>

        <h3>The Key Idea: Separating Data Availability from Ordering</h3>
        <p>
          The insight behind Narwhal — which came out of academic distributed-systems research and was popularized by the Mysten Labs team — is that traditional BFT consensus protocols waste most of their capacity doing the wrong job. In a classic design, the leader proposes a block containing the actual transaction data, and that block must be broadcast to everyone. The leader’s bandwidth becomes the network’s ceiling.
        </p>
        <p>
          Narwhal splits these concerns. A mempool layer disseminates transaction data continuously and in parallel across all validators, building a DAG of certified batches. Every validator is contributing bandwidth all the time, not waiting for its turn to lead. By the time consensus runs, the data is already everywhere.
        </p>
        <p>
          Consensus then only has to agree on <em>ordering</em> — which is a tiny amount of metadata, not megabytes of transactions. This is why the approach scales: you have decoupled the expensive part (moving data) from the part that requires global agreement (deciding sequence).
        </p>

        <h3>Why Narwhal Matters for Real Financial Workloads</h3>
        <p>
          Telecoms often settle millions of microtransactions: airtime, data bundles, mobile-money transfers, and roaming charges. Traditional blockchain mempools collapse under this kind of transactional concurrency. Narwhal’s DAG structure allows Telcoin to ingest and broadcast transactions at telecom-grade throughput.
        </p>
        <p>
          When you remove mempool bottlenecks, you enable entire classes of high-frequency payment flows. And when those flows hit the settlement layer, TEL is burned as gas. Narwhal’s parallelism directly supports the economic capacity of the token.
        </p>

        <h3>Bullshark: Ordering a DAG Without Extra Messages</h3>
        <p>
          Bullshark is the consensus protocol that runs on top of Narwhal’s DAG. Its elegance is that it requires <em>zero additional communication</em>. Because every validator already holds the same DAG structure, each one can independently apply the same deterministic rules to walk that DAG and derive the same total ordering of transactions. Agreement emerges from shared data plus shared rules, not from another round of voting.
        </p>
        <p>
          Bullshark tolerates Byzantine faults up to the standard BFT threshold — the network stays correct and live as long as fewer than one third of validators by stake are faulty or malicious. Under good network conditions it commits with very low latency; under adverse conditions it falls back to a slower but still safe path. Safety is never traded away for speed.
        </p>

        <h3>Why Bullshark Matters for Regulatory Institutions</h3>
        <p>
          Bullshark’s deterministic finality satisfies requirements that banks and telecoms cannot compromise on. Transactions must be final, not probably final. Systems must be auditable. Settlements cannot roll back. These rules are non-negotiable in regulated environments.
        </p>
        <p>
          It is difficult to overstate how much this matters operationally. A bank that accepts a probabilistically final payment has to carry reversal risk on its balance sheet and build reconciliation processes to handle rollbacks. Deterministic finality removes that entire category of work. The payment either happened or it did not, and the answer never changes afterwards.
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
          Digital Cash is Telcoin’s family of fiat-backed digital currencies, issued through its regulated bank entity and designed for blockchain-native settlement. The design intent is that each unit is fully reserved and redeemable on demand, with the issuing entity carrying statutory obligations rather than only contractual ones.
        </p>
        <p>
          The Telcoin Digital Asset Bank mints and burns Digital Cash. Telcoin Network settles it. The separation of responsibilities creates a hybrid system where fiat currency gains the programmability of blockchain without sacrificing regulatory compliance.
        </p>
        <p>
          When Digital Cash moves across Telcoin Network, TEL is consumed as gas. The more Digital Cash becomes a preferred instrument for remittances, merchant payments, telecom settlement, and mobile-money interoperability, the more TEL becomes the universal settlement asset behind it.
        </p>

        <h3>Naming and the Multi-Currency Model</h3>
        <p>
          Digital Cash uses an <code>e</code> prefix followed by the ISO currency code: eUSD for the US dollar, eEUR for the euro, eJPY for the Japanese yen, and so on. This is deliberately unlike the stablecoin market’s convention of brand-led names, and it signals the intent — these are digital representations of national currencies, not products with their own identities.
        </p>
        <p>
          The multi-currency approach matters more than it first appears. A remittance corridor is a currency pair, not a single currency. Sending value from Australia to the Philippines is an AUD-to-PHP problem. A network that only issues dollars forces every corridor through a dollar leg, adding two conversions and two spreads. Issuing many currencies natively lets value settle closer to the pair the user actually cares about.
        </p>
        <p>
          Note that the set of currencies designed for the system is broader than the set live and available to users at any given moment. Treat the grid below as the intended range rather than a live availability list, and check the Telcoin app for what you can actually hold today.
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

        <h3>How Digital Cash Differs from Conventional Stablecoins</h3>
        <p>
          The mechanics look similar from the outside — deposit fiat, receive a token, redeem the token for fiat. The difference is in what stands behind the redemption promise.
        </p>
        <ul>
          <li><strong>Issuer type.</strong> Most large stablecoins are issued by private companies. Digital Cash is issued through a chartered depository institution subject to banking supervision.</li>
          <li><strong>Reserve treatment.</strong> The bank model places reserve requirements and examination under a supervisory regime rather than relying only on voluntary attestations.</li>
          <li><strong>Redemption rights.</strong> A bank deposit relationship carries statutory rights; a token issued by an unregulated entity is a contractual claim whose strength depends entirely on the issuer’s terms.</li>
          <li><strong>Currency coverage.</strong> The stablecoin market is overwhelmingly dollar-denominated. Digital Cash is designed as a multi-currency family from the start.</li>
        </ul>
        <p>
          None of this makes Digital Cash risk-free — every fiat-backed instrument carries issuer, reserve, and operational risk. It changes <em>who supervises those risks</em> and what recourse holders have.
        </p>

        <h3>Mint, Redeem, and the Full Lifecycle</h3>
        <p>
          A unit of Digital Cash follows a closed loop. A verified user deposits fiat with the bank entity. The bank holds that fiat in reserve and mints the corresponding Digital Cash on-chain to the user’s self-custodial wallet address. The user can now send, hold, or swap it — the bank is no longer in the transaction path, and settlement happens on Telcoin Network.
        </p>
        <p>
          Redemption reverses the flow. The user returns Digital Cash to the issuer, the tokens are burned, and fiat is released from reserve to the user’s bank account or mobile-money wallet. Because minting and burning are the only ways units enter and leave circulation, on-chain supply should always correspond to reserves held — which is what makes the instrument auditable.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/wallet-mockup-home-r.png" alt="Telcoin Wallet with Digital Cash" />
        </div>
      </>
    ),
  },
  {
    id: 'deep-bank',
    title: 'Telcoin Digital Asset Bank — Deep Dive',
    content: (
      <>
        <h3>Why a Bank Charter At All</h3>
        <p>
          Most crypto projects treat regulation as an obstacle to route around. Telcoin’s position is the inverse: for money that ordinary people rely on, regulation is the product. A payroll deposit, a remittance to family, or a merchant’s daily float are not speculative positions. Users need to know that the institution holding the backing assets is examined, capitalized, and legally obligated to give the money back.
        </p>
        <p>
          Pursuing a charter is slow and expensive, and it constrains what the business can do. That is precisely why it functions as a moat — it is a cost that a competitor cannot simply decide to skip.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/telcoin-bank-logo.svg" alt="Telcoin Digital Asset Bank Logo" className="deep-dive-icon" />
          <img src="/media/marquee/logos/icon-crypto-bank.svg" alt="Digital asset bank" className="deep-dive-icon" />
        </div>

        <h3>The Nebraska Route</h3>
        <p>
          Telcoin pursued a charter in Nebraska, which passed the Nebraska Financial Innovation Act to create a state-supervised category of digital asset depository institution. The framework was designed for exactly this case: an institution that takes deposits and issues digital representations of them, supervised by a state banking department rather than operating in a regulatory gap.
        </p>
        <p>
          Telcoin has described its resulting entity as the first bank of its kind chartered in the United States. Because charter conditions, approval stages, and operational go-live dates are all distinct milestones that have moved over time, treat the current operating status as something to verify against Telcoin’s own announcements and the Nebraska Department of Banking and Finance rather than as settled fact from a community wiki.
        </p>

        <h3>What the Bank Actually Does</h3>
        <p>
          The bank entity’s role is narrow and deliberately so. It handles custody of fiat reserves, know-your-customer and anti-money-laundering programs, transaction surveillance, and the mint and redemption of Digital Cash. It does <em>not</em> custody users’ crypto assets — the wallet is self-custodial — and the blockchain never touches customer fiat, only the digital representation of it.
        </p>
        <p>
          This separation is what gives Telcoin the credibility to integrate with telecoms, merchants, and financial institutions. And because the bank is obligated to maintain reserves and redemption processes, Digital Cash becomes a legitimate monetary instrument rather than a corporate IOU.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/vault.png" alt="Digital Cash Vault and Reserves" />
        </div>

        <h3>Reserve Management</h3>
        <p>
          A digital asset depository institution of this type is expected to hold reserves in high-quality liquid assets rather than lending deposits out. That is a meaningful distinction from a conventional commercial bank: there is no fractional reserve lending against Digital Cash balances, which is what allows redemption on demand to be a credible promise.
        </p>
        <p>
          The tradeoff is that the business cannot earn a lending spread and must instead earn from reserve yield and transaction economics. It is a narrower, lower-risk business model — appropriate for an institution whose core promise is that the money is always there.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/treasury-management.jpg" alt="Treasury and reserve management" />
        </div>

        <h3>Where the Bank Sits Relative to Everything Else</h3>
        <p>
          Keeping the entities distinct is the single most useful thing a reader can do when evaluating Telcoin. The bank issues money. The Association governs the protocol. The network settles transactions. TELx provides liquidity. The wallet is the interface. These are separate legal and technical structures, and a claim about one is not automatically a claim about another.
        </p>
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
          The Telcoin Digital Asset Bank acts as a regulated bridge between fiat and digital currency. It handles custody, KYC, AML, surveillance, and fiat settlement. The blockchain never touches customer fiat — it only processes the digital representation of it. See the dedicated Bank section above for how the charter and reserve model work.
        </p>

        <h3>Telecom Integration</h3>
        <p>
          Telecoms operate one of the world’s largest financial rails: mobile money. These networks move enormous volumes annually. Yet cross-carrier settlement is slow and fragmented. Digital Cash gives telecoms a uniform settlement instrument and Telcoin gives them instant finality.
        </p>
        <p>
          Telecoms do not need TEL to operate mobile-money systems, but all of their Digital Cash settlement runs on Telcoin Network — and that consumes TEL. This is how enterprise adoption converts into direct token demand without forcing enterprises into speculative token holdings.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/gsma.svg" alt="GSMA" className="deep-dive-icon" />
          <img src="/media/marquee/logos/icon-mnos.svg" alt="Mobile Network Operators" className="deep-dive-icon" />
        </div>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/inter-carrier-settlements.jpg" alt="Inter-Carrier Settlements" />
        </div>

        <h3>Inter-Carrier Settlement in Practice</h3>
        <p>
          When you roam onto a foreign network, or when a call crosses from one operator to another, the carriers owe each other money. Historically this is reconciled through bilateral agreements, clearing houses, and settlement cycles measured in weeks. Disputes are common because each side keeps its own records and the two do not always agree.
        </p>
        <p>
          A shared ledger changes the shape of the problem. If both carriers settle against the same record with deterministic finality, reconciliation becomes a read operation rather than a negotiation. The working capital that each carrier currently ties up waiting for settlement cycles is freed. This is an unglamorous use case, but it is a large one, and it is the kind of thing carriers will adopt for hard commercial reasons rather than enthusiasm for blockchain.
        </p>

        <h3>Merchant Payments</h3>
        <p>
          Card networks charge merchants a percentage of every sale and settle days later, with chargeback risk lingering for months. Digital Cash settles instantly and irreversibly, which removes both the float and the chargeback exposure.
        </p>
        <p>
          Irreversibility cuts both ways, of course — the consumer protection that chargebacks provide has to be reconstructed some other way, typically through escrow or dispute mechanisms built at the application layer. That is a solvable design problem, but it is a real one and worth naming rather than glossing over.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/direct-merchant-payments.jpg" alt="Direct merchant payments" />
        </div>

        <h3>Compliance as Architecture</h3>
        <p>
          The important structural point is that compliance obligations sit at the layer where they belong. The bank runs KYC and AML because it is the regulated deposit-taking entity. Telecoms contribute verified identity because they already perform SIM registration. The blockchain layer stays neutral and does not attempt to encode jurisdiction-specific rules into consensus.
        </p>
        <p>
          This is why the design can serve many jurisdictions at once. Rules that vary by country are enforced by entities licensed in those countries, while the settlement layer underneath stays uniform.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/blockchain-based-financial-services.jpg" alt="Blockchain-based financial services" />
        </div>
      </>
    ),
  },
  {
    id: 'deep-wallet',
    title: 'The Telcoin Wallet — Deep Dive',
    content: (
      <>
        <h3>The Interface Everything Else Exists to Support</h3>
        <p>
          Nearly all of Telcoin’s architecture is invisible to the people it is built for. The wallet — available as a mobile app — is where the entire system becomes a product. Its design goal is that a user who has never heard the word ”blockchain” can send money to family and have it arrive, without ever encountering a gas fee dialog, a seed phrase, or a hexadecimal address.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/wallet-mockup-home-r.png" alt="Telcoin Wallet home screen" />
          <img src="/media/deep-dive/digital-cash/wallet-mockup-send-php-l.png" alt="Sending a transfer in the Telcoin Wallet" />
        </div>

        <h3>Self-Custody Without Seed Phrases</h3>
        <p>
          The wallet is self-custodial: Telcoin does not hold users’ crypto assets, and the user’s keys are the user’s own. But the wallet deliberately avoids the standard twelve-word recovery phrase, because that mechanism has a catastrophic failure mode for mainstream users. Write it down and someone can steal it. Lose it and the money is gone permanently, with no recourse and no support line that can help.
        </p>
        <p>
          Instead the wallet uses a multi-key design that distributes key material across separate factors — the device, the user’s credentials, and recovery material — so that no single point of compromise or loss is fatal. Recovering access becomes a process a normal person can complete, rather than a test of whether they filed a piece of paper correctly three years ago.
        </p>
        <p>
          This is the central usability bet of the whole project. Self-custody has never reached mainstream adoption, and seed phrases are a large part of the reason. Solving recovery without reintroducing a custodian is genuinely hard, and it is where the wallet does much of its engineering work.
        </p>

        <h3>What Users Can Actually Do</h3>
        <ul>
          <li><strong>Hold</strong> Digital Cash and supported crypto assets in one place.</li>
          <li><strong>Send</strong> value domestically and across borders, including into mobile-money and bank endpoints in supported corridors.</li>
          <li><strong>Swap</strong> between assets, with liquidity supplied by TELx.</li>
          <li><strong>Stake</strong> TEL to earn rewards and unlock tiers.</li>
          <li><strong>Verify identity</strong> once, then transact within the limits that verification unlocks.</li>
        </ul>

        <h3>Abstracting Gas Away</h3>
        <p>
          Requiring users to hold a separate gas token before they can move their own money is one of crypto’s most persistent usability failures. Someone who receives Digital Cash and holds no TEL should not discover that their money is stranded. Payment-focused networks address this through fee abstraction — sponsoring fees, paying them from the transferred asset, or bundling them into the quoted rate — so the user simply sees the amount that will arrive.
        </p>
        <p>
          Gas is still consumed in TEL underneath; the question is only who assembles it and when. From the user’s perspective there is a send button and a total, which is exactly how it should look.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/support-center.png" alt="Wallet Support and Help Center" />
        </div>
      </>
    ),
  },
  {
    id: 'deep-remittances',
    title: 'Remittances and Corridors — Deep Dive',
    content: (
      <>
        <h3>The Flagship Use Case</h3>
        <p>
          Remittances are where Telcoin’s argument is strongest, because the incumbent experience is genuinely poor and the affected population is enormous. Hundreds of billions of dollars flow annually from workers in wealthier economies to families in lower- and middle-income countries. For many receiving households this is a larger and more stable source of income than foreign aid or direct investment.
        </p>
        <p>
          These flows are also remarkably resilient — they tend to hold up or even rise during downturns in the receiving country, precisely when they are needed most. Reducing the cost of moving them is one of the highest-leverage interventions available in global development, which is why it carries a UN Sustainable Development Goal target.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/cross-border-payments.jpg" alt="Cross-border remittance flows" />
        </div>

        <h3>What a ”Corridor” Means</h3>
        <p>
          A corridor is a directional country pair — Australia to the Philippines, the United States to Mexico, Singapore to Indonesia. It is the unit that matters operationally, because each one requires its own licensing, banking relationships, payout partners, currency handling, and compliance posture. Serving a new corridor is not a software deployment; it is a regulatory and commercial project.
        </p>
        <p>
          This is why remittance providers expand corridor by corridor rather than launching globally, and why any claim about coverage should be checked against the provider’s current published list. Availability changes, and it changes in both directions.
        </p>

        <h3>Where the Cost Actually Goes</h3>
        <p>
          A remittance’s total cost breaks into four parts, and only the first is usually advertised:
        </p>
        <ul>
          <li><strong>The stated fee</strong> — the visible, headline number.</li>
          <li><strong>The exchange-rate margin</strong> — the spread between the rate quoted and the real mid-market rate. Frequently the largest component, and frequently invisible.</li>
          <li><strong>Intermediary deductions</strong> — correspondent banks taking a cut in transit, so less arrives than was quoted.</li>
          <li><strong>Payout costs</strong> — what the recipient pays or loses to collect the funds at the other end.</li>
        </ul>
        <p>
          Telcoin’s structural attack is on the second and third. Settling on a shared ledger removes intermediary hops entirely, and running currency conversion through transparent on-chain liquidity makes the spread visible and contestable rather than set unilaterally by the provider.
        </p>

        <h3>The Last Mile Is Still the Hard Part</h3>
        <p>
          Honesty matters here, because it is where crypto remittance projects routinely overstate their progress. Moving value across a blockchain is the easy half. The hard half is the recipient converting that value into something they can spend — cash in hand, a mobile-money balance, a bank deposit — in a country with its own licensing regime and its own payout infrastructure.
        </p>
        <p>
          That last mile requires local partnerships and local licences in every market served. It is the reason corridors open slowly. Telcoin’s telecom-first strategy is a direct response: mobile network operators already <em>are</em> the last mile in many of these markets, with agent networks and mobile-money systems already reaching the recipient. Partnering with the carrier is faster than rebuilding what the carrier already has.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/mfs-2.jpg" alt="Mobile financial services last mile" />
        </div>
      </>
    ),
  },
  {
    id: 'deep-tokenomics',
    title: 'TEL Tokenomics and Supply — Deep Dive',
    content: (
      <>
        <h3>The Fixed Supply</h3>
        <p>
          TEL has a fixed maximum supply of <strong>100,000,000,000</strong> — one hundred billion tokens. There is no protocol inflation minting new TEL into existence. Every token that will ever exist already exists, which means all ecosystem incentives, staking rewards, and liquidity programs are funded from allocations carved out of that fixed pool rather than from newly issued supply.
        </p>
        <p>
          The large token count is a denomination choice, not an economic one. A supply of 100 billion at a low unit price and a supply of 100 million at a high unit price describe the same network value. The relevant number is always market capitalization, never the price of a single token.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/TEL.svg" alt="TEL token" className="deep-dive-icon deep-dive-icon--large" />
        </div>

        <h3>Two Decimals — The Detail That Breaks Scripts</h3>
        <p>
          TEL uses <strong>2 decimal places</strong> on every chain where it is deployed. This is unusual: most ERC-20 tokens use 18. It makes intuitive sense for a currency-like asset — you get hundredths, the same as cents — but it is a reliable source of bugs for anyone reading contract data directly.
        </p>
        <p>
          A raw on-chain balance of <code>1000000</code> is 10,000.00 TEL. Divide raw values by 100, not by 10<sup>18</sup>. Tooling that assumes the default will report balances off by sixteen orders of magnitude.
        </p>

        <h3>What TEL Is Actually For</h3>
        <p>
          TEL is not a single-purpose token, and the different roles reinforce one another:
        </p>
        <ul>
          <li><strong>Gas.</strong> Every transaction on Telcoin Network consumes TEL, tying token demand to real usage.</li>
          <li><strong>Validator stake.</strong> Telecom validators post TEL as the economic bond securing consensus.</li>
          <li><strong>User staking.</strong> Holders stake to earn rewards and unlock tiers, removing supply from circulation.</li>
          <li><strong>Liquidity incentives.</strong> TELx directs TEL rewards to liquidity providers who make markets in TEL and Digital Cash.</li>
          <li><strong>Governance.</strong> Staked TEL carries influence over Association decisions and emissions policy.</li>
        </ul>
        <p>
          The through-line is that TEL is consumed and locked in proportion to how much the network is used, which is closer to a commodity profile than to a pure equity-like claim.
        </p>

        <h3>Where the Supply Sits Today</h3>
        <p>
          The sibling Telcoin Proposal Tracker project maintains an independent, reproducible on-chain census of TEL across Ethereum, Polygon, and Base. It classifies addresses into exchange wallets, DEX pools, treasury and escrow, and retail holders, then reconciles the total against the fixed 100 billion supply.
        </p>
        <p>
          As of the <strong>16 August 2026</strong> snapshot, that census recorded roughly <strong>99,700 holding addresses</strong> across the three chains — about <strong>74,000</strong> of them classified as retail after exchange, DEX, and treasury wallets are excluded. Approximately <strong>20.7 billion TEL</strong> sat in identified centralized-exchange wallets.
        </p>
        <p>
          Two caveats are important. Address counts are not people — one user may hold several addresses, and a single exchange address may represent millions of users. And these figures are a snapshot from an independent community project using its own classification rules, not an official Telcoin disclosure. They move daily.
        </p>

        <h3>Staking Mechanics</h3>
        <p>
          User staking has historically run through a staking contract deployed on Polygon, chosen because transaction costs there make small stakes economically viable in a way that Ethereum mainnet fees would not. Staked TEL is locked, removing it from circulating supply for as long as the position is held.
        </p>
        <p>
          Rewards come from allocated pools rather than from inflation. This is a meaningful structural difference from inflationary proof-of-stake networks: a staker’s rewards are not diluting non-stakers by minting new supply, but the reward pools are finite and their emission schedule is a governance decision rather than a fixed protocol constant.
        </p>
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
          Telecom validators stake TEL to secure the chain. This is not a yield-maximization exercise. It is an operational requirement tied to real financial activity. Telecoms that settle significant volume daily have a profound incentive to keep the network secure and stable. Staking TEL becomes part of their operational footprint, locking large quantities of the token out of circulation.
        </p>

        <h3>TELx: The Decentralized Liquidity Engine</h3>
        <p>
          TELx is the liquidity layer of the ecosystem. It builds on established automated market maker infrastructure and layers TEL incentives on top, directing rewards to the liquidity providers who make markets in TEL, Digital Cash, and the other assets available in the Telcoin Wallet.
        </p>
        <p>
          The purpose is concrete rather than abstract. When a user swaps currencies in the wallet, the quality of the rate they receive depends entirely on how deep the underlying liquidity pool is. Thin liquidity means slippage, and slippage on a remittance is just another hidden fee. Paying liquidity providers to keep pools deep is therefore a direct investment in the product’s core promise.
        </p>
        <p>
          Deep liquidity improves execution quality, which improves user experience, which increases wallet activity, which increases transaction throughput — and throughput consumes TEL. That loop is the economic flywheel TELx exists to spin.
        </p>

        <h3>What Liquidity Providers Are Actually Taking On</h3>
        <p>
          Providing liquidity is not free yield, and anyone considering it should understand the exposure. An AMM position rebalances automatically as prices move, which means a provider ends up holding more of whichever asset is falling and less of whichever is rising. Compared to simply holding the two assets, this produces a shortfall — commonly called impermanent loss, though it becomes quite permanent if you withdraw while the divergence persists.
        </p>
        <p>
          TEL incentives are what compensate providers for taking that risk. Whether the compensation is adequate depends on emission rates, trading volume, and price volatility, all of which change. Pairs of two currencies that track each other closely carry much less of this risk than a volatile-to-stable pair.
        </p>
        <div className="deep-dive-telx-logos">
          <div className="deep-dive-logo-group deep-dive-logo-group--prominent">
            <h4>TELx Platform</h4>
            <div className="deep-dive-logo-grid deep-dive-logo-grid--prominent">
              <img src="/media/deep-dive/digital-cash/TELx.svg" alt="TELx" className="deep-dive-icon deep-dive-icon--large" />
            </div>
          </div>
          <div className="deep-dive-logo-group">
            <h4>AMM Infrastructure</h4>
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
          <img src="/media/deep-dive/digital-cash/TAN.svg" alt="Telcoin Application Network" className="deep-dive-icon" />
        </div>
        <p>
          The Telcoin Association governs emissions, network decisions, ecosystem funding, and protocol direction. TEL stakers elect councils, submit proposals, and shape the trajectory of the financial network. Governance is not a symbolic add-on — it directly impacts how TELx emissions flow, how incentives evolve, and how the network grows.
        </p>
        <p>
          As more ecosystem participants emerge — telecoms, integrators, liquidity providers, developers — governance influence becomes valuable. Demand for influence becomes demand for TEL.
        </p>

        <h3>Why an Association Rather Than a Company</h3>
        <p>
          The Association is organized as a Swiss association, a structure that several major blockchain projects have adopted. The reasoning is that a member-governed, non-profit body is a more credible steward of neutral infrastructure than a private company would be. Carriers being asked to run validators and settle real money need assurance that the rules will not be changed unilaterally by a corporation pursuing its own commercial interests.
        </p>
        <p>
          The structure also creates a clean separation of concerns: the Association governs the protocol, while operating companies build products on top of it. Those are different jobs with different incentives, and conflating them is how neutral infrastructure stops being neutral.
        </p>

        <h3>Councils and Working Groups</h3>
        <p>
          Rather than putting every decision to a token-wide vote, governance is organized into elected councils and working groups covering distinct domains — network operations, liquidity and emissions, applications, and governance process itself. Stakers elect representatives to these bodies, and the bodies do the detailed work.
        </p>
        <p>
          This is a deliberate response to a well-documented failure of pure token voting: most holders lack the time or context to evaluate technical proposals, so direct votes suffer from low participation and outsized influence for large holders. Delegated, domain-specific bodies trade some directness for competence and continuity.
        </p>

        <h3>What Governance Actually Controls</h3>
        <ul>
          <li><strong>TELx emissions</strong> — how much TEL flows to which liquidity pools, and on what schedule.</li>
          <li><strong>Validator policy</strong> — requirements and standards for running network infrastructure.</li>
          <li><strong>Protocol upgrades</strong> — changes to the network itself.</li>
          <li><strong>Ecosystem funding</strong> — grants and support for development.</li>
        </ul>
        <p>
          Note what is <em>not</em> on that list. Governance does not control the bank’s regulatory obligations — a banking regulator does. It does not control the laws in any market. Understanding this boundary prevents a common misreading in which token governance is assumed to have authority over the regulated parts of the system.
        </p>

        <h3>The Honest Assessment</h3>
        <p>
          Decentralized governance is difficult everywhere it has been tried. Participation is typically low, informed participation lower still, and influence tends to concentrate among those with the largest stakes and the most time. Telcoin’s council model addresses some of this but does not escape it. Readers evaluating the project should look at actual participation rates and proposal histories rather than at the governance design on paper.
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
          The Telcoin Wallet uses a multi-key structure instead of seed phrases. Keys are distributed across factors, making it far harder for a user to lose access or be compromised. This makes self-custody viable for mainstream audiences who will never adopt seed-phrase security. The dedicated Wallet section above covers the mechanics in more detail.
        </p>
        <p>
          The wallet abstracts blockchain complexity entirely. Users simply see Digital Cash, crypto assets, swaps, and earnings. Behind the scenes, TEL powers settlement.
        </p>

        <h3>Identity and Telecom-Anchored Verification</h3>
        <div className="deep-dive-image-inline">
          <img src="/media/marquee/logos/icon-blockchain.svg" alt="Blockchain identity" className="deep-dive-icon" />
        </div>
        <p>
          Telecoms already handle KYC and SIM registration for enormous numbers of users. In many markets, registering a SIM requires government identification by law, which means carriers hold verified identity for populations that traditional banks never reached. Telcoin leverages this infrastructure to enable identity verification for compliance-heavy applications like remittances, merchant payments, and regulated money transfers.
        </p>
        <p>
          The privacy question this raises is real and deserves a direct answer rather than a reassuring one. Linking financial activity to telecom identity is powerful for compliance and correspondingly sensitive for users. The mitigating design principle is data minimization — verification should confirm that a user meets a requirement without broadcasting their identity on-chain to everyone. Identity attaches at the regulated layer, not to the public ledger. How well any implementation lives up to that principle is a fair thing for users to scrutinize.
        </p>

        <h3>Getting Involved</h3>
        <p>
          Telcoin has an unusually persistent community, much of it dating to the 2017 era. Governance forums carry proposals and council discussion, and independent community projects — including on-chain analytics trackers and this wiki — sit alongside official channels. For anyone new, the useful sequence is: read the official documentation first, then use community resources to fill in context, and treat any single source as fallible.
        </p>
        <div className="deep-dive-image-inline">
          <img src="/media/deep-dive/digital-cash/support-center-mobile.png" alt="Support center on mobile" />
        </div>

        <h3>Where Telcoin Fits in the Landscape</h3>
        <p>
          Most blockchains aim at DeFi or gaming. Telcoin aims at payments, telecom settlement, and regulated digital money. Its architecture, partnerships, compliance posture, and throughput model place it in a category of its own: a global settlement network for mobile-first economies.
        </p>
        <p>
          Its genuine competitors are therefore not other Layer 1s. They are incumbent remittance operators, card networks, correspondent banking, and the growing field of regulated payment stablecoins. Measured against that field, Telcoin’s differentiator is the combination of telecom distribution and a bank charter — a pairing no purely-crypto competitor can easily assemble.
        </p>
        <p>
          TEL becomes the resource consumed by this system — the economic token that scales as global usage scales.
        </p>
      </>
    ),
  },
  {
    id: 'deep-security',
    title: 'Security, Risks and Open Questions — Deep Dive',
    content: (
      <>
        <h3>Why a Risk Section Belongs in a Wiki</h3>
        <p>
          A resource that only lists strengths is marketing, not reference material. Anyone making decisions about Telcoin deserves the same clarity about what could go wrong as about what is designed to go right. Nothing below is a prediction — these are the structural risks inherent to the design, stated plainly.
        </p>

        <h3>Protecting Yourself: The Practical Part</h3>
        <p>
          Most losses in this space have nothing to do with protocol flaws. They come from social engineering. A few rules cover the overwhelming majority of cases:
        </p>
        <ul>
          <li><strong>No legitimate party ever needs your recovery credentials.</strong> Not support, not an administrator, not a moderator. Any request for them is an attack, without exception.</li>
          <li><strong>Anyone who direct-messages you first is suspect.</strong> Impersonation of support staff in community channels is the single most common attack pattern.</li>
          <li><strong>Reach official channels by typing the address yourself.</strong> Search results and links in messages are both routinely poisoned.</li>
          <li><strong>Guaranteed returns are always fraud.</strong> ”Send tokens to receive more back” is never real.</li>
          <li><strong>Install apps only from official app stores</strong>, and verify the publisher.</li>
        </ul>

        <h3>Regulatory Risk</h3>
        <p>
          Telcoin’s regulated posture is a genuine advantage, but it also means the project is exposed to regulatory outcomes in a way that unregulated projects are not. Charter conditions can change. Supervisory expectations evolve. Each new corridor requires its own approvals, any of which can be delayed or refused. Rules governing digital assets and payment tokens remain in flux across most major jurisdictions.
        </p>
        <p>
          Regulatory dependency cuts both ways: it is a barrier protecting Telcoin from competitors, and a constraint on Telcoin’s own pace.
        </p>

        <h3>Adoption and Execution Risk</h3>
        <p>
          The telecom strategy is the project’s biggest bet and its biggest dependency. Carriers are large, slow-moving organizations with long procurement cycles and considerable inertia. Convincing them to run validator infrastructure and route settlement through a new network is a multi-year enterprise sales problem, not a technical one.
        </p>
        <p>
          There is also the plain observation that the project has been building since 2017. Ambitious infrastructure genuinely takes a long time, and comparable financial infrastructure has taken decades to reach scale — but a reader should weigh the length of the roadmap alongside the strength of the thesis.
        </p>

        <h3>Concentration and Technical Risk</h3>
        <p>
          A permissioned validator set is more concentrated than a permissionless one by construction. It is worth asking how many independent validators are actually operating, how they are distributed across jurisdictions, and how much of the stake sits with the largest few.
        </p>
        <p>
          On the technical side, the usual caveats apply and apply fully: smart contracts can contain bugs regardless of auditing, and cross-chain bridges have historically been among the most frequently exploited components in the entire industry. TEL’s presence across multiple chains means bridge security is a live concern rather than a theoretical one.
        </p>

        <h3>Questions Worth Asking</h3>
        <p>
          Rather than accepting or dismissing the project wholesale, these are the questions whose answers actually move the needle:
        </p>
        <ul>
          <li>How many carriers are running validators today, and who are they?</li>
          <li>Which corridors are live right now, and what does a transfer actually cost end to end?</li>
          <li>What volume of Digital Cash is in circulation, and how is the reserve attested?</li>
          <li>How much network activity is genuine payment usage versus incentive farming?</li>
          <li>What is real governance participation, not just governance design?</li>
        </ul>
        <p>
          <strong>None of this is financial advice.</strong> This wiki is a community resource, not an official Telcoin publication, and nothing here should be treated as a recommendation to buy, sell, or hold anything.
        </p>
      </>
    ),
  },
  {
    id: 'deep-glossary',
    title: 'Glossary and Primary Sources — Deep Dive',
    content: (
      <>
        <h3>Core Terms</h3>
        <dl className="deep-dive-glossary">
          <dt>TEL</dt>
          <dd>The native token of the Telcoin ecosystem. Fixed supply of 100 billion, 2 decimal places. Used for gas, staking, liquidity incentives, and governance.</dd>

          <dt>Telcoin Network</dt>
          <dd>Telcoin’s EVM-compatible Layer 1 blockchain, intended to be validated by GSMA-member mobile network operators.</dd>

          <dt>Digital Cash</dt>
          <dd>Telcoin’s family of fiat-backed digital currencies, named with an <code>e</code> prefix plus ISO code (eUSD, eEUR, eJPY). Issued and redeemed through the bank entity.</dd>

          <dt>Telcoin Digital Asset Bank</dt>
          <dd>The regulated entity chartered in Nebraska that issues Digital Cash, holds reserves, and runs KYC/AML.</dd>

          <dt>Telcoin Association</dt>
          <dd>The Swiss member-governed body that stewards the protocol, emissions policy, and network governance through elected councils.</dd>

          <dt>TELx</dt>
          <dd>The liquidity layer that incentivizes market-making in TEL and Digital Cash across supported chains.</dd>

          <dt>TAN — Telcoin Application Network</dt>
          <dd>The framework through which applications connect to the ecosystem and report activity for governance and compliance purposes.</dd>

          <dt>GSMA</dt>
          <dd>The global industry association representing mobile network operators. Its membership defines the pool from which Telcoin Network validators are drawn.</dd>
        </dl>

        <h3>Technical Terms</h3>
        <dl className="deep-dive-glossary">
          <dt>Narwhal</dt>
          <dd>A DAG-based mempool protocol that disseminates transaction data in parallel across validators, separating data availability from consensus ordering.</dd>

          <dt>Bullshark</dt>
          <dd>A consensus protocol that derives a total ordering from Narwhal’s DAG deterministically, requiring no additional messages between validators.</dd>

          <dt>Deterministic finality</dt>
          <dd>The property that a committed transaction can never be reversed — as opposed to probabilistic finality, where confidence grows with each confirmation but never reaches certainty.</dd>

          <dt>Modular architecture</dt>
          <dd>A design separating consensus, execution, and data availability into independent layers that scale separately rather than competing for one pipeline.</dd>

          <dt>BFT — Byzantine Fault Tolerance</dt>
          <dd>The ability of a distributed system to operate correctly while some participants fail arbitrarily or act maliciously, typically tolerating up to one third of the network.</dd>

          <dt>EVM — Ethereum Virtual Machine</dt>
          <dd>The execution environment Ethereum smart contracts run in. EVM compatibility means existing Solidity tooling works largely unchanged.</dd>

          <dt>Self-custody</dt>
          <dd>An arrangement where the user controls their own keys and no third party can move or freeze their assets.</dd>

          <dt>Impermanent loss</dt>
          <dd>The shortfall a liquidity provider experiences relative to simply holding the two assets, caused by the pool automatically rebalancing as prices diverge.</dd>

          <dt>Corridor</dt>
          <dd>A directional country pair for remittances. Each requires its own licensing, partners, and compliance work.</dd>
        </dl>

        <h3>Checking Anything Here Against Primary Sources</h3>
        <p>
          This wiki is written and maintained by the community. It is not published, reviewed, or endorsed by Telcoin, and it can be wrong or out of date. Anything that would affect a real decision should be verified against a primary source:
        </p>
        <ul>
          <li><strong>Telcoin’s official site and documentation</strong> — for product status, supported corridors, and available currencies.</li>
          <li><strong>Telcoin Association governance forums</strong> — for proposals, council composition, and emissions decisions.</li>
          <li><strong>The Nebraska Department of Banking and Finance</strong> — for the bank entity’s charter status.</li>
          <li><strong>Block explorers</strong> — for contract addresses, balances, and transaction history you can verify yourself.</li>
          <li><strong>The Telcoin app itself</strong> — for what is actually live in your market today.</li>
        </ul>
        <p>
          Contract addresses in particular should always be confirmed through an official channel before use. Address substitution is a common attack, and a wiki is exactly the kind of place an attacker would like to plant a wrong one.
        </p>
        <p className="deep-dive-review-note">
          <em>Content last reviewed: 16 August 2026. On-chain figures cited in the Tokenomics section come from the community-run Telcoin Proposal Tracker snapshot of the same date.</em>
        </p>
      </>
    ),
  },
]
