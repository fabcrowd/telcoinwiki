import { useCallback, useEffect, useMemo, useState } from 'react'

export type MarketDataPoint = [timestamp: number, value: number]

export interface TelMarketChartData {
  prices: MarketDataPoint[]
  totalVolumes: MarketDataPoint[]
  marketCaps?: MarketDataPoint[]
  fetchedAt: Date
}

export interface TelMarketChartState {
  data: TelMarketChartData | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export interface TelMarketChartOptions {
  days?: number
  vsCurrency?: string
  interval?: 'hourly' | 'daily'
  sourceUrl?: string
}

const DEFAULT_SOURCE_URL = 'https://api.coingecko.com/api/v3/coins/telcoin/market_chart'

function resolveUrl(url: string | undefined) {
  const base = url?.trim().length ? url.trim() : DEFAULT_SOURCE_URL
  if (/^https?:/i.test(base)) {
    return new URL(base)
  }
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://telcoin.io'
  return new URL(base, origin)
}

export function useTelMarketChart(options: TelMarketChartOptions = {}): TelMarketChartState {
  const days = options.days ?? 7
  const vsCurrency = (options.vsCurrency ?? import.meta.env.VITE_TEL_MARKET_CHART_CURRENCY ?? 'usd').toLowerCase()
  const interval = options.interval ?? (days <= 7 ? 'hourly' : 'daily')
  const url = useMemo(() => resolveUrl(options.sourceUrl ?? import.meta.env.VITE_TEL_MARKET_CHART_URL), [options.sourceUrl])

  const [{ data, loading, error }, setState] = useState<Pick<TelMarketChartState, 'data' | 'loading' | 'error'>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const requestUrl = new URL(url.toString())
        requestUrl.searchParams.set('vs_currency', vsCurrency)
        requestUrl.searchParams.set('days', String(days))
        if (!requestUrl.searchParams.has('interval')) {
          requestUrl.searchParams.set('interval', interval)
        }

        const response = await fetch(requestUrl.toString(), {
          headers: {
            Accept: 'application/json',
          },
          signal,
        })

        if (!response.ok) {
          throw new Error(`Chart request failed: ${response.status}`)
        }

        const json = (await response.json()) as Partial<TelMarketChartData>
        const prices = Array.isArray(json.prices) ? (json.prices as MarketDataPoint[]) : []
        const totalVolumes = Array.isArray(json.total_volumes)
          ? (json.total_volumes as MarketDataPoint[])
          : Array.isArray(json.totalVolumes)
            ? (json.totalVolumes as MarketDataPoint[])
            : []
        const marketCaps = Array.isArray(json.market_caps)
          ? (json.market_caps as MarketDataPoint[])
          : Array.isArray(json.marketCaps)
            ? (json.marketCaps as MarketDataPoint[])
            : undefined

        if (!prices.length) {
          throw new Error('Chart data is empty')
        }

        setState({
          data: {
            prices,
            totalVolumes,
            marketCaps,
            fetchedAt: new Date(),
          },
          loading: false,
          error: null,
        })
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          return
        }
        setState({ data: null, loading: false, error: (err as Error).message || 'Unable to load TEL market data.' })
      }
    },
    [days, interval, url, vsCurrency],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  }, [fetchData])

  const refresh = useCallback(async () => {
    const controller = new AbortController()
    try {
      await fetchData(controller.signal)
    } finally {
      controller.abort()
    }
  }, [fetchData])

  return { data, loading, error, refresh }
}
