'use client'

import { MapPin, ChevronDown } from 'lucide-react'
import { DASHBOARD_GEOGRAPHY_OPTIONS } from '@/lib/dashboard-geographies'

type Props = {
  value: string
  onChange: (country: string) => void
  /** Field label (default: Importing Country). */
  label?: string
  /** When true, first option is "All" with value "". */
  allowAll?: boolean
  allLabel?: string
}

export function ImportingCountrySelect({
  value,
  onChange,
  label = 'Importing Country',
  allowAll = false,
  allLabel = 'All',
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-black">
      <MapPin className="h-4 w-4 shrink-0 text-[#34A0A4]" aria-hidden />
      <span className="font-medium">{label}</span>
      <div className="relative inline-block min-w-[200px]">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[280px] cursor-pointer appearance-none rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-3 pr-9 text-sm font-semibold text-black shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {allowAll && (
            <option value="">
              {allLabel}
            </option>
          )}
          {DASHBOARD_GEOGRAPHY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
          aria-hidden
        />
      </div>
    </div>
  )
}
