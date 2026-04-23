'use client'

import { MapPin, ChevronDown } from 'lucide-react'
import { IMPORTING_COUNTRY_OPTIONS } from '@/lib/import-intelligence-countries'

type Props = {
  value: string
  onChange: (country: string) => void
}

export function ImportingCountrySelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-black">
      <MapPin className="h-4 w-4 shrink-0 text-[#34A0A4]" aria-hidden />
      <span className="font-medium">Importing Country</span>
      <div className="relative inline-block min-w-[200px]">
        <select
          aria-label="Importing country"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-3 pr-9 text-sm font-semibold text-black shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {IMPORTING_COUNTRY_OPTIONS.map((c) => (
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
