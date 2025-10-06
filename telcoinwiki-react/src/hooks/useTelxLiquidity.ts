import { useCallback, useEffect, useMemo, useState } from 'react'

export interface TelxLiquiditySummary {
  poolCount: number
  totalLiquidityUsd: number | null
  stakedLiquidityUsd: number | null
  averageApr: number | null
  updatedAt?: string
}

export interface TelxLiquidityState {
  data: TelxLiquiditySummary | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const DEFAULT_TELX_URL = 'https://www.telx.network/api/pools.json'

type PoolLike = Record<string, unknown>

type AnyJson = Record<string, unknown>

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[$,%\s,]/g, '')
    const parsed = Number.parseFloat(cleaned)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function toInteger(value: unknown): number | null {
  const numeric = toNumber(value)
  if (numeric === null) {
    return null
  }
  return Number.isFinite(numeric) ? Math.round(numeric) : null
}

function resolvePools(payload: unknown): PoolLike[] {
  if (Array.isArray(payload)) {
    return payload as PoolLike[]
  }

  if (payload && typeof payload === 'object') {
    const candidates: unknown[] = []
    const container = payload as AnyJson
    const keys = ['pools', 'data', 'result', 'items', 'payload', 'records']

    for (const key of keys) {
      const value = container[key]
      if (Array.isArray(value)) {
        return value as PoolLike[]
      }
      if (value && typeof value === 'object') {
        candidates.push(value)
      }
    }

    for (const candidate of candidates) {
      const resolved = resolvePools(candidate)
      if (resolved.length) {
        return resolved
      }
    }
  }

  return []
}

function resolveUrl(url: string | undefined) {
  const base = url?.trim().length ? url.trim() : DEFAULT_TELX_URL
  if (/^https?:/i.test(base)) {
    return new URL(base)
  }
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://telcoin.io'
  return new URL(base, origin)
}

function summarizePools(pools: PoolLike[]): TelxLiquiditySummary {
  let poolCount = 0
  let liquidityTotal = 0
  let liquidityCount = 0
  let stakedTotal = 0
  let stakedCount = 0
  let aprTotal = 0
  let aprCount = 0
  let updatedAt: string | undefined

  for (const pool of pools) {
    if (!pool || typeof pool !== 'object') continue
    poolCount += 1
    const tvl =
      toNumber((pool as AnyJson).tvlUsd) ??
      toNumber((pool as AnyJson).tvlUSD) ??
      toNumber((pool as AnyJson).tvl) ??
      toNumber((pool as AnyJson).totalLiquidityUsd) ??
      toNumber((pool as AnyJson).totalLiquidityUSD) ??
      toNumber((pool as AnyJson).total_value_locked_usd) ??
      toNumber((pool as AnyJson).liquidityUsd)

    if (tvl !== null) {
      liquidityTotal += tvl
      liquidityCount += 1
    }

    const staked =
      toNumber((pool as AnyJson).stakedLiquidityUsd) ??
      toNumber((pool as AnyJson).stakedLiquidityUSD) ??
      toNumber((pool as AnyJson).stakedLiquidity) ??
      toNumber((pool as AnyJson).stakedUsd) ??
      toNumber((pool as AnyJson).staked)

    if (staked !== null) {
      stakedTotal += staked
      stakedCount += 1
    }

    const apr =
      toNumber((pool as AnyJson).apr) ??
      toNumber((pool as AnyJson).apy) ??
      toNumber((pool as AnyJson).rewardsApr) ??
      toNumber((pool as AnyJson).rewardsAPY)

    if (apr !== null) {
      aprTotal += apr
      aprCount += 1
    }

    if (!updatedAt) {
      const updated = (pool as AnyJson).updatedAt ?? (pool as AnyJson).lastUpdated ?? (pool as AnyJson).timestamp
      if (typeof updated === 'string' && updated.trim().length) {
        updatedAt = updated
      }
    }
  }

  const averageApr = aprCount ? aprTotal / aprCount : null

  return {
    poolCount,
    totalLiquidityUsd: liquidityCount ? liquidityTotal : null,
    stakedLiquidityUsd: stakedCount ? stakedTotal : null,
    averageApr,
    updatedAt,
  }
}

function resolveSummary(payload: unknown): TelxLiquiditySummary | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as AnyJson
  const totalLiquidity =
    toNumber(record.totalLiquidityUsd) ??
    toNumber(record.totalLiquidityUSD) ??
    toNumber(record.totalLiquidity) ??
    toNumber(record.tvlUsd) ??
    toNumber(record.tvlUSD) ??
    toNumber(record.tvl)
  const stakedLiquidity =
    toNumber(record.stakedLiquidityUsd) ??
    toNumber(record.stakedLiquidityUSD) ??
    toNumber(record.stakedLiquidity) ??
    toNumber(record.stakedTotal) ??
    toNumber(record.staked)
  const averageApr =
    toNumber(record.averageApr) ??
    toNumber(record.avgApr) ??
    toNumber(record.averageAPR) ??
    toNumber(record.avgAprPercent) ??
    toNumber(record.apr) ??
    toNumber(record.apy)
  const poolCount =
    toInteger(record.poolCount) ??
    toInteger(record.totalPools) ??
    (Array.isArray(record.pools) ? record.pools.length : null)
  const updatedAt =
    (typeof record.updatedAt === 'string' && record.updatedAt) ||
    (typeof record.lastUpdated === 'string' && record.lastUpdated) ||
    undefined

  if (
    totalLiquidity === null &&
    stakedLiquidity === null &&
    averageApr === null &&
    (poolCount === null || poolCount === 0)
  ) {
    return null
  }

  return {
    poolCount: poolCount ?? 0,
    totalLiquidityUsd: totalLiquidity,
    stakedLiquidityUsd: stakedLiquidity,
    averageApr,
    updatedAt,
  }
}

export function useTelxLiquidity(): TelxLiquidityState {
  const url = useMemo(() => resolveUrl(import.meta.env.VITE_TELX_STATS_URL), [])
  const [{ data, loading, error }, setState] = useState<Pick<TelxLiquidityState, 'data' | 'loading' | 'error'>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const response = await fetch(url.toString(), {
          headers: { Accept: 'application/json' },
          signal,
        })

        if (!response.ok) {
          throw new Error(`TELx stats request failed: ${response.status}`)
        }

        const json = await response.json()
        const pools = resolvePools(json)
        let summary: TelxLiquiditySummary | null = null

        if (pools.length) {
          summary = summarizePools(pools)
        }

        if (!summary || (summary.poolCount === 0 && summary.totalLiquidityUsd === null)) {
          summary =
            resolveSummary(json) ??
            resolveSummary((json as AnyJson).data) ??
            resolveSummary((json as AnyJson).summary) ??
            resolveSummary((json as AnyJson).result)
        }

        if (!summary) {
          throw new Error('No TELx pools returned')
        }

        setState({ data: summary, loading: false, error: null })
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          return
        }
        setState({ data: null, loading: false, error: (err as Error).message || 'Unable to load TELx liquidity data.' })
      }
    },
    [url],
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
