/**
 * Deterministic mock import tables keyed by selected importing market.
 * Keeps the same supplier countries but varies magnitudes / shares per importer.
 */

export type ImportAnalysisSupplyRow = {
  country: string
  usdMn: readonly [number, number, number, number]
  tons: readonly [number, number, number, number]
  cagr: number
  share: number
}

const BASE_IMPORT_ANALYSIS: Omit<ImportAnalysisSupplyRow, 'share'>[] = [
  { country: 'China', usdMn: [21.5, 22.8, 24.1, 24.5], tons: [5800, 6100, 6400, 6550], cagr: 9.4 },
  { country: 'India', usdMn: [15.2, 16.1, 17.0, 17.4], tons: [4100, 4350, 4580, 4680], cagr: 12.4 },
  { country: 'United States', usdMn: [9.8, 10.2, 10.6, 11.0], tons: [2650, 2750, 2850, 2920], cagr: 8.1 },
  { country: 'Netherlands', usdMn: [6.2, 6.5, 6.8, 7.0], tons: [1680, 1750, 1820, 1880], cagr: 7.2 },
  { country: 'Japan', usdMn: [4.8, 5.0, 5.2, 5.4], tons: [1290, 1340, 1390, 1420], cagr: 6.5 },
]

export type ImportPricingRow = {
  country: string
  price22: number
  price23: number
  price24: number
  price25: number
  changePct: number
  tag?: 'lowest' | 'highest'
}

const BASE_PRICING: Omit<ImportPricingRow, 'tag' | 'changePct'>[] = [
  { country: 'China', price22: 2980, price23: 3050, price24: 3120, price25: 3215 },
  { country: 'India', price22: 3020, price23: 3100, price24: 3180, price25: 3280 },
  { country: 'United States', price22: 3180, price23: 3240, price24: 3320, price25: 3420 },
  { country: 'Netherlands', price22: 3220, price23: 3300, price24: 3380, price25: 3480 },
  { country: 'Japan', price22: 3350, price23: 3450, price24: 3560, price25: 3675 },
]

function fnv1a(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function getImportAnalysisSupplyingRows(importer: string): ImportAnalysisSupplyRow[] {
  const rand = mulberry32(fnv1a(`import-analysis|${importer}`))
  const marketFactor = 0.62 + rand() * 0.72
  const rows = BASE_IMPORT_ANALYSIS.map((base) => {
    const rowFactor = 0.88 + rand() * 0.26
    const f = marketFactor * rowFactor
    const usdMn = base.usdMn.map((x) => Math.round(x * f * 10) / 10) as [number, number, number, number]
    const tons = base.tons.map((x) => Math.round(x * f)) as [number, number, number, number]
    const cagr = Math.round(Math.min(18, Math.max(4, base.cagr * (0.92 + rand() * 0.2))) * 10) / 10
    return { country: base.country, usdMn, tons, cagr, share: 0 }
  })
  const lastSum = rows.reduce((s, r) => s + r.usdMn[3], 0)
  return rows.map((r) => ({
    ...r,
    share: lastSum > 0 ? Math.round((r.usdMn[3] / lastSum) * 1000) / 10 : 0,
  }))
}

export function getImportPricingRows(importer: string): ImportPricingRow[] {
  const rand = mulberry32(fnv1a(`import-pricing|${importer}`))
  const marketShift = 0.94 + rand() * 0.14
  const withPrices = BASE_PRICING.map((b) => {
    const rowShift = 0.96 + rand() * 0.1
    const m = marketShift * rowShift
    const price22 = Math.round(b.price22 * m)
    const price23 = Math.round(b.price23 * m)
    const price24 = Math.round(b.price24 * m)
    const price25 = Math.round(b.price25 * m)
    const changePct = Math.round(((price25 / price22 - 1) * 100) * 10) / 10
    return { country: b.country, price22, price23, price24, price25, changePct }
  })
  let minI = 0
  let maxI = 0
  withPrices.forEach((r, i) => {
    if (r.price25 < withPrices[minI].price25) minI = i
    if (r.price25 > withPrices[maxI].price25) maxI = i
  })
  return withPrices.map((r, i) => ({
    ...r,
    tag: i === minI ? 'lowest' : i === maxI ? 'highest' : undefined,
  }))
}
