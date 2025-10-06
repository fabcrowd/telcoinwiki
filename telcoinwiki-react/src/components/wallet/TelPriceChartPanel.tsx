import { useMemo } from 'react'
import { useTelMarketChart } from '../../hooks/useTelMarketChart'

function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value)
  } catch (error) {
    return `$${value.toFixed(value < 1 ? 4 : 2)}`
  }
}

function formatNumber(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toFixed(0)
}

function usePriceMetrics() {
  const { data, loading, error } = useTelMarketChart()

  const metrics = useMemo(() => {
    if (!data?.prices?.length) {
      return null
    }
    const prices = data.prices
    const volumes = data.totalVolumes ?? []
    const latestPrice = prices[prices.length - 1][1]
    const firstPrice = prices[0][1]
    const change = firstPrice ? ((latestPrice - firstPrice) / firstPrice) * 100 : null
    const volumeWindow = volumes.slice(-24)
    const totalVolume = volumeWindow.reduce((sum, [, value]) => sum + (typeof value === 'number' ? value : 0), 0)

    const minPrice = Math.min(...prices.map(([, value]) => value))
    const maxPrice = Math.max(...prices.map(([, value]) => value))

    const chartPath = prices
      .map(([, value], index) => {
        if (maxPrice === minPrice) {
          const y = 50
          const x = (index / (prices.length - 1 || 1)) * 100
          return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y}`
        }
        const x = (index / (prices.length - 1 || 1)) * 100
        const y = 100 - ((value - minPrice) / (maxPrice - minPrice)) * 100
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ')

    return {
      latestPrice,
      change,
      totalVolume,
      minPrice,
      maxPrice,
      chartPath,
      fetchedAt: data.fetchedAt,
    }
  }, [data])

  return { loading, error, metrics }
}

export function TelPriceChartPanel() {
  const { loading, error, metrics } = usePriceMetrics()
  const currency = (import.meta.env.VITE_TEL_MARKET_CHART_CURRENCY ?? 'usd').toUpperCase()

  return (
    <article className="card wallet-overview-panel" role="listitem">
      <div className="card__meta">Market overview</div>
      <h3 className="card__title">TEL price &amp; volume</h3>
      {loading && <p className="wallet-overview-panel__status">Loading latest chart…</p>}
      {error && !loading && <p className="wallet-overview-panel__status">{error}</p>}
      {!loading && !error && metrics && (
        <div className="wallet-overview-panel__content">
          <div className="wallet-overview-panel__headline">
            <p className="wallet-overview-panel__value">{formatCurrency(metrics.latestPrice, currency)}</p>
            {metrics.change !== null && Number.isFinite(metrics.change) && (
              <p
                className={`wallet-overview-panel__delta ${metrics.change >= 0 ? 'is-positive' : 'is-negative'}`}
                aria-live="polite"
              >
                {metrics.change >= 0 ? '+' : ''}
                {metrics.change.toFixed(2)}%
              </p>
            )}
          </div>
          <div className="wallet-overview-panel__chart" role="img" aria-label="Seven day TEL price trend">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tel-price-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(57, 174, 255, 0.6)" />
                  <stop offset="100%" stopColor="rgba(57, 174, 255, 0.05)" />
                </linearGradient>
              </defs>
              <path d={metrics.chartPath} fill="none" stroke="var(--tc-accent)" strokeWidth="1.5" />
              <path d={`${metrics.chartPath} L100,100 L0,100 Z`} fill="url(#tel-price-gradient)" opacity="0.25" />
            </svg>
          </div>
          <dl className="wallet-overview-panel__metrics">
            <div>
              <dt>24h volume</dt>
              <dd>
                {metrics.totalVolume && metrics.totalVolume > 0
                  ? `${formatNumber(metrics.totalVolume)} ${currency}`
                  : 'Not reported'}
              </dd>
            </div>
            <div>
              <dt>Range</dt>
              <dd>
                {formatCurrency(metrics.minPrice, currency)} – {formatCurrency(metrics.maxPrice, currency)}
              </dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{metrics.fetchedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? 'Just now'}</dd>
            </div>
          </dl>
        </div>
      )}
      {!loading && !error && !metrics && (
        <p className="wallet-overview-panel__status">Live market data is currently unavailable.</p>
      )}
    </article>
  )
}
