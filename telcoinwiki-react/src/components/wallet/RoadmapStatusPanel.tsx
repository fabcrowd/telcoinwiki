import { useMemo } from 'react'
import { useRoadmapStatus } from '../../hooks/useRoadmapStatus'

const STATUS_LABELS: Record<string, string> = {
  operational: 'Operational',
  none: 'Operational',
  maintenance: 'Maintenance',
  degraded_performance: 'Degraded',
  partial_outage: 'Partial outage',
  major_outage: 'Major outage',
  minor_outage: 'Minor outage',
  incident: 'Incident',
  unknown: 'Unknown',
}

const STATUS_CLASSES: Record<string, string> = {
  operational: 'status-chip--operational',
  none: 'status-chip--operational',
  maintenance: 'status-chip--maintenance',
  degraded_performance: 'status-chip--degraded',
  partial_outage: 'status-chip--partial',
  major_outage: 'status-chip--major',
  minor_outage: 'status-chip--partial',
  incident: 'status-chip--incident',
  unknown: 'status-chip--unknown',
}

function getStatusLabel(status: string) {
  return STATUS_LABELS[status] ?? status.replace(/_/g, ' ')
}

function getStatusClass(status: string) {
  return STATUS_CLASSES[status] ?? 'status-chip--unknown'
}

export function RoadmapStatusPanel() {
  const { data, loading, error } = useRoadmapStatus()

  const services = useMemo(() => {
    if (!data?.services?.length) {
      return []
    }

    return [...data.services].sort((a, b) => {
      const aIsWallet = /wallet/i.test(a.name)
      const bIsWallet = /wallet/i.test(b.name)
      if (aIsWallet && !bIsWallet) return -1
      if (!aIsWallet && bIsWallet) return 1
      return a.name.localeCompare(b.name)
    })
  }, [data?.services])

  const updatedAt = useMemo(() => {
    if (!data?.updatedAt) return null
    const timestamp = Date.parse(data.updatedAt)
    if (Number.isNaN(timestamp)) {
      return data.updatedAt
    }
    return new Date(timestamp).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    })
  }, [data?.updatedAt])

  return (
    <article className="card wallet-overview-panel" role="listitem">
      <div className="card__meta">Roadmap &amp; status</div>
      <h3 className="card__title">Live service indicators</h3>
      {loading && <p className="wallet-overview-panel__status">Checking component status…</p>}
      {error && !loading && <p className="wallet-overview-panel__status">{error}</p>}
      {!loading && !error && data && (
        <div className="wallet-overview-panel__content">
          <p className="wallet-overview-panel__status-summary">
            {getStatusLabel(data.indicator)} • {data.description}
          </p>
          {services.length > 0 ? (
            <ul className="wallet-overview-status-list">
              {services.map((service) => (
                <li key={service.id}>
                  <span className={`status-chip ${getStatusClass(service.status)}`}>{getStatusLabel(service.status)}</span>
                  <span className="wallet-overview-status-list__label">{service.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="wallet-overview-panel__status">No public component statuses are reported.</p>
          )}
          {updatedAt && <p className="wallet-overview-panel__footnote">Updated {updatedAt}</p>}
        </div>
      )}
      {!loading && !error && !data && (
        <p className="wallet-overview-panel__status">Service status is currently unavailable.</p>
      )}
    </article>
  )
}
