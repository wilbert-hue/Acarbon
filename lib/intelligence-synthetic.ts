import { DASHBOARD_GEOGRAPHY_OPTIONS } from '@/lib/dashboard-geographies'

const CUSTOMER_COUNT_TARGET = 150
const DISTRIBUTOR_COUNT_TARGET = 100

export { CUSTOMER_COUNT_TARGET, DISTRIBUTOR_COUNT_TARGET }

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

const CITIES: Record<string, string[]> = {
  'U.S.': ['Denver', 'Phoenix', 'Houston', 'Chicago', 'Atlanta'],
  'Sri Lanka': ['Colombo', 'Kandy'],
  Russia: ['Moscow', 'St. Petersburg', 'Novosibirsk'],
  Ghana: ['Accra', 'Kumasi'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  Germany: ['Hamburg', 'Frankfurt', 'Berlin', 'Munich'],
  Türkiye: ['Istanbul', 'Ankara', 'Izmir'],
  Sudan: ['Khartoum', 'Port Sudan'],
  Japan: ['Tokyo', 'Osaka', 'Nagoya'],
  China: ['Shanghai', 'Beijing', 'Xiamen', 'Guangzhou'],
  Belgium: ['Brussels', 'Antwerp'],
  'South Korea': ['Seoul', 'Busan'],
  Egypt: ['Cairo', 'Alexandria'],
  Malaysia: ['Kuala Lumpur', 'Penang'],
  Canada: ['Toronto', 'Vancouver', 'Montreal'],
  UAE: ['Dubai', 'Abu Dhabi'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague'],
  'U.K.': ['London', 'Manchester', 'Birmingham'],
  France: ['Paris', 'Lyon', 'Marseille'],
  Indonesia: ['Jakarta', 'Surabaya'],
  'Rest Of World': ['Singapore', 'Panama City', 'Luxembourg', 'Dublin'],
}

const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Sam',
  'Taylor',
  'Morgan',
  'Riley',
  'Casey',
  'Quinn',
  'Avery',
  'Jamie',
  'David',
  'Sarah',
  'Michael',
  'Emma',
  'James',
  'Priya',
  'Chen',
  'Luis',
  'Anna',
  'Omar',
  'Yuki',
  'Elena',
  'Viktor',
  'Nadia',
]

const LAST_NAMES = [
  'Nguyen',
  'Patel',
  'Silva',
  'Kowalski',
  'Johansson',
  'Fernandez',
  'Okonkwo',
  'Hansen',
  'Ibrahim',
  'Nakamura',
  'Schmidt',
  'Rossi',
  'Murphy',
  'Tan',
  'Khan',
  'Berg',
  'Dubois',
  'Santos',
  'Petrov',
  'Cohen',
]

const MINING_SUFFIXES = [
  'Mining',
  'Minerals',
  'Resources',
  'Metals',
  'Gold',
  'Copper',
  'Extractives',
  'Commodities',
  'Ore Co.',
  'Mine Supply',
]

const CUSTOMER_CHEM = [
  'GAC, Coal-based & coconut grades',
  'Granular AC, PAC for CIL/CIP',
  'Coconut shell GAC, Reactivation services',
  'EAC, Impregnated carbon for gas treatment',
  'Bulk GAC, Elution chemicals bundle',
  'Specialty GAC, Low-dust mining specs',
  'Powdered AC, Carbon fines programs',
  'Virgin & reactivated GAC mix',
]

const CUSTOMER_TITLES = [
  'Head of Procurement',
  'Chief Procurement Officer',
  'Director, Strategic Sourcing',
  'VP Supply Chain',
  'Group Procurement Manager',
  'Regional Buyer — Mining',
  'Technical Procurement Lead',
  'GM, Raw Materials',
]

const DIST_PORTFOLIO = [
  'GAC, EAC, Coconut & coal grades',
  'Activated carbon, Flotation reagents',
  'Bulk GAC imports, Local blending',
  'Mining chemicals, Carbon services',
  'Norit-style GAC, Change-out crews',
  'EU-spec GAC, REACH documentation',
  'Asia-Pacific GAC exports, Logistics',
  'Regional hub stocking, Technical support',
]

const DIST_TITLES = [
  'Managing Director',
  'Sales Director',
  'Key Account Manager',
  'Regional GM',
  'Commercial Lead',
  'Business Development',
  'Technical Sales Manager',
  'VP Industrial Sales',
]

type CustomerOwnership = 'Public' | 'Subsidiary' | 'Private'
type DistributorOwnership = 'Public' | 'Private' | 'Subsidiary'

export type SyntheticCustomerRow = {
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

export type SyntheticDistributorRow = {
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

function headquartersFor(seq: number): string {
  const country = DASHBOARD_GEOGRAPHY_OPTIONS[seq % DASHBOARD_GEOGRAPHY_OPTIONS.length]!
  const cities = CITIES[country] ?? ['Regional HQ']
  const city = cities[Math.floor(seq / DASHBOARD_GEOGRAPHY_OPTIONS.length) % cities.length]!
  return `${city}, ${country}`
}

const OWNERSHIP_CYCLE: CustomerOwnership[] = ['Public', 'Public', 'Private', 'Subsidiary']
const DIST_OWNERSHIP: DistributorOwnership[] = ['Public', 'Private', 'Private', 'Subsidiary']

export function buildSyntheticCustomers(count: number, idOffset: number): SyntheticCustomerRow[] {
  const out: SyntheticCustomerRow[] = []
  for (let i = 0; i < count; i++) {
    const id = idOffset + i
    const rand = mulberry32(fnv1a(`cust-${id}`))
    const hq = headquartersFor(id)
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]!
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]!
    const suf = MINING_SUFFIXES[Math.floor(rand() * MINING_SUFFIXES.length)]!
    const companyName = `${fn} ${suf} ${id + 1}`
    const ownership = OWNERSHIP_CYCLE[id % OWNERSHIP_CYCLE.length]!
    const slug = `${fn.toLowerCase()}-${ln.toLowerCase()}-${id}`
    out.push({
      companyName,
      headquarters: hq,
      keyChemicals: CUSTOMER_CHEM[id % CUSTOMER_CHEM.length]!,
      ownership,
      contactName: `${fn} ${ln}`,
      designation: CUSTOMER_TITLES[id % CUSTOMER_TITLES.length]!,
      email: `procurement.${id}@mineralcorp-${(id % 9000) + 1000}.sample`,
      phone: `+${100 + (id % 800)} ${200 + (id % 700)} ${1000 + (id % 8000)}`,
      linkedIn: `linkedin.com/in/${slug.replace(/[^a-z0-9-]/g, '')}`,
    })
  }
  return out
}

export function buildSyntheticDistributors(count: number, idOffset: number): SyntheticDistributorRow[] {
  const out: SyntheticDistributorRow[] = []
  for (let i = 0; i < count; i++) {
    const id = idOffset + i
    const rand = mulberry32(fnv1a(`dist-${id}`))
    const hq = headquartersFor(id + 17)
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]!
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]!
    const companyName = `Carbon & Reagents Trading ${id + 1} (${hq.split(',')[0]})`
    const ownership = DIST_OWNERSHIP[id % DIST_OWNERSHIP.length]!
    const slug = `dist-${fn.toLowerCase()}-${ln.toLowerCase()}-${id}`
    out.push({
      companyName,
      headquarters: hq,
      productPortfolio: DIST_PORTFOLIO[id % DIST_PORTFOLIO.length]!,
      ownership,
      contactName: `${fn} ${ln}`,
      designation: DIST_TITLES[id % DIST_TITLES.length]!,
      email: `sales.${id}@carbontrade-${(id % 9000) + 1000}.sample`,
      phone: `+${150 + (id % 750)} ${300 + (id % 600)} ${2000 + (id % 7000)}`,
      linkedIn: `linkedin.com/in/${slug.replace(/[^a-z0-9-]/g, '')}`,
    })
  }
  return out
}
