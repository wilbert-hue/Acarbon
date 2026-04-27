'use client'

import { useMemo, useState } from 'react'
import { useDashboardStore } from '@/lib/store'
import { TrendingUp, Minus } from 'lucide-react'
import { pickInitialGeographyFilter } from '@/lib/dashboard-geographies'
import { ImportingCountrySelect } from '@/components/intelligence/ImportingCountrySelect'
import { getImportPricingRows } from '@/lib/import-intelligence-mock'

function TrendGlyph({ changePct }: { changePct: number }) {
  if (changePct >= 8.5) return <TrendingUp className="mx-auto h-4 w-4 text-green-600" />
  if (changePct <= 7.8) return <Minus className="mx-auto h-4 w-4 text-gray-400" />
  return <TrendingUp className="mx-auto h-4 w-4 text-amber-600" />
}

export function ImportPricingView() {
  const [importingCountry, setImportingCountry] = useState(() =>
    pickInitialGeographyFilter(useDashboardStore.getState().filters.geographies)
  )

  const rows = useMemo(() => getImportPricingRows(importingCountry), [importingCountry])
  const avg2025 = rows.reduce((s, r) => s + r.price25, 0) / rows.length
  const lowest = rows.find((r) => r.tag === 'lowest')!
  const highest = rows.find((r) => r.tag === 'highest')!
  const spread = highest.price25 - lowest.price25
  const spreadPct = ((spread / lowest.price25) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-black">
          Import Pricing (US$ / Ton), by Regions / Supplying Countries (2022–2025)
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <ImportingCountrySelect value={importingCountry} onChange={setImportingCountry} />
        <span className="rounded-full bg-[#E8F5F4] px-3 py-1 text-xs font-medium text-[#1a6b63]">
          {rows.length} supplying countries
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-black">
          <thead>
            <tr className="bg-[#f0f9f8]">
              <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold">Supplying Country</th>
              <th className="border-b border-gray-200 px-2 py-2 text-right font-semibold">2022 (US$/Ton)</th>
              <th className="border-b border-gray-200 px-2 py-2 text-right font-semibold">2023 (US$/Ton)</th>
              <th className="border-b border-gray-200 px-2 py-2 text-right font-semibold">2024 (US$/Ton)</th>
              <th className="border-b border-gray-200 px-2 py-2 text-right font-semibold">2025 (US$/Ton)</th>
              <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">Change (%)</th>
              <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.country} className="hover:bg-gray-50">
                <td className="border-b border-gray-100 px-3 py-2 font-medium">
                  <span className="inline-flex items-center gap-2">
                    {row.country}
                    {row.tag === 'lowest' && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-800">
                        Lowest
                      </span>
                    )}
                    {row.tag === 'highest' && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-800">
                        Highest
                      </span>
                    )}
                  </span>
                </td>
                <td className="border-b border-gray-100 px-2 py-2 text-right">${row.price22.toLocaleString()}</td>
                <td className="border-b border-gray-100 px-2 py-2 text-right">${row.price23.toLocaleString()}</td>
                <td className="border-b border-gray-100 px-2 py-2 text-right">${row.price24.toLocaleString()}</td>
                <td className="border-b border-gray-100 px-2 py-2 text-right font-medium">${row.price25.toLocaleString()}</td>
                <td className="border-b border-gray-100 px-2 py-2 text-center">{row.changePct.toFixed(1)}%</td>
                <td className="border-b border-gray-100 px-2 py-2">
                  <TrendGlyph changePct={row.changePct} />
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-3 py-2">Average</td>
              <td className="px-2 py-2 text-right">
                ${Math.round(rows.reduce((s, r) => s + r.price22, 0) / rows.length).toLocaleString()}
              </td>
              <td className="px-2 py-2 text-right">
                ${Math.round(rows.reduce((s, r) => s + r.price23, 0) / rows.length).toLocaleString()}
              </td>
              <td className="px-2 py-2 text-right">
                ${Math.round(rows.reduce((s, r) => s + r.price24, 0) / rows.length).toLocaleString()}
              </td>
              <td className="px-2 py-2 text-right">${Math.round(avg2025).toLocaleString()}</td>
              <td className="px-2 py-2 text-center">—</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-black">
          Price Variation Across Supplier Countries — {importingCountry}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600">Lowest Price (2025)</p>
            <p className="mt-1 text-xl font-bold text-green-600">${lowest.price25.toLocaleString()}/Ton</p>
            <p className="text-sm text-gray-700">{lowest.country}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600">Highest Price (2025)</p>
            <p className="mt-1 text-xl font-bold text-red-600">${highest.price25.toLocaleString()}/Ton</p>
            <p className="text-sm text-gray-700">{highest.country}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600">Price Spread (2025)</p>
            <p className="mt-1 text-xl font-bold text-black">${spread.toLocaleString()}/Ton</p>
            <p className="text-sm text-gray-700">{spreadPct}% differential</p>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-gray-800">
        Freight differentials, coal-based versus coconut-shell feedstock, and specification grades (iodine number, mesh
        size) explain most of the price gap between suppliers into {importingCountry}. Japanese and European offers
        typically bundle tighter quality certificates and shorter lead times, while Asia-Pacific sources remain most
        competitive on unit economics for bulk mining-chemical grades.
      </p>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-black">
        <h4 className="mb-2 font-semibold text-amber-900">Key Pricing Trends and Observations — {importingCountry}</h4>
        <ul className="list-inside list-disc space-y-2 text-amber-950/90">
          <li>
            Average import prices have risen in line with energy and freight indices; the spread between lowest and
            highest quotes widened modestly year over year.
          </li>
          <li>
            Premium suppliers emphasize traceability and low dust / attrition specs; discount tiers cluster around
            standard GAC for gold-leach circuits.
          </li>
          <li>Buyers balancing total landed cost versus technical risk increasingly dual-source between Asia and one “quality” supplier.</li>
        </ul>
      </div>
    </div>
  )
}
