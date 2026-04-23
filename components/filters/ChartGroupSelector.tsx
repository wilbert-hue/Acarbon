'use client'

import { useDashboardStore } from '@/lib/store'
import { CHART_GROUPS } from '@/lib/chart-groups'
import {
  BarChart3,
  Target,
  Users,
  Building2,
  Globe2,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'
import { INTELLIGENCE_PANEL_NAV, type IntelligencePanelId } from '@/lib/intelligence-panel'

const DemandIcon = BarChart3
const OpportunityIcon = Target

const intelligenceIcons: Record<IntelligencePanelId, LucideIcon> = {
  'customer-intelligence': Users,
  'distributor-intelligence': Building2,
  'import-analysis': Globe2,
  'import-pricing': DollarSign,
}

export function ChartGroupSelector() {
  const { selectedChartGroup, setSelectedChartGroup, intelligencePanel, setIntelligencePanel } = useDashboardStore()

  const opportunityGroup = CHART_GROUPS.find((g) => g.id === 'coherent-opportunity')!
  const marketGroup = CHART_GROUPS.find((g) => g.id === 'market-analysis')!

  const sidebarDescription =
    intelligencePanel != null
      ? INTELLIGENCE_PANEL_NAV.find((p) => p.id === intelligencePanel)?.description ?? ''
      : selectedChartGroup === 'market-analysis'
        ? marketGroup.description
        : opportunityGroup.description

  const pillClass = (active: boolean) =>
    `w-full text-left px-2 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2 ${
      active
        ? 'bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white shadow-sm'
        : 'hover:bg-gray-50 text-black'
    }`

  const iconClass = (active: boolean) =>
    `w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-600'}`

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold text-black">Chart View</h3>

      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setSelectedChartGroup('market-analysis')}
          className={pillClass(intelligencePanel === null && selectedChartGroup === 'market-analysis')}
          title={marketGroup.description}
        >
          <DemandIcon className={iconClass(intelligencePanel === null && selectedChartGroup === 'market-analysis')} />
          <span className="text-xs font-medium leading-tight">Demand Analysis</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedChartGroup('coherent-opportunity')}
          className={pillClass(intelligencePanel === null && selectedChartGroup === 'coherent-opportunity')}
          title={opportunityGroup.description}
        >
          <OpportunityIcon
            className={iconClass(intelligencePanel === null && selectedChartGroup === 'coherent-opportunity')}
          />
          <span className="text-xs font-medium leading-tight">
            Coherent Opportunity
            <br />
            Matrix
          </span>
        </button>

        {INTELLIGENCE_PANEL_NAV.map((panel) => {
          const Icon = intelligenceIcons[panel.id]
          const active = intelligencePanel === panel.id
          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => setIntelligencePanel(panel.id)}
              className={pillClass(active)}
              title={panel.description}
            >
              <Icon className={iconClass(active)} />
              <span className="text-xs font-medium leading-tight">{panel.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-2 border-t border-gray-100 pt-2">
        <p className="text-[10px] leading-snug text-gray-600">{sidebarDescription}</p>
      </div>
    </div>
  )
}
