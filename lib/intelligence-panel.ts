export type IntelligencePanelId =
  | 'customer-intelligence'
  | 'distributor-intelligence'
  | 'import-analysis'
  | 'import-pricing'

export const INTELLIGENCE_PANEL_IDS: IntelligencePanelId[] = [
  'customer-intelligence',
  'distributor-intelligence',
  'import-analysis',
  'import-pricing',
]

export const INTELLIGENCE_PANEL_NAV: {
  id: IntelligencePanelId
  label: string
  description: string
}[] = [
  {
    id: 'customer-intelligence',
    label: 'Customer Intelligence (130-150 customers)',
    description: 'Key customer profiles and procurement details',
  },
  {
    id: 'distributor-intelligence',
    label: 'Distributor Intelligence (80-100 distributors)',
    description: 'Key distributor profiles and product portfolios',
  },
  {
    id: 'import-analysis',
    label: 'Import Analysis',
    description: 'Imports by regions and supplying countries',
  },
  {
    id: 'import-pricing',
    label: 'Import Pricing',
    description: 'Import pricing by regions and supplying countries',
  },
]

export function isIntelligencePanelId(value: string | null): value is IntelligencePanelId {
  return INTELLIGENCE_PANEL_IDS.includes(value as IntelligencePanelId)
}
