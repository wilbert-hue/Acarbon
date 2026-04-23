/** Importing countries/regions available in Import Analysis & Import Pricing filters. */
export const IMPORTING_COUNTRY_OPTIONS = [
  'South Africa',
  'Ghana',
  'Mali',
  'Burkina Faso',
  'Tanzania',
  "Côte d'Ivoire",
  'Zimbabwe',
  'Democratic Republic of the Congo',
  'Guinea',
  'Sudan',
  'Russia',
  'Australia',
] as const

export type ImportingCountryOption = (typeof IMPORTING_COUNTRY_OPTIONS)[number]

export const DEFAULT_IMPORTING_COUNTRY: ImportingCountryOption = 'South Africa'

const OPTION_SET = new Set<string>(IMPORTING_COUNTRY_OPTIONS)

/** First selected geography that appears in the import list, else default. */
export function pickInitialImportingCountry(geographies: string[] | undefined): string {
  const list = geographies?.filter((g) => g !== 'Global') ?? []
  for (const name of list) {
    if (OPTION_SET.has(name)) return name
  }
  return DEFAULT_IMPORTING_COUNTRY
}
