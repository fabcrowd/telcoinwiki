import type { ReactNode } from 'react'

export type ProtocolSection = {
  id: string
  title: string
  /** Short label used by the table-of-contents chips. */
  chip: string
  content: ReactNode
}

/**
 * Telcoin Network protocol reference.
 *
 * Sourced from the official documentation at docs.telcoin.network (see the
 * "Documentation index" section for the full page list). Kept out of the page
 * component so `tools/build-search-index.mjs` can render it to text and the
 * anchor test can verify every chip target resolves.
 */
export const PROTOCOL_SECTIONS: ProtocolSection[] = [
  {
    id: 'proto-overview',
    chip: 'Overview',
    title: 'What Telcoin Network is',
    content: (
      <>
        <p>
          Telcoin Network is an EVM-compatible Layer 1 blockchain, secured by proof of stake and
          validated by GSMA Operator Member mobile network operators. TEL is the native gas token.
          The network is governed by the Telcoin Association, a non-profit Swiss Verein.
        </p>
        <p>
          The documented use cases are deliberately payments-shaped rather than general-purpose
          speculation: DeFi payments and services, stablecoin remittances, inter-carrier settlement,
          and games and loyalty programmes. Node operation rights are reserved for GSMA Full Member
          MNOs, who earn network fees and TEL issuance for securing blocks.
        </p>
        <div className="proto-stats" role="list">
          <div className="proto-stat" role="listitem">
            <b>487</b>
            <i>mainnet chain ID</i>
          </div>
          <div className="proto-stat" role="listitem">
            <b>2017</b>
            <i>testnet chain ID</i>
          </div>
          <div className="proto-stat" role="listitem">
            <b>&lt; 0.5s</b>
            <i>documented finality</i>
          </div>
          <div className="proto-stat" role="listitem">
            <b>30M</b>
            <i>gas limit per block</i>
          </div>
          <div className="proto-stat" role="listitem">
            <b>1M TEL</b>
            <i>validator stake at launch</i>
          </div>
          <div className="proto-stat" role="listitem">
            <b>&gt; 2/3</b>
            <i>honest stake required</i>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'proto-architecture',
    chip: 'Architecture',
    title: 'A modular blockchain, in four layers',
    content: (
      <>
        <p>
          The documentation frames Telcoin Network as modular rather than monolithic — &ldquo;a modular
          blockchain separates the blockchain&rsquo;s services into separate modules, each specializing in
          one aspect.&rdquo; Four layers are named.
        </p>
        <dl className="proto-deflist">
          <dt>Consensus layer</dt>
          <dd>
            Validates and orders transactions across validator nodes. Narwhal handles the mempool;
            Bullshark finalises and records transactions into the settlement layer.
          </dd>

          <dt>Execution layer</dt>
          <dd>
            Described as the chain&rsquo;s processing unit, analogous to a CPU. Runs everything from simple
            transfers to smart contracts on the EVM, which is what gives cross-chain tooling
            compatibility.
          </dd>

          <dt>Data availability layer</dt>
          <dd>
            Keeps the data needed for validation reachable across the network, using &ldquo;a scalable number
            of workers which share collections of transactions&rdquo; so any node can obtain what it needs to
            process and verify.
          </dd>

          <dt>Settlement layer</dt>
          <dd>
            The permanent ledger. Bullshark&rsquo;s Byzantine fault tolerant consensus prevents forks and
            reorganisations, so committed transactions are irrevocably settled.
          </dd>
        </dl>
        <p className="proto-note">
          This is the conceptual framing used by the protocol documentation. The implementation in the
          <code> telcoin-network</code> repository organises the same work differently again — an
          EpochManager orchestrating consensus, execution, networking and storage — which is a view of
          the same system at a different altitude, not a contradiction.
        </p>
      </>
    ),
  },
  {
    id: 'proto-lifecycle',
    chip: 'Transaction lifecycle',
    title: 'From signature to irreversible, in under half a second',
    content: (
      <>
        <ol className="proto-steps">
          <li>
            <b>Creation.</b> A user initiates a transfer from a wallet or dApp and signs it with their
            private key, producing an immutable, signature-protected message ready for submission to
            validators.
          </li>
          <li>
            <b>Certification.</b> Validators check the signature, that the sender holds enough funds
            plus gas, that any contract call data is correctly encoded, and that sufficient gas was
            supplied. Valid transactions enter the pending pool. When proposing, a validator draws
            transactions until it reaches the <b>30 million gas limit</b> or runs out.
          </li>
          <li>
            <b>Finalisation.</b> A transaction certificate is broadcast to all validators, who verify
            and execute it, then compare effects — the node confirms that the state changes reported by
            each validator are identical. Once a supermajority of signatures is collected it produces an
            <code> EffectsCertificate</code>, and the transaction is executed, irreversible and final.
          </li>
        </ol>
        <p>
          The documentation puts the whole process at <b>less than half a second</b>, which is why the
          architecture has no notion of a pending block — there is no probabilistic waiting period to
          sit through.
        </p>
      </>
    ),
  },
  {
    id: 'proto-consensus',
    chip: 'Consensus',
    title: 'Narwhal and Bullshark',
    content: (
      <>
        <h4>Narwhal — a DAG-based mempool</h4>
        <p>
          Narwhal structures transaction dissemination as a directed acyclic graph. The documentation
          credits it with three properties: <b>parallel processing</b> — &ldquo;the DAG structure allows for
          concurrent transaction processing, significantly boosting throughput&rdquo;; <b>efficiency</b>,
          by removing the bottlenecks of a traditional sequential mempool; and <b>scalability</b> under
          substantial transaction volume.
        </p>
        <h4>Bullshark — asynchronous consensus</h4>
        <p>
          Bullshark is a DAG-based Byzantine Atomic Broadcast protocol. It operates{' '}
          <b>asynchronously</b>, meaning it stays correct without timing assumptions and so resists
          network delays and timing-based exploits, while being &ldquo;optimized for the more common
          synchronous cases, ensuring high throughput and low latency.&rdquo;
        </p>
        <p>
          Together they give the settlement layer its defining property: no forks, no reorganisations,
          and deterministic finality rather than confirmations that only ever approach certainty.
        </p>
      </>
    ),
  },
  {
    id: 'proto-token',
    chip: 'Native token',
    title: 'TEL as a native token, and the 0x7e1 precompile',
    content: (
      <>
        <p>
          TEL began as an ERC-20 on Ethereum and became the native gas token of Telcoin Network — an
          unusual direction of travel. Most chains launch a new native token and wrap it afterwards.
          Telcoin explicitly avoids the Polygon-style approach of keeping state synchronised between
          Ethereum and the chain through mechanisms like StateSender and checkpoints; core state lives
          on Telcoin Network itself.
        </p>
        <p>
          Because TEL exists on Ethereum, it has to be bridged. The protocol uses <b>Axelar</b> to bridge
          ERC-20 TEL across as wrapped TEL (<code>wTEL</code>), which users then unwrap into native TEL
          much as WETH9 works. Managing balances at the protocol level rather than inside a contract is
          what lets multiple TEL transfers execute in parallel without synchronous state conflicts.
        </p>
        <p className="proto-note">
          The documentation is candid that bridge dependencies are a risk for an early-stage chain, and
          points at recoverable token standards such as ERC-20R as a mitigation worth exploring.
        </p>

        <h4>One balance, two interfaces</h4>
        <p>
          The most distinctive divergence from Ethereum is a native ERC-20 interface for TEL exposed at
          precompile address <code>0x7e1</code>. Where Ethereum needs WETH to make ETH behave like a
          token, TEL is both the gas token and a standard ERC-20 at once:
        </p>
        <ul>
          <li><code>balanceOf()</code> returns the native account balance — there is one balance, not two.</li>
          <li>Native transfers and ERC-20 transfers move the same underlying funds.</li>
          <li>Full ERC-20 support plus EIP-2612 gasless approvals via <code>permit()</code>.</li>
          <li>Infinite allowances do not decrement on repeated transfers, as a gas optimisation.</li>
          <li>Transfers to <code>address(0)</code> revert.</li>
          <li>Native transfers emit no <code>Transfer</code> event; only ERC-20 calls do.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'proto-epochs',
    chip: 'Epochs',
    title: 'Epochs and committee selection',
    content: (
      <>
        <p>
          Consensus is organised into fixed-duration <b>epochs</b>, each run by a stable validator
          committee. Committee selection at an epoch boundary is deterministic but seeded by verifiable
          randomness:
        </p>
        <ol className="proto-steps">
          <li>Active validators are queried from the <code>ConsensusRegistry</code> contract.</li>
          <li>If there are too few, validators with <code>PendingExit</code> status are drawn on at random to fill the gaps.</li>
          <li>A 32-byte seed is derived as <code>keccak256(aggregated BLS signature)</code> of the final leader certificate.</li>
          <li>The list is shuffled with Fisher–Yates using that seed.</li>
          <li>The result is sorted by address for deterministic ordering.</li>
          <li>The committee is truncated to the target size and committed on-chain.</li>
        </ol>
        <p>
          Three operations run as system calls inside the final block of an epoch: <b>validator reward
          distribution</b> based on leader block counts, <b>committee selection and shuffling</b>, and
          <b> base fee adjustment</b>. They consume no block gas and surface only as state changes and
          modified header fields (<code>extra_data</code> and <code>withdrawals</code>).
        </p>
      </>
    ),
  },
  {
    id: 'proto-staking',
    chip: 'Staking',
    title: 'The membership model and becoming a validator',
    content: (
      <>
        <h4>Why membership rather than stake-weighting</h4>
        <p>
          The model is designed to grow the network by <b>adding nodes rather than enlarging them</b>.
          Under conventional stake-weighting an operator has no reason to run several nodes when
          concentrating stake on one earns the same. Requiring a fixed stake per node means an operator
          deploying more capital must launch more validators, each with &ldquo;its own keys, its own
          infrastructure, and its own ConsensusNFT.&rdquo;
        </p>
        <p>
          Rewards are weighted by header production, so uptime and reliability — not just capital —
          determine earnings. Because validators are mobile network operators vetted by governance, the
          ConsensusNFT whitelist supplies sybil resistance that a fixed stake alone could not.
        </p>

        <h4>Stake versions</h4>
        <p>
          Validators join under a <b>stake version</b>, each defining a <code>StakeConfig</code>:
          <code> stakeAmount</code>, <code>minWithdrawAmount</code>, <code>epochIssuance</code> and
          <code> epochDuration</code>. Governance can publish a new version with
          <code> upgradeStakeVersion()</code>, effective the next epoch. A validator&rsquo;s version is fixed
          at stake time — there is no in-place upgrade, only exit and rejoin.
        </p>
        <p>Rewards are settled at each epoch boundary:</p>
        <pre className="proto-code">{`weight = stakeAmount × consensusHeaderCount
reward = (epochIssuance × weight) / totalWeight`}</pre>
        <p>
          In a single-version committee the stake amount cancels out and rewards track header production
          alone. In a mixed committee a larger stake earns proportionally more per header, but a
          reliable smaller-stake validator can still out-earn an underperforming larger one.
        </p>

        <h4>Joining, in three transactions</h4>
        <p>
          Keys are generated with the <code>telcoin-network keytool</code>, producing a BLS keypair,
          network keypairs and a <code>node-info.yaml</code> carrying the public keys and proof of
          possession. Then, against the <code>ConsensusRegistry</code> system contract:
        </p>
        <ol className="proto-steps">
          <li>
            <b>Governance approval.</b> Governance mints a <code>ConsensusNFT</code> to the validator&rsquo;s
            ECDSA address via <code>mint(validatorAddress)</code>, whitelisting it.
          </li>
          <li>
            <b>Stake.</b> Call <code>stake()</code> with a 96-byte compressed BLS public key and a proof
            of possession (192-byte uncompressed key plus signature), sending <b>1,000,000 TEL</b> —
            the launch stake amount.
          </li>
          <li>
            <b>Activate.</b> Once the node has synced (checked with the <code>tn_syncing</code> RPC
            method), call <code>activate()</code>. The validator becomes eligible for committee selection
            at the next epoch boundary.
          </li>
        </ol>

        <div className="proto-table-wrap">
          <table className="proto-table">
            <caption>Validator lifecycle states</caption>
            <thead>
              <tr><th scope="col">Status</th><th scope="col">Meaning</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Undefined</code></td><td>Holds a ConsensusNFT but has not staked</td></tr>
              <tr><td><code>Staked</code></td><td>Staked but not yet activated</td></tr>
              <tr><td><code>PendingActivation</code></td><td>Called <code>activate()</code>, awaiting the epoch boundary</td></tr>
              <tr><td><code>Active</code></td><td>Eligible for committee selection</td></tr>
              <tr><td><code>PendingExit</code></td><td>Exit requested, outstanding committee obligations remain</td></tr>
              <tr><td><code>Exited</code></td><td>Can unstake after one epoch</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Exiting is <code>beginExit()</code>, then <code>unstake(validatorAddress)</code> after a full
          epoch to reclaim stake plus rewards.
        </p>
        <p className="proto-note">
          Contract addresses are deliberately not reproduced here. Always take them from the official
          documentation or an explorer immediately before use — address substitution is a common attack,
          and a community wiki is exactly where someone would try to plant a wrong one.
        </p>
      </>
    ),
  },
  {
    id: 'proto-fees',
    chip: 'Fees',
    title: 'Base fees, priority fees and the gas limit penalty',
    content: (
      <>
        <h4>An EIP-1559 fee market on an epoch clock</h4>
        <p>
          Telcoin Network uses an EIP-1559-style base fee, but adjusts it <b>at epoch boundaries rather
          than per block</b>. Within an epoch the base fee is static across every batch and transaction.
          At the boundary the protocol measures aggregate gas usage and recalibrates: unchanged if the
          target was met, up if exceeded, down if under, with <code>MAX_CHANGE_DENOMINATOR</code> capping
          the rate of change and a protocol-defined floor below which it cannot fall.
        </p>
        <p>
          The practical effect is fee stability: one <code>eth_gasPrice</code> call gives you the
          definitive base fee for the rest of the epoch, with none of Ethereum&rsquo;s block-to-block
          volatility.
        </p>

        <h4>Where the money goes</h4>
        <p>
          Transactions specify <code>maxFeePerGas</code> and <code>maxPriorityFeePerGas</code> exactly as
          on Ethereum. <b>Priority fees go to batch producers</b> whose transactions land in the final
          block. The <b>base fee does not leave the system</b> the way Ethereum&rsquo;s does — it is burned
          with an equivalent amount minted to the governance safe, so in net terms 100% of base fees
          accrue to governance reserves that fund future rewards.
        </p>

        <h4>The gas limit penalty</h4>
        <p>
          Because consensus orders transactions before they execute, actual gas usage is unknown at
          submission — which opens the door to declaring an enormous gas limit on a cheap transaction
          and wasting batch capacity. The penalty targets exactly that. It applies only when a
          transaction consumes <b>less than 10% of its declared limit</b>, and never to transactions with
          a gas limit of <b>210,000 or below</b>.
        </p>
        <pre className="proto-code">{`usage_ratio  = gas_used / gas_limit
inefficiency = 0.10 - usage_ratio
penalty_gas  = (inefficiency² / 0.10²) × unused_gas`}</pre>
        <div className="proto-table-wrap">
          <table className="proto-table">
            <caption>Penalty applied to unused gas</caption>
            <thead>
              <tr><th scope="col">Gas limit actually used</th><th scope="col">Penalty on the unused portion</th></tr>
            </thead>
            <tbody>
              <tr><td>9.9%</td><td>Negligible</td></tr>
              <tr><td>5%</td><td>~25%</td></tr>
              <tr><td>2%</td><td>~62%</td></tr>
              <tr><td>0.1%</td><td>&gt; 95%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The curve ramps gently near the threshold and steeply for extreme over-estimation. Penalties
          are deducted from the refund rather than added to the bill, so they never increase the total
          fee paid, and they go to the governance address.
        </p>
      </>
    ),
  },
  {
    id: 'proto-evm',
    chip: 'EVM compatibility',
    title: 'What is identical to Ethereum, and what is not',
    content: (
      <>
        <p>
          Compatibility is close to total: &ldquo;There are no custom opcodes, no modified gas costs, and no
          disabled instructions.&rdquo; Contracts deploy as they would on Ethereum, and Hardhat, Foundry,
          ethers.js and viem work unmodified.
        </p>
        <div className="proto-table-wrap">
          <table className="proto-table">
            <caption>Documented divergences</caption>
            <thead>
              <tr><th scope="col">Area</th><th scope="col">Difference</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>TEL precompile</td>
                <td>Native ERC-20 interface at <code>0x7e1</code>; gas token and token share one balance</td>
              </tr>
              <tr>
                <td>Base fee</td>
                <td>Collected by the governance address for protocol use rather than destroyed</td>
              </tr>
              <tr>
                <td>Transaction types</td>
                <td>Legacy, EIP-2930 and EIP-1559 supported; blob transactions (EIP-4844) not yet implemented</td>
              </tr>
              <tr>
                <td>Header fields</td>
                <td>
                  <code>nonce</code> encodes epoch and round, <code>difficulty</code> packs batch index
                  and worker ID, <code>mix_hash</code> carries consensus digests
                </td>
              </tr>
              <tr>
                <td>Chain IDs</td>
                <td>Mainnet <code>487</code>, testnet <code>2017</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="proto-note">
          The header fields matter if you are writing indexers or explorers: those slots carry
          consensus-layer metadata on Telcoin Network, not the proof-of-work values their names imply.
        </p>
      </>
    ),
  },
  {
    id: 'proto-security',
    chip: 'Security',
    title: 'The security model',
    content: (
      <>
        <p>
          The network &ldquo;remains secure so long as over 2/3 of the network&rsquo;s total stake is controlled
          by honest and non adversarial validators&rdquo; — the standard Byzantine fault tolerant threshold,
          here resting on a validator set of vetted mobile network operators.
        </p>
        <ul>
          <li>Private signature keys are required to authorise any transaction, and only asset owners can move their own holdings.</li>
          <li>Assets follow the rules written into their Solidity contracts by the contract creator.</li>
          <li>Finalised transactions create a permanent record that later operations build on.</li>
          <li>All network actions are publicly visible; users manage privacy by using multiple addresses.</li>
          <li>Aborted transactions still consume gas but leave state unchanged, which is what makes spam expensive.</li>
        </ul>
        <p>
          Smart contract deployment is permissionless, so the usual caution applies in full: interact
          only with contracts you trust and understand.
        </p>
      </>
    ),
  },
  {
    id: 'proto-node',
    chip: 'Running a node',
    title: 'Validator hardware requirements',
    content: (
      <>
        <p>
          These are carrier-grade requirements, and a fair signal of what the network expects of the
          operators securing it.
        </p>
        <div className="proto-table-wrap">
          <table className="proto-table">
            <caption>Published validator node specification</caption>
            <thead>
              <tr><th scope="col">Component</th><th scope="col">Minimum</th><th scope="col">Recommended</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>CPU</td>
                <td>x86/x64, 16 cores / 32 threads, 4000+ PassMark single-thread</td>
                <td>32 cores, higher clock prioritised</td>
              </tr>
              <tr>
                <td>Memory</td>
                <td>128 GB DDR4/DDR5 ECC registered DIMM</td>
                <td>128 GB or more at maximum speed</td>
              </tr>
              <tr>
                <td>Storage</td>
                <td>4 TB TLC NVMe SSD</td>
                <td>7.5 TB TLC NVMe SSD</td>
              </tr>
              <tr>
                <td>Bandwidth</td>
                <td>1000 Mb/s sustained, 1-Gigabit Ethernet</td>
                <td>1000+ Mb/s sustained, 10-Gigabit interface</td>
              </tr>
              <tr>
                <td>Operating system</td>
                <td colSpan={2}>Linux LTS — Debian 11+, Ubuntu 20.04+, RHEL 8; kernel 3.10 or newer</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="proto-note">
          Operators are asked to submit their specification to the Telcoin DevOps team for approval
          before installation, so the list above is a starting point for a conversation rather than a
          self-serve checklist.
        </p>
      </>
    ),
  },
  {
    id: 'proto-networks',
    chip: 'Networks',
    title: 'Networks and endpoints',
    content: (
      <>
        <div className="proto-table-wrap">
          <table className="proto-table">
            <caption>Published network parameters</caption>
            <thead>
              <tr><th scope="col">Parameter</th><th scope="col">Adiri testnet</th></tr>
            </thead>
            <tbody>
              <tr><td>Chain ID</td><td><code>0x7e1</code> (2017)</td></tr>
              <tr><td>Currency symbol</td><td>TEL</td></tr>
              <tr><td>Public RPC</td><td><code>https://rpc.adiri.tel</code></td></tr>
              <tr><td>Explorer</td><td><code>https://telscan.io</code></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Adiri is currently the only deployed network. The public RPC endpoint sits behind a load
          balancer and is intended for single transactions and read queries; sustained development work
          should connect to a node directly. The documentation warns the testnet may be reset before
          mainnet to accommodate protocol changes, so treat any state there as disposable.
        </p>
        <p className="proto-note">
          Chain ID <code>0x7e1</code> is 2017 in decimal — the year Telcoin was founded — and the same
          value appears again as the address of the TEL precompile.
        </p>
      </>
    ),
  },
  {
    id: 'proto-sources',
    chip: 'Documentation index',
    title: 'The full documentation set',
    content: (
      <>
        <p>
          Everything above is drawn from Telcoin&rsquo;s own published documentation. The index below maps the
          ecosystem&rsquo;s documentation surface so you can go to the primary source for anything that
          matters — this wiki is a community summary and can lag behind or get things wrong.
        </p>

        <h4>Protocol documentation — docs.telcoin.network</h4>
        <ul className="proto-links">
          <li><b>Architecture</b> — overview, native token, security, transaction lifecycle, consensus layer</li>
          <li><b>Getting started</b> — reading chain data (cURL, programmatic, libraries), dapp development, development tools, faucet, hardware requirements</li>
          <li><b>Networks and RPC endpoints</b> — endpoint and chain parameters</li>
          <li><b>RPC methods</b> — the full <code>eth_*</code> and <code>net_*</code> surface: accounts, chain info, contract and state reads, balances and gas, blocks, transactions, submission, logs</li>
          <li><b>Filter methods</b> — <code>eth_newFilter</code>, <code>eth_newBlockFilter</code>, <code>eth_newPendingTransactionFilter</code>, <code>eth_getFilterChanges</code>, <code>eth_getFilterLogs</code>, <code>eth_uninstallFilter</code></li>
          <li><b>Staking</b> — how staking works, why the membership model, how to stake, future direction</li>
          <li><b>Reference</b> — constants, stablecoin contracts, Adiri testnet</li>
          <li><b>Protocol topics</b> — basefees, gas limit penalty, EVM compatibility, epoch boundaries, canonical updates</li>
          <li><b>FAQs</b> — economic incentives and rewards</li>
        </ul>

        <h4>Governance documentation — telcoin.org</h4>
        <ul className="proto-links">
          <li><b>Association</b> — the non-profit Swiss Verein that governs the platform, and Telcoin Autonomous Ops (TAO)</li>
          <li><b>Participation</b> — how to take part, including the route for GSMA mobile networks</li>
          <li><b>Platform</b> — Telcoin Network, the TEL token, the TELx DeFi exchange, and the Telcoin Application Network</li>
          <li><b>Miners</b> — validators, liquidity miners, developers and stakers</li>
          <li><b>Association governance</b> — governance organisations, Miner Councils, the Miner Assembly, and association rules including harvesting rules</li>
        </ul>

        <h4>Other primary surfaces</h4>
        <ul className="proto-links">
          <li><b>telcoin.network</b> — network overview and faucet</li>
          <li><b>tnips.telcoin.network</b> — Telcoin Network Improvement Proposals</li>
          <li><b>roadmap.telcoin.network</b> — published roadmap</li>
          <li><b>forum.telcoin.org</b> — governance forum, proposals and council discussion</li>
          <li><b>github.com/Telcoin-Association</b> — <code>telcoin-network</code> (protocol) and <code>tn-contracts</code> (smart contracts)</li>
          <li><b>telscan.io</b> — block explorer</li>
        </ul>

        <p className="proto-note">
          Reviewed 16 August 2026 against docs.telcoin.network and telcoin.org. Figures such as the
          launch stake amount, chain IDs and hardware requirements are the values published at that
          date and are exactly the kind of thing that changes — check the source before relying on any
          of them.
        </p>
      </>
    ),
  },
]
