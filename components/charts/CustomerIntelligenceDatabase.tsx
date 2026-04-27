'use client'

import { useMemo, useState } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'
import { buildSyntheticCustomers, CUSTOMER_COUNT_TARGET } from '@/lib/intelligence-synthetic'

export type CustomerOwnership = 'Public' | 'Subsidiary' | 'Private'

export interface CustomerIntelligenceRow {
  companyName: string
  headquarters: string
  keyChemicals: string
  ownership: CustomerOwnership
  contactName: string
  designation: string
  email: string
  phone: string
  linkedIn: string
}

const CURATED_CUSTOMERS: CustomerIntelligenceRow[] = [
  {
    companyName: 'AngloGold Ashanti',
    headquarters: 'Johannesburg, South Africa',
    keyChemicals: 'Granular Activated Carbon (GAC), Coconut Shell-Based AC',
    ownership: 'Public',
    contactName: 'John Smith',
    designation: 'Head of Procurement',
    email: 'j.smith@anglogold.com',
    phone: '+27 11 637 6000',
    linkedIn: 'linkedin.com/in/johnsmith',
  },
  {
    companyName: 'Barrick Gold (Tanzania)',
    headquarters: 'Cairo, Egypt',
    keyChemicals: 'Coconut Shell-Based AC, Extruded AC (EAC)',
    ownership: 'Subsidiary',
    contactName: 'James Mwanga',
    designation: 'Chief Procurement Officer',
    email: 'j.mwanga@barrick.com',
    phone: '+255 22 260 1100',
    linkedIn: 'linkedin.com/in/jamesmwanga',
  },
  {
    companyName: 'Caledonia Mining (Zimbabwe)',
    headquarters: 'Brussels, Belgium',
    keyChemicals: 'Granular Activated Carbon (GAC), Coal-Based AC',
    ownership: 'Public',
    contactName: 'Tendai Moyo',
    designation: 'Procurement Director',
    email: 't.moyo@caledoniamining.com',
    phone: '+263 24 275 2368',
    linkedIn: 'linkedin.com/in/tendaimoyo',
  },
  {
    companyName: 'Gold Fields Ghana',
    headquarters: 'Accra, Ghana',
    keyChemicals: 'GAC, Powdered AC for CIL circuits',
    ownership: 'Public',
    contactName: 'Kwame Asante',
    designation: 'Supply Chain Lead',
    email: 'k.asante@goldfields.com',
    phone: '+233 30 701 0180',
    linkedIn: 'linkedin.com/in/kwameasante',
  },
  {
    companyName: 'Harmony Gold',
    headquarters: 'Johannesburg, South Africa',
    keyChemicals: 'Coconut shell GAC, Reactivated carbon services',
    ownership: 'Public',
    contactName: 'Lindiwe Nkosi',
    designation: 'Group Procurement Manager',
    email: 'l.nkosi@harmony.co.za',
    phone: '+27 11 418 9200',
    linkedIn: 'linkedin.com/in/lindiwenkosi',
  },
  {
    companyName: 'IAMGOLD Essakane',
    headquarters: 'Istanbul, Türkiye',
    keyChemicals: 'Extruded AC, Granular AC for heap leach',
    ownership: 'Subsidiary',
    contactName: 'Amadou Diallo',
    designation: 'Chief Buyer — Mining',
    email: 'a.diallo@iamgold.com',
    phone: '+226 25 30 1200',
    linkedIn: 'linkedin.com/in/amadoudiallo',
  },
  {
    companyName: 'Kinross Gold (Mauritania ops)',
    headquarters: 'Dubai, UAE',
    keyChemicals: 'GAC, Coal-based AC blends',
    ownership: 'Public',
    contactName: 'Fatima El Hachimi',
    designation: 'Regional Procurement',
    email: 'f.elhachimi@kinross.com',
    phone: '+222 45 25 8800',
    linkedIn: 'linkedin.com/in/fatimaelhachimi',
  },
  {
    companyName: 'Newmont (Sub-Saharan hub)',
    headquarters: 'Accra, Ghana',
    keyChemicals: 'Coconut shell AC, Specialty impregnated GAC',
    ownership: 'Public',
    contactName: 'David Osei',
    designation: 'Director, Strategic Sourcing',
    email: 'd.osei@newmont.com',
    phone: '+233 54 312 4400',
    linkedIn: 'linkedin.com/in/davidosei',
  },
  {
    companyName: 'Perseus Mining',
    headquarters: 'Jakarta, Indonesia',
    keyChemicals: 'GAC, Elution column chemicals bundle',
    ownership: 'Public',
    contactName: 'Marie Fouda',
    designation: 'Head of Supply',
    email: 'm.fouda@perseusmining.com',
    phone: '+237 222 123 450',
    linkedIn: 'linkedin.com/in/mariefouda',
  },
  {
    companyName: 'Resolute Mining',
    headquarters: 'Vancouver, Canada',
    keyChemicals: 'Granular AC, Carbon fines management',
    ownership: 'Public',
    contactName: 'Tom Brennan',
    designation: 'GM Procurement',
    email: 't.brennan@resolutemining.com',
    phone: '+61 8 9221 2000',
    linkedIn: 'linkedin.com/in/tombrennan',
  },
  {
    companyName: 'Sibanye-Stillwater',
    headquarters: 'Johannesburg, South Africa',
    keyChemicals: 'GAC, EAC, On-site reactivation partnerships',
    ownership: 'Public',
    contactName: 'Pieter van der Merwe',
    designation: 'VP Procurement',
    email: 'p.vandermerwe@sibanyestillwater.co.za',
    phone: '+27 11 278 9600',
    linkedIn: 'linkedin.com/in/pietervandermerwe',
  },
  {
    companyName: 'West African Resources',
    headquarters: 'Paris, France',
    keyChemicals: 'Coconut shell GAC, Coal-based backup grades',
    ownership: 'Public',
    contactName: 'Ibrahim Sanogo',
    designation: 'Procurement Manager',
    email: 'i.sanogo@westafricanresources.com',
    phone: '+226 25 33 6600',
    linkedIn: 'linkedin.com/in/ibrahimsanogo',
  },
  {
    companyName: 'Freeport-McMoRan (Corporate)',
    headquarters: 'Phoenix, U.S.',
    keyChemicals: 'GAC, Coal-based AC, Heap-leach reagent bundles',
    ownership: 'Public',
    contactName: 'Laura Chen',
    designation: 'Director, Chemicals & Consumables',
    email: 'l.chen@fmi.com',
    phone: '+1 602 366 8100',
    linkedIn: 'linkedin.com/in/laurachen',
  },
  {
    companyName: 'Lanka Mineral Sands Ltd.',
    headquarters: 'Colombo, Sri Lanka',
    keyChemicals: 'PAC/GAC for mineral separation circuits',
    ownership: 'Public',
    contactName: 'Nimal Perera',
    designation: 'Chief Procurement Officer',
    email: 'n.perera@lankaminerals.lk',
    phone: '+94 11 288 6400',
    linkedIn: 'linkedin.com/in/nimalperera',
  },
  {
    companyName: 'Polyus',
    headquarters: 'Moscow, Russia',
    keyChemicals: 'GAC for CIL, Elution chemicals',
    ownership: 'Public',
    contactName: 'Alexey Orlov',
    designation: 'Head of Supply Chain',
    email: 'a.orlov@polyus.com',
    phone: '+7 495 248 9800',
    linkedIn: 'linkedin.com/in/alexeyorlov',
  },
  {
    companyName: 'Aurubis AG',
    headquarters: 'Hamburg, Germany',
    keyChemicals: 'Activated carbon for smelter off-gas & water',
    ownership: 'Public',
    contactName: 'Stefan Weber',
    designation: 'Procurement Lead — Smelters',
    email: 's.weber@aurubis.com',
    phone: '+49 40 7883 0',
    linkedIn: 'linkedin.com/in/stefanweber',
  },
  {
    companyName: 'Sudan Gold Refinery Co.',
    headquarters: 'Khartoum, Sudan',
    keyChemicals: 'GAC, Carbon fines handling services',
    ownership: 'Private',
    contactName: 'Hassan Osman',
    designation: 'Supply Manager',
    email: 'h.osman@sudangoldrefinery.sd',
    phone: '+249 183 778 200',
    linkedIn: 'linkedin.com/in/hassanosman',
  },
  {
    companyName: 'Sumitomo Metal Mining',
    headquarters: 'Tokyo, Japan',
    keyChemicals: 'High-spec GAC, Specialty impregnated grades',
    ownership: 'Public',
    contactName: 'Kenji Morita',
    designation: 'GM, Raw Materials',
    email: 'k.morita@smm.co.jp',
    phone: '+81 3 5252 1111',
    linkedIn: 'linkedin.com/in/kenjimorita',
  },
  {
    companyName: 'Zijin Mining Group',
    headquarters: 'Xiamen, China',
    keyChemicals: 'Coal-based GAC, Coconut shell AC imports',
    ownership: 'Public',
    contactName: 'Wei Zhang',
    designation: 'VP Procurement',
    email: 'w.zhang@zijinmining.com',
    phone: '+86 592 293 3666',
    linkedIn: 'linkedin.com/in/weizhang',
  },
  {
    companyName: 'LS MnM Inc.',
    headquarters: 'Seoul, South Korea',
    keyChemicals: 'GAC, EAC for hydrometallurgy',
    ownership: 'Public',
    contactName: 'Min-jun Park',
    designation: 'Head of Strategic Sourcing',
    email: 'mj.park@lsmnm.com',
    phone: '+82 2 2181 1114',
    linkedIn: 'linkedin.com/in/minjunpark',
  },
  {
    companyName: 'Malaysian Chamber of Mines',
    headquarters: 'Kuala Lumpur, Malaysia',
    keyChemicals: 'GAC, Mining water treatment chemicals',
    ownership: 'Private',
    contactName: 'Aisha Rahman',
    designation: 'Procurement Committee Chair',
    email: 'a.rahman@mcom.org.my',
    phone: '+60 3 2161 1828',
    linkedIn: 'linkedin.com/in/aisharahman',
  },
  {
    companyName: 'Nordic Gold Partners BV',
    headquarters: 'Amsterdam, Netherlands',
    keyChemicals: 'European GAC grades, Import coordination',
    ownership: 'Private',
    contactName: 'Erik van den Berg',
    designation: 'Managing Director',
    email: 'e.vandenberg@nordicgold.nl',
    phone: '+31 20 794 1200',
    linkedIn: 'linkedin.com/in/erikvandenberg',
  },
  {
    companyName: 'Centamin plc',
    headquarters: 'London, U.K.',
    keyChemicals: 'GAC for CIL/CIP, Reactivated carbon programs',
    ownership: 'Public',
    contactName: 'Oliver Hughes',
    designation: 'Group Procurement',
    email: 'o.hughes@centamin.com',
    phone: '+44 20 7404 5950',
    linkedIn: 'linkedin.com/in/oliverhughes',
  },
  {
    companyName: 'Global Minerals Trading Hub',
    headquarters: 'Singapore, Rest Of World',
    keyChemicals: 'Multi-origin GAC sourcing, Spot & contract bundles',
    ownership: 'Private',
    contactName: 'Priya Natarajan',
    designation: 'Regional Trading Lead',
    email: 'p.natarajan@globalmineralshub.io',
    phone: '+65 6808 4400',
    linkedIn: 'linkedin.com/in/priyanatarajan',
  },
]

