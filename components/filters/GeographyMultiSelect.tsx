'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboardStore } from '@/lib/store'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

const GLOBAL_LABEL = 'Global'

function withoutGlobal<T extends string>(list: T[]): T[] {
  return list.filter((g) => g !== GLOBAL_LABEL) as T[]
}

export function GeographyMultiSelect() {
  const { data, filters, updateFilters } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const { globalItems, regions, countries, hasHierarchy, flatOptions } = useMemo(() => {
    if (!data?.dimensions?.geographies) {
      return {
        globalItems: [] as string[],
        regions: [] as string[],
        countries: {} as Record<string, string[]>,
        hasHierarchy: false,
        flatOptions: [] as string[],
      }
    }
    const geo = data.dimensions.geographies
    const globalItems = withoutGlobal(geo.global || [])
    const regions = geo.regions || []
    const countries = geo.countries || {}
    const hasHierarchy = regions.length > 0
    const flatOptions = withoutGlobal(geo.all_geographies || [])
    return { globalItems, regions, countries, hasHierarchy, flatOptions }
  }, [data])

  const searchResults = useMemo(() => {
    if (!searchTerm) return null
    const search = searchTerm.toLowerCase()
    return flatOptions.filter((g) => g.toLowerCase().includes(search))
  }, [searchTerm, flatOptions])

  const toggleRegionExpand = (region: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev)
      if (next.has(region)) next.delete(region)
      else next.add(region)
      return next
    })
  }

  const handleToggle = (geography: string) => {
    const current = filters.geographies
    const updated = current.includes(geography)
      ? current.filter((g) => g !== geography)
      : [...current, geography]
    updateFilters({ geographies: updated })
  }

  const handleSelectAll = () => {
    if (!data) return
    updateFilters({
      geographies: withoutGlobal(data.dimensions.geographies.all_geographies || []),
    })
  }

  const handleClearAll = () => updateFilters({ geographies: [] })

  if (!data) return null

  const selectedCount = filters.geographies.length

  const renderCheckbox = (geography: string, indent: number = 0) => (
    <label
      key={geography}
      className="flex cursor-pointer items-center py-1.5 hover:bg-blue-50"
      style={{ paddingLeft: `${12 + indent * 20}px`, paddingRight: '12px' }}
    >
      <input
        type="checkbox"
        checked={filters.geographies.includes(geography)}
        onChange={() => handleToggle(geography)}
        className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="flex-1 text-sm text-black">{geography}</span>
      {filters.geographies.includes(geography) && (
        <Check className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
      )}
    </label>
  )

  const renderRegion = (region: string) => {
    const regionCountries = countries[region] || []
    const isExpanded = expandedRegions.has(region)
    const hasCountries = regionCountries.length > 0

    return (
      <div key={region}>
        <div className="flex items-center hover:bg-blue-50">
          {hasCountries && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleRegionExpand(region)
              }}
              className="ml-1 rounded p-1 hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              )}
            </button>
          )}
          <label
            className="flex flex-1 cursor-pointer items-center py-1.5"
            style={{ paddingLeft: hasCountries ? '2px' : '28px', paddingRight: '12px' }}
          >
            <input
              type="checkbox"
              checked={filters.geographies.includes(region)}
              onChange={() => handleToggle(region)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex-1 text-sm font-medium text-black">{region}</span>
            {filters.geographies.includes(region) && (
              <Check className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
            )}
          </label>
        </div>
        {isExpanded && regionCountries.map((country) => renderCheckbox(country, 2))}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm text-black">
          {selectedCount === 0 ? 'Select geographies...' : `${selectedCount} selected`}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-96 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="border-b p-3">
            <input
              type="text"
              placeholder="Search geographies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 border-b bg-gray-50 px-3 py-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded bg-gray-100 px-3 py-1 text-xs text-black hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {searchResults !== null ? (
              searchResults.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-black">
                  No geographies found matching your search
                </div>
              ) : (
                searchResults.map((geo) => renderCheckbox(geo, 0))
              )
            ) : hasHierarchy ? (
              <>
                {globalItems.map((geo) => renderCheckbox(geo, 0))}
                {globalItems.length > 0 && regions.length > 0 && (
                  <div className="my-1 border-t border-gray-200" />
                )}
                {regions.map((region) => renderRegion(region))}
              </>
            ) : flatOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-black">No geographies available</div>
            ) : (
              flatOptions.map((geo) => renderCheckbox(geo, 0))
            )}
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="mt-2">
          <span className="text-xs text-black">
            {selectedCount} {selectedCount === 1 ? 'geography' : 'geographies'} selected
          </span>
        </div>
      )}
    </div>
  )
}
