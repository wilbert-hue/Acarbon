/**
 * Canonical geography / market list for the dashboard (sidebar, import views, intelligence filters).
 * Order matches stakeholder reference.
 */
export const DASHBOARD_GEOGRAPHY_OPTIONS = [
  'U.S.',
  'Sri Lanka',
  'Russia',
  'Ghana',
  'South Africa',
  'Germany',
  'Türkiye',
  'Sudan',
  'Japan',
  'China',
  'Belgium',
  'South Korea',
  'Egypt',
  'Malaysia',
  'Canada',
  'UAE',
  'Netherlands',
  'U.K.',
  'France',
  'Indonesia',
  'Rest Of World',
] as const

export type DashboardGeography = (typeof DASHBOARD_GEOGRAPHY_OPTIONS)[number]

/** Alias for import analysis / pricing (same list). */
export const IMPORTING_COUNTRY_OPTIONS = DASHBOARD_GEOGRAPHY_OPTIONS

export const DEFAULT_DASHBOARD_GEOGRAPHY: string = DASHBOARD_GEOGRAPHY_OPTIONS[0]

const OPTION_SET = new Set<string>(DASHBOARD_GEOGRAPHY_OPTIONS)

/** Last segment of "City, Country" headquarters lines. */
export function countryFromHeadquarters(headquarters: string): string {
  const parts = headquarters.split(',').map((s) => s.trim()).filter(Boolean)
  return parts.length ? parts[parts.length - 1]! : ''
}

export function isDashboardGeography(name: string): boolean {
  return OPTION_SET.has(name)
}

/** First sidebar geography that appears in the dashboard list, else default. */
export function pickInitialGeographyFilter(geographies: string[] | undefined): string {
  const list = geographies?.filter((g) => g !== 'Global') ?? []
  for (const name of list) {
    if (OPTION_SET.has(name)) return name
  }
  return DEFAULT_DASHBOARD_GEOGRAPHY
}
