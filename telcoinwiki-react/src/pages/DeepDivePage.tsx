import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'

export function DeepDivePage() {
  return (
    <>
      <PageIntro
        id="deep-dive-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Deep-Dive"
        title="Learn Telcoin by Pathway"
        lede="Explore the Telcoin ecosystem by topic. Each section expands into concise answers and background that tie into the app, the network, and the bank."
      >
        <nav className="toc-chips" aria-label="Deep-Dive sections">
          <a className="toc-chip" href="#deep-network">
            Telcoin Network
          </a>
          <a className="toc-chip" href="#deep-token">
            $TEL Token
          </a>
          <a className="toc-chip" href="#deep-telx">
            TELx Liquidity Engine
          </a>
          <a className="toc-chip" href="#deep-governance">
            Association &amp; Governance
          </a>
          <a className="toc-chip" href="#deep-holdings">
            Telcoin Holdings
          </a>
        </nav>
      </PageIntro>

      <section id="deep-network" className="dd-section">
        <h2>Telcoin Network</h2>
        <div className="dd-accordion">
          <details>
            <summary>What is the Telcoin Network and why is it important?</summary>
            <div className="dd-body">
              EVM-compatible L1 using Narwhal (DAG mempool) + Bullshark (BFT) for fast, secure ordering; enables low-cost
              stablecoin transfers and invites telecom validators.
            </div>
          </details>
          <details>
            <summary>When will the Telcoin Network launch?</summary>
            <div className="dd-body">Core services are live; fuller rollout tracks MNO integrations and regulatory steps.</div>
          </details>
          <details>
            <summary>Which MNOs are partnering?</summary>
            <div className="dd-body">
              GSMA member MNOs across regions; names are announced when live. Historic: GCash (PH), Telkom (ZA).
            </div>
          </details>
          <details>
            <summary>How many MNOs will join?</summary>
            <div className="dd-body">Dozens to potentially hundreds over time, reaching billions of mobile users.</div>
          </details>
          <details>
            <summary>Impact of MNO partnerships?</summary>
            <div className="dd-body">
              Immediate distribution, trust, and compliance leverage; phone-number money transfers at scale.
            </div>
          </details>
        </div>
      </section>

      <section id="deep-token" className="dd-section">
        <h2>$TEL Token</h2>
        <div className="dd-accordion">
          <details>
            <summary>What is $TEL used for?</summary>
            <div className="dd-body">
              $TEL is gas/utility, collateral in TELx modules, staking/liquidity, and future governance; used for P2P, swaps,
              payments.
            </div>
          </details>
          <details>
            <summary>How to buy Telcoin ($TEL)?</summary>
            <div className="dd-body">
              Listed on CEXs (KuCoin, Gate.io) and DEXs (Uniswap). Confirm network (Polygon vs ERC-20).
            </div>
          </details>
          <details>
            <summary>How to swap TEL between networks?</summary>
            <div className="dd-body">
              Use the app bridge or trusted Telcoin-listed bridges—never send directly cross-chain.
            </div>
          </details>
          <details>
            <summary>What can I do with my $TEL?</summary>
            <div className="dd-body">
              Stake in TELx, provide liquidity, pay gas, payments; governance participation is planned.
            </div>
          </details>
          <details>
            <summary>Price/volume/liquidity &amp; predictions?</summary>
            <div className="dd-body">Metrics vary with cycles/listings/usage; no price forecasts.</div>
          </details>
        </div>
      </section>

      <section id="deep-telx" className="dd-section">
        <h2>TELx Liquidity Engine</h2>
        <div className="dd-accordion">
          <details>
            <summary>Main use cases (incl. TELx)?</summary>
            <div className="dd-body">
              Remittances, mobile payments, DeFi services, and stablecoin infra; TELx coordinates on-chain liquidity &amp;
              incentives.
            </div>
          </details>
          <details>
            <summary>What makes Telcoin unique?</summary>
            <div className="dd-body">
              Telecom distribution, DADI bank charter, performant L1, and mobile-first UX.
            </div>
          </details>
          <details>
            <summary>Recent highlights</summary>
            <div className="dd-body">
              DADI charter approval, network deployment, eUSD launch, growing MNO onboarding.
            </div>
          </details>
        </div>
      </section>

      <section id="deep-governance" className="dd-section">
        <h2>Association &amp; Governance</h2>
        <div className="dd-accordion">
          <details>
            <summary>Laws/legislation Telcoin contributed to?</summary>
            <div className="dd-body">
              Helped shape Nebraska’s NFIA, enabling the DADI framework for compliant digital-asset banking.
            </div>
          </details>
          <details>
            <summary>Compliance &amp; expansion (MiCA, data)?</summary>
            <div className="dd-body">
              MiCA status TBD; focus on US/Asia first. Adheres to AML/KYC and lawful requests per jurisdiction.
            </div>
          </details>
          <details>
            <summary>Key partnerships</summary>
            <div className="dd-body">
              Beyond MNOs: GSMA and ecosystem integrations (e.g., The Game Company); more fintech/infra partners developing.
            </div>
          </details>
        </div>
      </section>

      <section id="deep-holdings" className="dd-section">
        <h2>Telcoin Holdings</h2>
        <div className="dd-accordion">
          <details>
            <summary>When will the Telcoin Bank launch?</summary>
            <div className="dd-body">
              Regulatory approval in place; launch timing depends on systems, partner onboarding, and disclosures.
            </div>
          </details>
          <details>
            <summary>What is the Telcoin Bank / offerings?</summary>
            <div className="dd-body">
              Regulated, blockchain-native bank under DADI; issuer of eUSD; programmable custody/payment rails; compliant
              on-chain services.
            </div>
          </details>
          <details>
            <summary>What is eUSD?</summary>
            <div className="dd-body">
              Fully reserved, USD-backed stablecoin (reserves at FDIC-insured banks) functioning as digital cash.
            </div>
          </details>
          <details>
            <summary>Revenue &amp; timing</summary>
            <div className="dd-body">
              eUSD spread, transaction &amp; network fees, custody, integrations, and TELx-driven liquidity; ramps with adoption.
            </div>
          </details>
          <details>
            <summary>Do I need an account in Nebraska?</summary>
            <div className="dd-body">No—digital-first access where permitted via the Telcoin app.</div>
          </details>
        </div>
      </section>
    </>
  )
}
