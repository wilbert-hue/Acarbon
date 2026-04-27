'use client'

import { useMemo, useState } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'
import { buildSyntheticDistributors, DISTRIBUTOR_COUNT_TARGET } from '@/lib/intelligence-synthetic'

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

const CURATED_DISTRIBUTORS: DistributorIntelligenceRow[] = [
  {
    companyName: 'Activated Carbon Technologies (ACT)',
    headquarters: 'Rotterdam, Netherlands',
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
    headquarters: 'Houston, U.S.',
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
    headquarters: 'London, U.K.',
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
    headquarters: 'Lyon, France',
    productPortfolio: 'Water treatment, GAC systems, Regeneration services',
    ownership: 'Public',
    contactName: 'Claire Dubois',
    designation: 'Regional Offer Manager',
    email: 'c.dubois@veolia.com',
    phone: '+33 4 72 67 30 00',
    linkedIn: 'linkedin.com/in/clairedubois',
  },
  {
    companyName: 'LankaChem Distributors',
    headquarters: 'Colombo, Sri Lanka',
    productPortfolio: 'Imported GAC, Local warehousing, Technical support',
    ownership: 'Private',
    contactName: 'Ruwan Silva',
    designation: 'Commercial Director',
    email: 'r.silva@lankachem.lk',
    phone: '+94 11 259 8800',
    linkedIn: 'linkedin.com/in/ruwansilva',
  },
  {
    companyName: 'Donau Carbon Europe GmbH',
    headquarters: 'Frankfurt, Germany',
    productPortfolio: 'Coal & coconut GAC, Impregnated grades, Service contracts',
    ownership: 'Private',
    contactName: 'Klaus Brenner',
    designation: 'Sales Director DACH',
    email: 'k.brenner@donau-carbon.de',
    phone: '+49 69 509 5400',
    linkedIn: 'linkedin.com/in/klausbrenner',
  },
  {
    companyName: 'Eczacıbaşı Mining Chemicals',
    headquarters: 'Istanbul, Türkiye',
    productPortfolio: 'GAC, Flotation & leach auxiliaries, Logistics',
    ownership: 'Public',
    contactName: 'Elif Yılmaz',
    designation: 'Key Account Manager',
    email: 'e.yilmaz@eczacibasi.com.tr',
    phone: '+90 216 571 9000',
    linkedIn: 'linkedin.com/in/elifyilmaz',
  },
  {
    companyName: 'Nile Carbon & Chemicals',
    headquarters: 'Khartoum, Sudan',
    productPortfolio: 'Bulk GAC supply, Mine-site deliveries',
    ownership: 'Private',
    contactName: 'Omar Khalil',
    designation: 'Managing Partner',
    email: 'o.khalil@nilecarbon.sd',
    phone: '+249 183 778 900',
    linkedIn: 'linkedin.com/in/omarkhalil',
  },
  {
    companyName: 'Osaka Gas Chemicals (Mining)',
    headquarters: 'Osaka, Japan',
    productPortfolio: 'High-activity GAC, Specialty carbon products',
    ownership: 'Public',
    contactName: 'Yuki Tanaka',
    designation: 'Industrial Sales Lead',
    email: 'y.tanaka@osaka-gas.co.jp',
    phone: '+81 6 6205 5111',
    linkedIn: 'linkedin.com/in/yukitanaka',
  },
  {
    companyName: 'Hainan Carbon Trading Co.',
    headquarters: 'Shanghai, China',
    productPortfolio: 'Coal-based GAC exports, Coconut shell grades',
    ownership: 'Private',
    contactName: 'Li Wei',
    designation: 'Export Manager',
    email: 'l.wei@hainancarbon.cn',
    phone: '+86 21 6033 8800',
    linkedIn: 'linkedin.com/in/liwei',
  },
  {
    companyName: 'Samyang Corporation (Industrial)',
    headquarters: 'Seoul, South Korea',
    productPortfolio: 'GAC, EAC, Filtration media for process plants',
    ownership: 'Public',
    contactName: 'Jin-ho Lee',
    designation: 'Team Lead, Mining vertical',
    email: 'jh.lee@samyang.com',
    phone: '+82 2 740 7114',
    linkedIn: 'linkedin.com/in/jinholee',
  },
  {
    companyName: 'ChemLink Egypt',
    headquarters: 'Cairo, Egypt',
    productPortfolio: 'GAC imports, Cyanide bundle partners, Local blending',
    ownership: 'Private',
    contactName: 'Youssef El-Masry',
    designation: 'CEO',
    email: 'y.elmasry@chemlink-eg.com',
    phone: '+20 2 2290 1188',
    linkedIn: 'linkedin.com/in/youssefelmasry',
  },
  {
    companyName: 'PetraChem Malaysia',
    headquarters: 'Kuala Lumpur, Malaysia',
    productPortfolio: 'Mining chemicals, GAC stocking, Technical service',
    ownership: 'Subsidiary',
    contactName: 'Daniel Wong',
    designation: 'Regional GM',
    email: 'd.wong@petrachem.my',
    phone: '+60 3 2282 6600',
    linkedIn: 'linkedin.com/in/danielwong',
  },
  {
    companyName: 'Chemtrade Logistics Canada',
    headquarters: 'Toronto, Canada',
    productPortfolio: 'North American GAC distribution, Bulk transload',
    ownership: 'Public',
    contactName: 'Marc Dubé',
    designation: 'Director, Mining & Metals',
    email: 'm.dube@chemtrade.ca',
    phone: '+1 416 926 9150',
    linkedIn: 'linkedin.com/in/marcdube',
  },
  {
    companyName: 'Gulf Mining Reagents FZ-LLC',
    headquarters: 'Dubai, UAE',
    productPortfolio: 'GAC, Flocculants, Regional hub stocking',
    ownership: 'Private',
    contactName: 'Rahul Kapoor',
    designation: 'Commercial Head',
    email: 'r.kapoor@gulfminingreagents.ae',
    phone: '+971 4 551 9200',
    linkedIn: 'linkedin.com/in/rahulkapoor',
  },
  {
    companyName: 'PT Karbon Tambang Nusantara',
    headquarters: 'Jakarta, Indonesia',
    productPortfolio: 'Coconut shell GAC, Import & toll milling partners',
    ownership: 'Private',
    contactName: 'Budi Santoso',
    designation: 'Sales Director',
    email: 'b.santoso@karbontambang.id',
    phone: '+62 21 2994 1200',
    linkedIn: 'linkedin.com/in/budisantoso',
  },
  {
    companyName: 'Horizon Supply Partners',
    headquarters: 'Panama City, Rest Of World',
    productPortfolio: 'Multi-region GAC sourcing, Consolidated shipments',
    ownership: 'Private',
    contactName: 'Carlos Mendez',
    designation: 'Managing Director',
    email: 'c.mendez@horizonsupply.io',
    phone: '+507 836 4400',
    linkedIn: 'linkedin.com/in/carlosmendez',
  },
  {
    companyName: 'Benelux Carbon Solutions',
    headquarters: 'Brussels, Belgium',
    productPortfolio: 'EU-spec GAC, REACH documentation, Warehousing',
    ownership: 'Private',
    contactName: 'Sophie Maes',
    designation: 'Managing Director',
    email: 's.maes@beneluxcarbon.eu',
    phone: '+32 2 808 12 90',
    linkedIn: 'linkedin.com/in/sophiemaes',
  },
]

const DISTRIBUTORS: DistributorIntelligenceRow[] = [
  ...CURATED_DISTRIBUTORS,
  ...(buildSyntheticDistributors(
    Math.max(0, DISTRIBUTOR_COUNT_TARGET - CURATED_DISTRIBUTORS.length),
    CURATED_DISTRIBUTORS.length
  ) as DistributorIntelligenceRow[]),
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
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Distributor Intelligence ({total} distributors)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Showing {filtered.length} of {total} distributors
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
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
