import { useCallback, useEffect, useMemo, useState } from 'react'

export interface ServiceStatus {
  id: string
  name: string
  status: string
  group?: string | null
}

export interface RoadmapStatusData {
  indicator: string
  description: string
  services: ServiceStatus[]
  updatedAt?: string
}

export interface RoadmapStatusState {
  data: RoadmapStatusData | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const DEFAULT_STATUS_URL = 'https://status.telco.in/api/v2/summary.json'
const DEFAULT_POLL_INTERVAL = 60_000

function resolveUrl(url: string | undefined) {
  const base = url?.trim().length ? url.trim() : DEFAULT_STATUS_URL
  if (/^https?:/i.test(base)) {
    return new URL(base)
  }
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://telcoin.io'
  return new URL(base, origin)
}

function normaliseStatus(value: unknown) {
  if (typeof value === 'string') {
    return value
  }
  return 'unknown'
}

function mapServices(payload: unknown): ServiceStatus[] {
  if (!Array.isArray(payload)) {
    return []
  }

  const results: ServiceStatus[] = []

  payload.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return
    }

    const record = item as Record<string, unknown>
    const id = typeof record.id === 'string' ? record.id : undefined
    const name = typeof record.name === 'string' ? record.name : undefined
    const status = typeof record.status === 'string' ? record.status : undefined
    const isGroup = typeof record.group === 'boolean' ? (record.group as boolean) : undefined

    if (!id || !name || !status || isGroup) {
      return
    }

    results.push({
      id,
      name,
      status,
      group:
        typeof record.group_id === 'string'
          ? record.group_id
          : typeof record.groupId === 'string'
            ? record.groupId
            : null,
    })
  })

  return results
}

export function useRoadmapStatus(): RoadmapStatusState {
  const statusUrl = useMemo(() => resolveUrl(import.meta.env.VITE_TEL_STATUS_URL), [])
  const pollMs = useMemo(() => {
    const envValue = import.meta.env.VITE_TEL_STATUS_POLL_MS
    const parsed = typeof envValue === 'string' ? Number.parseInt(envValue, 10) : Number.NaN
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_INTERVAL
  }, [])

  const [{ data, loading, error }, setState] = useState<Pick<RoadmapStatusState, 'data' | 'loading' | 'error'>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const response = await fetch(statusUrl.toString(), {
          headers: { Accept: 'application/json' },
          signal,
        })
        if (!response.ok) {
          throw new Error(`Status request failed: ${response.status}`)
        }
        const json = await response.json()
        const status = json.status ?? json.page?.status
        const indicator = normaliseStatus(status?.indicator ?? status)
        const description =
          typeof json.status?.description === 'string'
            ? json.status.description
            : typeof json.page?.status?.description === 'string'
              ? json.page.status.description
              : typeof json.page?.status === 'string'
                ? json.page.status
                : 'Current status unavailable.'
        const services = mapServices(json.components ?? json.services)
        const updatedAt =
          typeof json.page?.updated_at === 'string'
            ? json.page.updated_at
            : typeof json.page?.updatedAt === 'string'
              ? json.page.updatedAt
              : undefined

        setState({
          data: {
            indicator,
            description,
            services,
            updatedAt,
          },
          loading: false,
          error: null,
        })
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          return
        }
        setState({ data: null, loading: false, error: (err as Error).message || 'Unable to load status data.' })
      }
    },
    [statusUrl],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  }, [fetchData])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const interval = window.setInterval(() => {
      fetchData()
    }, pollMs)
    return () => window.clearInterval(interval)
  }, [fetchData, pollMs])

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
