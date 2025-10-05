import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <section id="home-hero" className="page-intro anchor-offset tc-card">
        <p className="page-intro__eyebrow">Community Q&amp;A for Telcoin</p>
        <h1 className="page-intro__title">Understand the Telcoin platform in minutes</h1>
        <p className="page-intro__lede">
          This unofficial wiki curates verified answers, onboarding checklists, and direct links to Telcoin Association and
          Telcoin company resources so newcomers can get started with confidence.
        </p>
        <div className="notice notice--info" role="note">
          <p className="notice__title">Unofficial helper</p>
          <p>
            Always confirm details inside the Telcoin Wallet or through official Association releases. The community keeps this
            wiki current, but the authoritative word lives at telco.in and telcoinassociation.org.
          </p>
        </div>
      </section>

      <section id="learning-pathways" className="lp anchor-offset">
        <div className="lp-head">
          <h2>Learning pathways</h2>
          <p className="lp-lead">
            Five curated tracks connect you to the official docs and community explainers that answer the most common Telcoin
            questions.
          </p>
        </div>
        <div className="lp-grid" role="list">
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Orientation</span>
            <h3 className="lp-title">Understand the ecosystem</h3>
            <p className="lp-body">
              See how the Wallet, Telcoin Network, and Association work together before you dive into product specifics.
            </p>
            <p className="lp-cta">
              <Link to="/start-here">Start the quickstart →</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Wallet basics</span>
            <h3 className="lp-title">Set up and secure your app</h3>
            <p className="lp-body">
              Walk through verification, recovery phrases, and security best practices to keep your account protected.
            </p>
            <p className="lp-cta">
              <Link to="/wallet">Open the wallet playbook →</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Digital Cash</span>
            <h3 className="lp-title">Learn about stable-value assets</h3>
            <p className="lp-body">
              Understand supported e-money tokens, how minting works, and where to monitor reserve disclosures.
            </p>
            <p className="lp-cta">
              <Link to="/digital-cash">Explore Digital Cash →</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Remittances</span>
            <h3 className="lp-title">Move money across borders</h3>
            <p className="lp-body">
              Track active corridors, payout partners, and pricing straight from official Telcoin Wallet updates.
            </p>
            <p className="lp-cta">
              <Link to="/remittances">Check remittance corridors →</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Deep dive</span>
            <h3 className="lp-title">Go beyond the basics</h3>
            <p className="lp-body">
              Connect with TEL token utility, TELx liquidity programs, and governance resources when you’re ready for advanced
              topics.
            </p>
            <p className="lp-cta">
              <Link to="/deep-dive">Review deep-dive guides →</Link>
            </p>
          </article>
        </div>
      </section>

      <section id="faq" className="faq anchor-offset" aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQs</h2>

        <h3 className="faq-group" id="faq-basics">
          Basics
        </h3>

        <details>
          <summary>What is Telcoin and what does it do?</summary>
          <div className="answer">
            Telcoin is a Web3 financial platform pairing a mobile wallet with its own Layer-1 blockchain and a regulated bank
            entity, aiming for cheap, instant remittances and payments through telecom distribution.{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What is the $TEL token used for?</summary>
          <div className="answer">
            $TEL is the native gas/utility token used for fees, TELx staking/liquidity, and future governance; in-app it powers
            P2P, swaps, and payments. <Link to="/deep-dive#deep-token">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What are the use cases of Telcoin?</summary>
          <div className="answer">
            Sub-2% remittances, stablecoin payments, DeFi via TELx, and bank-issued digital cash (eUSD)—delivered in a
            mobile-first, telecom-integrated UX. <Link to="/deep-dive#deep-telx">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What makes Telcoin unique vs others?</summary>
          <div className="answer">
            Telecom-scale distribution (GSMA MNOs), a US digital-asset bank charter, high-throughput L1 (Narwhal/Bullshark), and
            a simple mobile experience. <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Recent highlights</summary>
          <div className="answer">
            DADI bank charter, Telcoin Network deployment, eUSD launch, and ongoing MNO onboarding/TELx integrations.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <h3 className="faq-group" id="faq-network">
          Network &amp; MNOs
        </h3>

        <details>
          <summary>When will the Telcoin Network launch?</summary>
          <div className="answer">
            Core functions are live; broader rollout tracks MNO integrations and compliance milestones.{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What is the Telcoin Network and why is it important?</summary>
          <div className="answer">
            EVM L1 optimized for mobile finance; Narwhal + Bullshark deliver fast, secure, low-fee transactions and invite telecoms
            as validators. <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Which MNOs are partnering?</summary>
          <div className="answer">
            GSMA member carriers across regions; names announced when live (e.g., historic: GCash, Telkom).{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>How many MNOs will join?</summary>
          <div className="answer">
            Target: dozens to hundreds, unlocking access for billions of mobile users.{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Impact of MNO partnerships?</summary>
          <div className="answer">
            Instant distribution, trust, and regulatory credibility—enabling phone-number money transfers at scale.{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <h3 className="faq-group" id="faq-bank">
          Bank &amp; eUSD
        </h3>

        <details>
          <summary>When will the Telcoin Bank launch?</summary>
          <div className="answer">
            Regulatory approval in place; launch timing depends on systems, partner onboarding, and disclosures.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What is the Telcoin Bank / offerings?</summary>
          <div className="answer">
            Regulated, blockchain-native bank under DADI; issuer of eUSD; programmable custody/payment rails; compliant on-chain
            services. <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What is eUSD?</summary>
          <div className="answer">
            Fully reserved, USD-backed stablecoin (reserves at FDIC-insured banks) functioning as digital cash.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Revenue &amp; timing</summary>
          <div className="answer">
            eUSD spread, transaction &amp; network fees, custody, integrations, and TELx-driven liquidity; ramps with adoption.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Do I need an account in Nebraska?</summary>
          <div className="answer">
            No—digital-first access where permitted via the Telcoin app. <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <h3 className="faq-group" id="faq-app">
          Using TEL &amp; App
        </h3>

        <details>
          <summary>How to buy Telcoin ($TEL)?</summary>
          <div className="answer">
            Listed on CEXs (KuCoin, Gate.io) and DEXs (Uniswap). Confirm network (Polygon vs ERC-20).{' '}
            <Link to="/deep-dive#deep-token">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>How to swap TEL between networks?</summary>
          <div className="answer">
            Use the app bridge or trusted Telcoin-listed bridges—never send directly cross-chain.{' '}
            <Link to="/deep-dive#deep-token">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What can I do with my $TEL?</summary>
          <div className="answer">
            Stake in TELx, provide liquidity, pay gas, payments; governance participation is planned.{' '}
            <Link to="/deep-dive#deep-token">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Price/volume/liquidity &amp; predictions?</summary>
          <div className="answer">
            Metrics vary with cycles/listings/usage; no price forecasts.{' '}
            <Link to="/deep-dive#deep-token">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Is Telcoin compliant?</summary>
          <div className="answer">
            Telcoin Holdings reports SOC 2 Type II progress and operates a regulated digital asset bank; the Association governs
            issuance under telecom-grade compliance. <Link to="/deep-dive#deep-governance">Learn more →</Link>
          </div>
        </details>

        <h3 className="faq-group" id="faq-compliance">
          Compliance &amp; Expansion
        </h3>

        <details>
          <summary>Why is Telcoin better for remittances than traditional?</summary>
          <div className="answer">
            Traditional takes days at 7–10%; Telcoin uses stablecoins + carrier rails for near-instant, sub-2%.{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Price predictions for $TEL?</summary>
          <div className="answer">
            No predictions; outcomes depend on usage, regulation, MNO/bank adoption.{' '}
            <Link to="/deep-dive#deep-token">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>What laws did Telcoin help shape?</summary>
          <div className="answer">
            Contributed to Nebraska’s NFIA, enabling DADI digital-asset banks.{' '}
            <Link to="/deep-dive#deep-governance">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Will Telcoin operate like a “real bank”?</summary>
          <div className="answer">
            Yes—regulated DADI charter, bank-grade obligations, purpose-built for stablecoins/programmatic finance.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Can I link my bank account to the app?</summary>
          <div className="answer">
            On the roadmap; rolls out regionally as licensing/integrations permit.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Where is Telcoin licensed/compliant?</summary>
          <div className="answer">
            Holds a DADI charter in Nebraska; global features vary by jurisdiction.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>How big is the team?</summary>
          <div className="answer">
            Lean, global team across eng/compliance/product/ops; exact headcount not public.{' '}
            <Link to="/deep-dive#deep-governance">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>How big is the market?</summary>
          <div className="answer">
            Remittances $800B+; stablecoins $100B+; 5B+ users via GSMA carriers.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>USPs vs web2 players?</summary>
          <div className="answer">
            Regulatory-grade compliance + Web3 efficiency, telecom reach, near-zero remittance cost, public rails, fully mobile
            UX. <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Other (non-MNO) partnerships?</summary>
          <div className="answer">
            Yes: fintech/infra, compliance/custody, and emerging Web3 (e.g., gaming).{' '}
            <Link to="/deep-dive#deep-governance">Learn more →</Link>
          </div>
        </details>

        <h3 className="faq-group" id="faq-revenue">
          Revenue &amp; Timing
        </h3>

        <details>
          <summary>What revenue streams will the bank enable?</summary>
          <div className="answer">
            eUSD issuance/spread, transaction &amp; network fees, custody, enterprise integrations, TELx liquidity programs.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>How soon will revenue ramp?</summary>
          <div className="answer">
            Gradual ramp with early metrics in months; depends on user volume, eUSD circulation, partners.{' '}
            <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>When do MNOs sign on after bank opening?</summary>
          <div className="answer">
            Some carriers go live in parallel or shortly after (especially those already onboarding).{' '}
            <Link to="/deep-dive#deep-network">Learn more →</Link>
          </div>
        </details>

        <details>
          <summary>Do I need a NE bank account?</summary>
          <div className="answer">
            No—digital-first access where permitted via the app. <Link to="/deep-dive#deep-holdings">Learn more →</Link>
          </div>
        </details>
      </section>
    </>
  )
}
