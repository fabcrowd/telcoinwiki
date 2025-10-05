type PoolStatus = 'Active' | 'Deprecated' | 'Archived'

interface PoolRow {
  pair: string
  status: PoolStatus
  tvl: { value: string; change?: string }
  staked: { value: string; change?: string }
  volume: { value: string; change?: string }
  fees: { value: string; change?: string }
  rewards: string
}

const samplePools: PoolRow[] = [
  {
    pair: 'TEL / eUSD',
    status: 'Active',
    tvl: { value: '$8.2M', change: '+3.4%' },
    staked: { value: '52.1M TEL', change: '+1.2%' },
    volume: { value: '$412K', change: '+5.6%' },
    fees: { value: '$18.4K', change: '+2.1%' },
    rewards: 'TEL incentives live',
  },
  {
    pair: 'TEL / eCAD',
    status: 'Active',
    tvl: { value: '$2.9M', change: '+0.8%' },
    staked: { value: '18.7M TEL', change: '+0.6%' },
    volume: { value: '$96K', change: '-1.4%' },
    fees: { value: '$4.1K', change: '-0.5%' },
    rewards: 'Lifecycle: Active',
  },
  {
    pair: 'TEL / MATIC',
    status: 'Deprecated',
    tvl: { value: '$740K', change: '-8.3%' },
    staked: { value: '5.2M TEL', change: '-4.7%' },
    volume: { value: '$28K', change: '-6.1%' },
    fees: { value: '$1.2K', change: '-2.4%' },
    rewards: 'Migrate before sunset',
  },
]

const statusClassMap: Record<PoolStatus, string> = {
  Active: 'tc-chip is-active',
  Deprecated: 'tc-chip is-deprecated',
  Archived: 'tc-chip is-archived',
}

const statusLabelMap: Record<PoolStatus, string> = {
  Active: 'Active',
  Deprecated: 'Deprecated',
  Archived: 'Archived',
}

const getChangeClass = (change?: string): string | undefined => {
  if (!change) return undefined
  if (change.trim().startsWith('-')) {
    return 'value-change negative'
  }
  if (change.trim().startsWith('+')) {
    return 'value-change positive'
  }
  return 'value-change neutral'
}

export function TelxPoolsTable() {
  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">Design-time TELx pool metrics</caption>
        <thead>
          <tr>
            <th scope="col">Pool</th>
            <th scope="col">Status</th>
            <th scope="col">TVL</th>
            <th scope="col">Staked</th>
            <th scope="col">Volume (24h)</th>
            <th scope="col">Fees (24h)</th>
            <th scope="col">Rewards</th>
          </tr>
        </thead>
        <tbody>
          {samplePools.map((pool) => (
            <tr key={pool.pair}>
              <td>
                <p className="table-name">{pool.pair}</p>
              </td>
              <td>
                <span className={statusClassMap[pool.status]}>{statusLabelMap[pool.status]}</span>
              </td>
              <td>
                <p className="metric-value">{pool.tvl.value}</p>
                {pool.tvl.change ? <p className={getChangeClass(pool.tvl.change)}>{pool.tvl.change}</p> : null}
              </td>
              <td>
                <p className="metric-value">{pool.staked.value}</p>
                {pool.staked.change ? <p className={getChangeClass(pool.staked.change)}>{pool.staked.change}</p> : null}
              </td>
              <td>
                <p className="metric-value">{pool.volume.value}</p>
                {pool.volume.change ? <p className={getChangeClass(pool.volume.change)}>{pool.volume.change}</p> : null}
              </td>
              <td>
                <p className="metric-value">{pool.fees.value}</p>
                {pool.fees.change ? <p className={getChangeClass(pool.fees.change)}>{pool.fees.change}</p> : null}
              </td>
              <td>
                <p className="table-note">{pool.rewards}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
