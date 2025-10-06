import { RoadmapStatusPanel } from './RoadmapStatusPanel'
import { TelPriceChartPanel } from './TelPriceChartPanel'
import { TelxLiquidityPanel } from './TelxLiquidityPanel'

export function WalletOverviewPanels() {
  return (
    <div className="card-grid card-grid--cols-3 wallet-overview-panels" role="list">
      <TelPriceChartPanel />
      <TelxLiquidityPanel />
      <RoadmapStatusPanel />
    </div>
  )
}
