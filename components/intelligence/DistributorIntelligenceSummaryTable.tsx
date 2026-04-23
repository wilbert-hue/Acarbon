'use client'

import { useMemo, useState } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'

export type DistributorOwnership = 'Public' | 'Private' | 'Subsidiary'

export interface DistributorIntelligenceRow {
  companyName: string
  headquarters: string
  productPortfolio: string
  ownership: DistributorOwnership
  contactName: string
  designation: string
  email: string
  phone: string
  linkedIn: string
}

const DISTRIBUTORS: DistributorIntelligenceRow[] = [
  {
    companyName: 'Activated Carbon Technologies (ACT)',
    headquarters: 'Melbourne, Australia',
    productPortfolio: 'Coconut Shell AC, Granular AC, Reactivation Services',
    ownership: 'Private',
    contactName: 'Mark Thompson',
    designation: 'CEO',
    email: 'm.thompson@act.com.au',
    phone: '+61 3 9874 5200',
    linkedIn: 'linkedin.com/in/markthompson',
  },
  {
    companyName: 'AECI Mining Chemicals',
    headquarters: 'Johannesburg, South Africa',
    productPortfolio: 'Activated Carbon, Cyanide, Flotation Reagents, Flocculants',
    ownership: 'Public',
    contactName: 'Sipho Mabena',
    designation: 'GM - Mining Chemicals',
    email: 's.mabena@aeci.co.za',
    phone: '+27 11 806 8700',
    linkedIn: 'linkedin.com/in/siphomabena',
  },
  {
    companyName: 'Axis House (Pty) Ltd.',
    headquarters: 'Johannesburg, South Africa',
    productPortfolio: 'Granular & Powdered Activated Carbon, Gold Elution Chemicals',
    ownership: 'Private',
    contactName: 'Craig Williams',
    designation: 'Technical Sales Manager',
    email: 'c.williams@axishouse.co.za',
    phone: '+27 11 463 4888',
    linkedIn: 'linkedin.com/in/craigwilliams',
  },
  {
    companyName: 'Camfil APC (Mining)',
    headquarters: 'Sydney, Australia',
    productPortfolio: 'GAC supply, Dust & fume systems for process plants',
    ownership: 'Subsidiary',
    contactName: 'Emma Clarke',
    designation: 'Regional Sales Director',
    email: 'e.clarke@camfil.com',
    phone: '+61 2 9838 3300',
    linkedIn: 'linkedin.com/in/emmaclarke',
  },
  {
    companyName: 'ChemQuest Africa',
    headquarters: 'Accra, Ghana',
    productPortfolio: 'Mining reagents, GAC imports, Local blending',
    ownership: 'Private',
    contactName: 'Kofi Mensah',
    designation: 'Managing Director',
    email: 'k.mensah@chemquest-africa.com',
    phone: '+233 30 278 9100',
    linkedIn: 'linkedin.com/in/kofimensah',
  },
  {
    companyName: 'Donau Carbon Africa',
    headquarters: 'Durban, South Africa',
    productPortfolio: 'Coal-based GAC, Impregnated grades, Technical support',
    ownership: 'Private',
    contactName: 'Ruan Pretorius',
    designation: 'Sales Manager — Mining',
    email: 'r.pretorius@donau-carbon.co.za',
    phone: '+27 31 564 2200',
    linkedIn: 'linkedin.com/in/ruanpretorius',
  },
  {
    companyName: 'Jacobi Carbons (African hub)',
    headquarters: 'Johannesburg, South Africa',
    productPortfolio: 'Coconut shell & coal GAC, EAC, Service contracts',
    ownership: 'Public',
    contactName: 'Nomsa Dlamini',
    designation: 'Key Account Manager',
    email: 'n.dlamini@jacobi.net',
    phone: '+27 11 452 8100',
    linkedIn: 'linkedin.com/in/nomsadlamini',
  },
  {
    companyName: 'Kuraray (Calypso Carbon)',
    headquarters: 'Moscow, Russia',
    productPortfolio: 'High-activity GAC, Specialty carbon cloth & filters',
    ownership: 'Public',
    contactName: 'Dmitry Volkov',
    designation: 'Head of Industrial Sales',
    email: 'd.volkov@kuraray.com',
    phone: '+7 495 937 1800',
    linkedIn: 'linkedin.com/in/dmitryvolkov',
  },
  {
    companyName: 'Mintek Applied Technologies',
    headquarters: 'Johannesburg, South Africa',
    productPortfolio: 'Process chemicals, AC for CIL/CIP, Elution support',
    ownership: 'Public',
    contactName: 'Thabo Molefe',
    designation: 'Business Development',
    email: 't.molefe@mintek.co.za',
    phone: '+27 11 709 4000',
    linkedIn: 'linkedin.com/in/thabomolefe',
  },
  {
    companyName: 'Norit Africa Distributors',
    headquarters: 'Cape Town, South Africa',
    productPortfolio: 'Norit GAC range, Carbon change-out services',
    ownership: 'Private',
    contactName: 'Sarah van Niekerk',
    designation: 'Commercial Lead',
    email: 's.vanniekerk@norit-africa.com',
    phone: '+27 21 555 0190',
    linkedIn: 'linkedin.com/in/sarahvanniekerk',
  },
  {
    companyName: 'Orica Mining Services',
    headquarters: 'Melbourne, Australia',
    productPortfolio: 'Explosives & reagents bundle, AC for gold recovery',
    ownership: 'Public',
    contactName: 'James Whitmore',
    designation: 'Account Manager — West Africa',
    email: 'j.whitmore@orica.com',
    phone: '+61 3 9665 7777',
    linkedIn: 'linkedin.com/in/jameswhitmore',
  },
  {
    companyName: 'Veolia Water Technologies (Mining)',
    headquarters: 'Lyon, France (Africa projects)',
    productPortfolio: 'Water treatment, GAC systems, Regeneration services',
    ownership: 'Public',
    contactName: 'Claire Dubois',
    designation: 'Regional Offer Manager',
    email: 'c.dubois@veolia.com',
    phone: '+33 4 72 67 30 00',
    linkedIn: 'linkedin.com/in/clairedubois',
  },
]

function ownershipPillClass(o: DistributorOwnership) {
  switch (o) {
    case 'Public':
      return 'bg-sky-100 text-sky-900'
    case 'Private':
      return 'bg-emerald-100 text-emerald-900'
    case 'Subsidiary':
      return 'bg-violet-100 text-violet-900'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function linkedInHref(url: string) {
  if (url.startsWith('http')) return url
  return `https://${url}`
}

export function DistributorIntelligenceSummaryTable() {
  const [query, setQuery] = useState('')
  const [sortCompany, setSortCompany] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = DISTRIBUTORS
    if (q) {
      rows = rows.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.headquarters.toLowerCase().includes(q) ||
          r.productPortfolio.toLowerCase().includes(q) ||
          r.contactName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      )
    }
    return [...rows].sort((a, b) => {
      const cmp = a.companyName.localeCompare(b.companyName)
      return sortCompany === 'asc' ? cmp : -cmp
    })
  }, [query, sortCompany])

  const total = DISTRIBUTORS.length

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Distributor Intelligence (10–12 Distributors)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Showing {filtered.length} of {total} distributors
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search distributors..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            aria-label="Search distributors"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[1150px] w-full border-collapse text-sm text-black">
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
                Core product portfolio (mining chemicals)
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
                <td className="max-w-md px-3 py-3 whitespace-normal text-gray-800">{row.productPortfolio}</td>
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
