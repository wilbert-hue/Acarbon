'use client'

import { useState } from 'react'
import { useDashboardStore } from '@/lib/store'
import { TrendingUp } from 'lucide-react'
import { pickInitialImportingCountry } from '@/lib/import-intelligence-countries'
import { ImportingCountrySelect } from '@/components/intelligence/ImportingCountrySelect'

type DisplayMode = 'both' | 'value' | 'volume'

const YEARS = [2022, 2023, 2024, 2025] as const

const SUPPLYING: {
  country: string
  usdMn: readonly [number, number, number, number]
  tons: readonly [number, number, number, number]
  cagr: number
  share: number
}[] = [
  { country: 'China', usdMn: [21.5, 22.8, 24.1, 24.5], tons: [5800, 6100, 6400, 6550], cagr: 9.4, share: 37.7 },
  { country: 'India', usdMn: [15.2, 16.1, 17.0, 17.4], tons: [4100, 4350, 4580, 4680], cagr: 12.4, share: 26.7 },
  { country: 'United States', usdMn: [9.8, 10.2, 10.6, 11.0], tons: [2650, 2750, 2850, 2920], cagr: 8.1, share: 17.0 },
  { country: 'Netherlands', usdMn: [6.2, 6.5, 6.8, 7.0], tons: [1680, 1750, 1820, 1880], cagr: 7.2, share: 10.8 },
  { country: 'Japan', usdMn: [4.8, 5.0, 5.2, 5.4], tons: [1290, 1340, 1390, 1420], cagr: 6.5, share: 8.2 },
]

export function ImportAnalysisView() {
  const [importingCountry, setImportingCountry] = useState(() =>
    pickInitialImportingCountry(useDashboardStore.getState().filters.geographies)
  )
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both')

  const maxShare = Math.max(...SUPPLYING.map((s) => s.share))

  const colSpan = displayMode === 'both' ? 2 : 1

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-black">
          Imports Analysis, by Regions / Supplying Countries (2022–2025)
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <ImportingCountrySelect value={importingCountry} onChange={setImportingCountry} />
        <span className="rounded-full bg-[#E8F5F4] px-3 py-1 text-xs font-medium text-[#1a6b63]">
          {SUPPLYING.length} supplying countries
        </span>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-gray-700">Show:</span>
        <div className="mt-2 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {(
            [
              ['both', 'Value & Volume'],
              ['value', 'Value (US$ Mn)'],
              ['volume', 'Volume (Tons)'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDisplayMode(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                displayMode === key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-black">
          <thead>
            <tr className="bg-[#f0f9f8]">
              <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold">Supplying Country</th>
              {YEARS.map((y) => (
                <th key={y} className="border-b border-gray-200 px-2 py-2 text-center font-semibold" colSpan={colSpan}>
                  {y}
                </th>
              ))}
              <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">CAGR (%)</th>
              <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">Trend</th>
            </tr>
            <tr className="bg-gray-50 text-xs">
              <th className="border-b border-gray-200 px-3 py-1" />
              {YEARS.map((y) => (
                <th key={y} colSpan={colSpan} className="border-b border-gray-200 px-0 py-1">
                  <div className="flex justify-center gap-4">
                    {displayMode !== 'volume' && <span className="w-16 text-center">US$ Mn</span>}
                    {displayMode !== 'value' && <span className="w-16 text-center">Tons</span>}
                  </div>
                </th>
              ))}
              <th className="border-b border-gray-200" />
              <th className="border-b border-gray-200" />
            </tr>
          </thead>
          <tbody>
            {SUPPLYING.map((row) => (
              <tr key={row.country} className="hover:bg-gray-50">
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{row.country}</td>
                {YEARS.map((_, yi) => (
                  <td key={yi} colSpan={colSpan} className="border-b border-gray-100 px-2 py-2">
                    <div className="flex justify-center gap-4 text-xs">
                      {displayMode !== 'volume' && (
                        <span className="w-16 text-right">{row.usdMn[yi].toFixed(1)}</span>
                      )}
                      {displayMode !== 'value' && (
                        <span className="w-16 text-right">{row.tons[yi].toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                ))}
                <td className="border-b border-gray-100 px-2 py-2 text-center">{row.cagr.toFixed(1)}%</td>
                <td className="border-b border-gray-100 px-2 py-2 text-center">
                  <TrendingUp className="mx-auto h-4 w-4 text-green-600" />
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-3 py-2">Total</td>
              {YEARS.map((_, yi) => {
                const sumUsd = SUPPLYING.reduce((s, r) => s + r.usdMn[yi], 0)
                const sumTons = SUPPLYING.reduce((s, r) => s + r.tons[yi], 0)
                return (
                  <td key={yi} colSpan={colSpan} className="px-2 py-2">
                    <div className="flex justify-center gap-4 text-xs">
                      {displayMode !== 'volume' && <span className="w-16 text-right">{sumUsd.toFixed(1)}</span>}
                      {displayMode !== 'value' && <span className="w-16 text-right">{sumTons.toLocaleString()}</span>}
                    </div>
                  </td>
                )
              })}
              <td className="px-2 py-2 text-center">—</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-black">
          Share of Imports by Key / Top {SUPPLYING.length} Supplying Countries ({importingCountry})
        </h3>
        <div className="space-y-2">
          {SUPPLYING.map((row) => (
            <div key={row.country} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs font-medium text-black">{row.country}</span>
              <div className="h-7 min-w-0 flex-1 rounded bg-gray-100">
                <div
                  className="flex h-full items-center justify-end rounded bg-gradient-to-r from-[#52B69A] to-[#34A0A4] pr-2 text-xs font-semibold text-white"
                  style={{ width: `${(row.share / maxShare) * 100}%`, minWidth: '48px' }}
                >
                  {row.share.toFixed(1)}%
                </div>
              </div>
              <span className="w-24 shrink-0 text-right text-xs text-gray-700">US$ {row.usdMn[3].toFixed(1)} Mn</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-black">
        <h4 className="mb-2 font-semibold text-amber-900">Import Dependency and Sourcing Trends — {importingCountry}</h4>
        <ul className="list-inside list-disc space-y-1 text-amber-950/90">
          <li>
            Activated carbon imports remain concentrated among Asia-Pacific suppliers, with China and India together
            representing a majority of import value.
          </li>
          <li>Coal-based and coconut-shell grades show the fastest year-on-year growth in tonnage terms.</li>
          <li>
            Diversification into European and North American suppliers is gradual; logistics and specification matching
            drive supplier selection.
          </li>
        </ul>
      </div>
    </div>
  )
}
