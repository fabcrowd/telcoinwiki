import { useMemo } from 'react'
import { useTelxLiquidity } from '../../hooks/useTelxLiquidity'

function formatUsd(value: number | null) {
  if (value === null) {
    return 'Not reported'
  }
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
  } catch (error) {
    return `$${value.toFixed(0)}`
  }
}

function formatPercent(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return 'Not reported'
  }
  return `${value.toFixed(2)}%`
}

export function TelxLiquidityPanel() {
  const { data, loading, error } = useTelxLiquidity()

  const formattedUpdate = useMemo(() => {
    if (!data?.updatedAt) return null
    const timestamp = Date.parse(data.updatedAt)
    if (Number.isNaN(timestamp)) {
      return data.updatedAt
    }
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [data?.updatedAt])

  return (
    <article className="card wallet-overview-panel" role="listitem">
      <div className="card__meta">TELx Liquidity</div>
      <h3 className="card__title">Program health</h3>
      {loading && <p className="wallet-overview-panel__status">Fetching liquidity totals…</p>}
      {error && !loading && <p className="wallet-overview-panel__status">{error}</p>}
      {!loading && !error && data && (
        <div className="wallet-overview-panel__content">
          <dl className="wallet-overview-panel__metrics">
            <div>
              <dt>Total liquidity</dt>
              <dd>{formatUsd(data.totalLiquidityUsd)}</dd>
            </div>
            <div>
              <dt>Staked liquidity</dt>
              <dd>{formatUsd(data.stakedLiquidityUsd)}</dd>
            </div>
            <div>
              <dt>Average APR</dt>
              <dd>{formatPercent(data.averageApr)}</dd>
            </div>
          </dl>
          <p className="wallet-overview-panel__footnote" aria-live="polite">
            Tracking {data.poolCount} {data.poolCount === 1 ? 'pool' : 'pools'}
            {formattedUpdate ? ` • Updated ${formattedUpdate}` : ''}
          </p>
        </div>
      )}
      {!loading && !error && !data && (
        <p className="wallet-overview-panel__status">TELx pool data is not available right now.</p>
      )}
    </article>
  )
}