const CUSTOMERS: CustomerIntelligenceRow[] = [
  ...CURATED_CUSTOMERS,
  ...(buildSyntheticCustomers(
    Math.max(0, CUSTOMER_COUNT_TARGET - CURATED_CUSTOMERS.length),
    CURATED_CUSTOMERS.length
  ) as CustomerIntelligenceRow[]),
]

function ownershipPillClass(o: CustomerOwnership) {
  switch (o) {
    case 'Public':
      return 'bg-sky-100 text-sky-900'
    case 'Subsidiary':
      return 'bg-violet-100 text-violet-900'
    case 'Private':
      return 'bg-emerald-100 text-emerald-900'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function linkedInHref(url: string) {
  if (url.startsWith('http')) return url
  return `https://${url}`
}

/** Matches Excel-style category strip colors (light tints) */
function groupTopHeaderClass(group: string): string {
  const g = group.trim()
  switch (g) {
    case 'S.No.':
      return 'bg-gray-200 text-gray-900'
    case 'Customer Information':
      return 'bg-orange-100 text-gray-900'
    case 'Contact Details':
      return 'bg-sky-100 text-gray-900'
    case 'Professional Drivers':
      return 'bg-teal-100 text-gray-900'
    case 'Purchasing Behaviour Metrics':
      return 'bg-purple-100 text-gray-900'
    case 'Solution Requirements':
      return 'bg-amber-100 text-gray-900'
    case 'CMI Insights':
      return 'bg-indigo-100 text-gray-900'
    default:
      return 'bg-gray-200 text-gray-900'
  }
}

function groupSubHeaderClass(group: string): string {
  const g = group.trim()
  switch (g) {
    case 'S.No.':
      return 'bg-gray-50 text-gray-900'
    case 'Customer Information':
      return 'bg-orange-50 text-gray-900'
    case 'Contact Details':
      return 'bg-sky-50 text-gray-900'
    case 'Professional Drivers':
      return 'bg-teal-50 text-gray-900'
    case 'Purchasing Behaviour Metrics':
      return 'bg-purple-50 text-gray-900'
    case 'Solution Requirements':
      return 'bg-amber-50 text-gray-900'
    case 'CMI Insights':
      return 'bg-indigo-50 text-gray-900'
    default:
      return 'bg-gray-50 text-gray-900'
  }
}

function buildMergedGroupRow(columns: CustomerColumn[]): { label: string; colspan: number }[] {
  if (!columns.some(c => c.group != null && String(c.group).trim() !== '')) {
    return []
  }
  const groups = columns.map(c => c.group || '—')
  if (groups.length === 0) return []
  const merged: { label: string; colspan: number }[] = []
  let i = 0
  while (i < groups.length) {
    const label = groups[i]
    let span = 1
    while (i + span < groups.length && groups[i + span] === label) {
      span++
    }
    merged.push({ label, colspan: span })
    i += span
  }
  return merged
}

interface Props {
  title?: string
  height?: number
}

export default function CustomerIntelligenceDatabase(_props: CustomerIntelligenceDatabaseProps = {}) {
  const [query, setQuery] = useState('')
  const [sortCompany, setSortCompany] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = CUSTOMERS
    if (q) {
      rows = rows.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.headquarters.toLowerCase().includes(q) ||
          r.keyChemicals.toLowerCase().includes(q) ||
          r.contactName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      )
    }
    const sorted = [...rows].sort((a, b) => {
      const cmp = a.companyName.localeCompare(b.companyName)
      return sortCompany === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [query, sortCompany])

  const total = CUSTOMERS.length

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Intelligence ({total} customers)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Showing {filtered.length} of {total} customers
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              aria-label="Search customers"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[1100px] w-full border-collapse text-sm text-black">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">#</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">
                <button
                  type="button"
                  onClick={() => setSortCompany((s) => (s === 'asc' ? 'desc' : 'asc'))}
                  className="inline-flex items-center gap-1 font-bold hover:text-gray-900"
                >
                  Company name
                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                </button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">
                Headquarters location
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">
                Key chemicals procured
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-600">
                Ownership type
              </th>
              <th
                className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-600"
                colSpan={5}
              >
                Decision-maker contact details
              </th>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th colSpan={5} />
              <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Name
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Designation
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                LinkedIn
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={`${row.companyName}-${i}`} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                <td className="px-3 py-3 text-gray-600">{i + 1}</td>
                <td className="px-3 py-3 font-medium text-black">{row.companyName}</td>
                <td className="px-3 py-3 text-gray-800">{row.headquarters}</td>
                <td className="max-w-xs px-3 py-3 whitespace-normal text-gray-800">{row.keyChemicals}</td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ownershipPillClass(row.ownership)}`}
                  >
                    {row.ownership}
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-900">{row.contactName}</td>
                <td className="px-3 py-3 text-gray-800">{row.designation}</td>
                <td className="px-3 py-3">
                  <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
                    {row.email}
                  </a>
                </td>
                <td className="px-3 py-3 whitespace-normal text-gray-800">{row.phone}</td>
                <td className="px-3 py-3">
                  <a
                    href={linkedInHref(row.linkedIn)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {row.linkedIn.replace(/^https?:\/\//, '')}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
