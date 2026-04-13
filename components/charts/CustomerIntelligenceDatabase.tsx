'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SpectralCustomerData {
  sNo: number
  // Customer Information
  companyName: string
  parentGroup: string
  country: string
  cityRegion: string
  industry: string
  applicationSegment: string
  // Contact Details
  keyContact: string
  designation: string
  email: string
  phone: string
  linkedIn: string
  website: string
  // Needs & Pain Points (Prop 2+)
  primaryNeed: string
  keyProductNeeds: string
  keyServiceNeeds: string
  // Spectral Usage (Prop 2+)
  spectralRangeUsed: string
  currentInstrumentSetup: string
  primaryUseCase: string
  // Purchasing Behaviour (Prop 3)
  decisionMakers: string
  currentSupplier: string
  procurementModel: string
  // Opportunity & Project Status (Prop 3)
  priorityLevel: string
  expectedOpportunitySize: string
  plannedProjects: string
  // CMI Insights (Prop 3)
  benchmarkingSummary: string
}

const sampleData: SpectralCustomerData[] = [
  {
    sNo: 1,
    companyName: 'John Deere – Precision Ag Division',
    parentGroup: 'Deere & Company',
    country: 'U.S.',
    cityRegion: 'Moline, IL – Midwest Ag Belt',
    industry: 'Agriculture',
    applicationSegment: 'Precision Farming & Crop Monitoring',
    keyContact: 'Dr. Sarah Mitchell',
    designation: 'VP – Precision Technology',
    email: 's.mitchell@johndeere.com',
    phone: '+1 309-765-4321',
    linkedIn: 'linkedin.com/in/sarahmitchell-jd',
    website: 'www.johndeere.com',
    primaryNeed: 'Products',
    keyProductNeeds: 'Multispectral drone sensors, NIR imaging systems, portable field spectrometers',
    keyServiceNeeds: 'Sensor integration, calibration services, firmware updates',
    spectralRangeUsed: 'NIR (700–1000 nm), SWIR (1000–2500 nm)',
    currentInstrumentSetup: 'FLIR Duo Pro R + Micasense RedEdge on UAV platforms',
    primaryUseCase: 'Crop health monitoring, yield prediction, soil moisture analysis',
    decisionMakers: 'VP Technology, R&D Director, Procurement Head',
    currentSupplier: 'Micasense / FLIR / Sentera',
    procurementModel: 'OEM integration + direct purchase',
    priorityLevel: 'High',
    expectedOpportunitySize: 'Large (USD 2M+/yr)',
    plannedProjects: 'Next-gen combine sensor suite, drone fleet expansion',
    benchmarkingSummary: 'Strategic account – high volume potential, integrating hyperspectral into smart farming platform'
  },
  {
    sNo: 2,
    companyName: 'Siemens Healthineers – Imaging Division',
    parentGroup: 'Siemens AG',
    country: 'Germany',
    cityRegion: 'Erlangen – Bavaria Medical Hub',
    industry: 'Healthcare & Life Sciences',
    applicationSegment: 'Medical Imaging & Diagnostics',
    keyContact: 'Prof. Klaus Bauer',
    designation: 'Director – Optical Imaging R&D',
    email: 'k.bauer@siemens-healthineers.com',
    phone: '+49 9131 84-0',
    linkedIn: 'linkedin.com/in/klausbauer-siemens',
    website: 'www.siemens-healthineers.com',
    primaryNeed: 'Both',
    keyProductNeeds: 'Hyperspectral imaging modules, SWIR cameras, intraoperative imaging sensors',
    keyServiceNeeds: 'System integration, regulatory compliance support, calibration',
    spectralRangeUsed: 'VIS (400–700 nm), NIR (700–1000 nm)',
    currentInstrumentSetup: 'Custom hyperspectral endoscopy prototypes + Hamamatsu sensors',
    primaryUseCase: 'Tissue differentiation, intraoperative tumor margin detection',
    decisionMakers: 'Chief Medical Officer, R&D Director, Procurement Steering',
    currentSupplier: 'Hamamatsu / Photon etc / imec',
    procurementModel: 'Strategic OEM partnership + co-development',
    priorityLevel: 'High',
    expectedOpportunitySize: 'Large (USD 3M+/yr)',
    plannedProjects: 'HSI-based surgical navigation system (2025–2027)',
    benchmarkingSummary: 'Premium segment – long-term R&D partner, high regulatory barrier but high switching cost'
  },
  {
    sNo: 3,
    companyName: 'Nestlé – Quality Control Labs',
    parentGroup: 'Nestlé S.A.',
    country: 'Switzerland',
    cityRegion: 'Vevey – Lac Léman Food Valley',
    industry: 'Food & Beverage',
    applicationSegment: 'Food Quality Inspection & Adulteration Detection',
    keyContact: 'Isabelle Fontaine',
    designation: 'Global Head – Analytical Sciences',
    email: 'i.fontaine@nestle.com',
    phone: '+41 21 924 2111',
    linkedIn: 'linkedin.com/in/isabellefontaine-nestle',
    website: 'www.nestle.com',
    primaryNeed: 'Products',
    keyProductNeeds: 'NIR inline process analyzers, handheld SWIR spectrometers, hyperspectral line-scan cameras',
    keyServiceNeeds: 'Annual calibration, method development, technical support',
    spectralRangeUsed: 'NIR (900–2500 nm), SWIR',
    currentInstrumentSetup: 'Bruker MPA II + PerkinElmer Frontier inline units',
    primaryUseCase: 'Moisture/fat/protein quantification, foreign body detection, packaging integrity',
    decisionMakers: 'Global Quality Director, Plant Manager, Central Procurement',
    currentSupplier: 'Bruker / PerkinElmer / Thermo Fisher',
    procurementModel: 'Global framework contracts + local procurement',
    priorityLevel: 'Medium',
    expectedOpportunitySize: 'Medium (USD 800K–1.5M/yr)',
    plannedProjects: 'AI-enhanced NIR platform rollout (120 plants, 2024–2026)',
    benchmarkingSummary: 'High volume, standardized platform buyer – focus on cost-competitive NIR solutions'
  },
  {
    sNo: 4,
    companyName: 'BASF – Process Analytics',
    parentGroup: 'BASF SE',
    country: 'Germany',
    cityRegion: 'Ludwigshafen – Rhine-Ruhr Industrial Corridor',
    industry: 'Industrial & Manufacturing',
    applicationSegment: 'Chemical Process Monitoring & Quality Control',
    keyContact: 'Dr. Michael Schreiber',
    designation: 'Senior Manager – Process Analytical Technology',
    email: 'm.schreiber@basf.com',
    phone: '+49 621 60-0',
    linkedIn: 'linkedin.com/in/michaelschreiber-basf',
    website: 'www.basf.com',
    primaryNeed: 'Both',
    keyProductNeeds: 'SWIR inline spectrometers, Raman/NIR hybrid sensors, fixed process monitoring units',
    keyServiceNeeds: 'Hazardous area certification, installation, PAT method development',
    spectralRangeUsed: 'SWIR (1000–2500 nm), Mid-IR (2500–25000 nm)',
    currentInstrumentSetup: 'ABB Spectrometer suite + custom process probes',
    primaryUseCase: 'Reaction monitoring, blend endpoint detection, impurity quantification',
    decisionMakers: 'R&D Director, Process Engineering Lead, Global Procurement',
    currentSupplier: 'ABB / Endress+Hauser / Sartorius',
    procurementModel: 'Long-term service contracts + capital purchase',
    priorityLevel: 'High',
    expectedOpportunitySize: 'Large (USD 2.5M+/yr)',
    plannedProjects: 'Industry 4.0 smart plant spectral analytics upgrade (2025)',
    benchmarkingSummary: 'Strategic industrial account – moving toward real-time spectral QC across 6 Verbund sites'
  },
  {
    sNo: 5,
    companyName: 'U.S. Environmental Protection Agency (EPA)',
    parentGroup: 'U.S. Federal Government',
    country: 'U.S.',
    cityRegion: 'Washington, D.C. – Research Triangle Park, NC',
    industry: 'Environmental Monitoring',
    applicationSegment: 'Atmospheric & Water Quality Monitoring',
    keyContact: 'Dr. Linda Chavez',
    designation: 'Lead Scientist – Remote Sensing Division',
    email: 'l.chavez@epa.gov',
    phone: '+1 919 541-3905',
    linkedIn: 'linkedin.com/in/lindachavez-epa',
    website: 'www.epa.gov',
    primaryNeed: 'Products',
    keyProductNeeds: 'UV-VIS spectrometers, LWIR gas analyzers, portable field hyperspectral imagers',
    keyServiceNeeds: 'Deployment support, field calibration, data analytics integration',
    spectralRangeUsed: 'UV (200–400 nm), VIS (400–700 nm), LWIR (8–14 µm)',
    currentInstrumentSetup: 'Ocean Optics STS + Gasmet DX4030 FTIR field units',
    primaryUseCase: 'GHG monitoring, pollutant dispersion mapping, water contaminant detection',
    decisionMakers: 'Office Director, Program Manager, Contracting Officer',
    currentSupplier: 'Ocean Insight / Gasmet / Aeroqual',
    procurementModel: 'Government contracts (GSA schedules) + grants',
    priorityLevel: 'Medium',
    expectedOpportunitySize: 'Medium (USD 1M–2M per contract cycle)',
    plannedProjects: 'National ambient air monitoring network upgrade (2025–2028)',
    benchmarkingSummary: 'Government procurement – long cycles but stable; key reference customer for credibility'
  },
  {
    sNo: 6,
    companyName: 'Leonardo S.p.A. – Electronics Division',
    parentGroup: 'Leonardo S.p.A.',
    country: 'Italy',
    cityRegion: 'Rome / Florence – Aerospace & Defense Cluster',
    industry: 'Other (Aerospace & Defense)',
    applicationSegment: 'Airborne & Satellite Hyperspectral Reconnaissance',
    keyContact: 'Eng. Marco Ferretti',
    designation: 'Chief Engineer – Electro-Optical Systems',
    email: 'm.ferretti@leonardo.com',
    phone: '+39 06 324 731',
    linkedIn: 'linkedin.com/in/marcoferretti-leonardo',
    website: 'www.leonardo.com',
    primaryNeed: 'Both',
    keyProductNeeds: 'Airborne SWIR/MWIR hyperspectral imagers, ruggedized form-factor sensors, real-time onboard processing',
    keyServiceNeeds: 'Military-grade integration, export compliance, MRO (maintenance, repair, overhaul)',
    spectralRangeUsed: 'SWIR (0.9–2.5 µm), MWIR (3–5 µm)',
    currentInstrumentSetup: 'Internal proprietary SERSIM system + Specim AisaFENIX',
    primaryUseCase: 'ISR (Intelligence, Surveillance, Reconnaissance), target discrimination, camouflage detection',
    decisionMakers: 'Program Director, Chief Procurement Officer, Ministry of Defense liaisons',
    currentSupplier: 'Specim / ITAR-controlled U.S. vendors / internal development',
    procurementModel: 'Government defence contracts + co-development agreements',
    priorityLevel: 'High',
    expectedOpportunitySize: 'Large (USD 4M+ per program)',
    plannedProjects: 'Next-gen surveillance drone payload (2025–2029), NATO interoperability upgrade',
    benchmarkingSummary: 'High-value defense account – long procurement cycles, demanding specs; flagship reference win for defense market entry'
  },
  {
    sNo: 7,
    companyName: 'Indian Institute of Remote Sensing (IIRS)',
    parentGroup: 'ISRO / Dept. of Space, Govt. of India',
    country: 'India',
    cityRegion: 'Dehradun – Himalayan Research Belt',
    industry: 'Other (Research & Academia)',
    applicationSegment: 'Satellite & Airborne Remote Sensing Research',
    keyContact: 'Dr. Anil Rathore',
    designation: 'Head – Geospatial Data Analysis',
    email: 'a.rathore@iirs.gov.in',
    phone: '+91 135 274 4201',
    linkedIn: 'linkedin.com/in/anilrathore-iirs',
    website: 'www.iirs.gov.in',
    primaryNeed: 'Products',
    keyProductNeeds: 'Ground-truth portable hyperspectral spectrometers, UAV-mounted multispectral sensors, lab spectroradiometers',
    keyServiceNeeds: 'Training, calibration, research collaboration',
    spectralRangeUsed: 'VIS–NIR (400–2500 nm)',
    currentInstrumentSetup: 'ASD FieldSpec 4 + Specim IQ portable hyperspectral camera',
    primaryUseCase: 'Land cover mapping, mineral exploration, vegetation analysis',
    decisionMakers: 'Director, Project Scientist, Finance Committee',
    currentSupplier: 'Malvern Panalytical (ASD) / Specim / ISRO in-house',
    procurementModel: 'Government tender / GeM portal',
    priorityLevel: 'Medium',
    expectedOpportunitySize: 'Small–Medium (USD 200K–600K per project)',
    plannedProjects: 'Hyperspectral lab upgrade, field campaign fleet (2024–2026)',
    benchmarkingSummary: 'Academic/government account – budget-constrained but high influence on industry adoption in APAC'
  },
  {
    sNo: 8,
    companyName: 'Tyson Foods – Food Safety Division',
    parentGroup: 'Tyson Foods Inc.',
    country: 'U.S.',
    cityRegion: 'Springdale, AR – Food Processing Corridor',
    industry: 'Food & Beverage',
    applicationSegment: 'Meat & Protein Quality Inspection',
    keyContact: 'Jennifer Holt',
    designation: 'Director – Quality Assurance Technology',
    email: 'j.holt@tysonfoods.com',
    phone: '+1 479 290-4000',
    linkedIn: 'linkedin.com/in/jenniferholt-tyson',
    website: 'www.tysonfoods.com',
    primaryNeed: 'Products',
    keyProductNeeds: 'NIR online sorting systems, hyperspectral line-scan cameras for conveyor integration, portable handheld units',
    keyServiceNeeds: 'USDA compliance support, inline installation, predictive maintenance',
    spectralRangeUsed: 'NIR (900–1700 nm), SWIR',
    currentInstrumentSetup: 'Key Technology VERYX sorters + Viavi MicroNIR handheld',
    primaryUseCase: 'Fat/protein/moisture analysis, bone fragment detection, freshness assessment',
    decisionMakers: 'VP Quality & Food Safety, Plant Operations Manager, Procurement',
    currentSupplier: 'Viavi / Key Technology / Tomra',
    procurementModel: 'Capital equipment procurement + service contracts',
    priorityLevel: 'High',
    expectedOpportunitySize: 'Large (USD 1.5M+/yr across plants)',
    plannedProjects: 'Plant-wide inline NIR rollout (14 facilities, 2025–2027)',
    benchmarkingSummary: 'High-volume industrial food customer – standardized NIR platform across global facilities'
  }
]

interface PropositionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Proposition({ title, isOpen, onToggle, children }: PropositionProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-lg font-semibold text-black">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-2 pb-4 bg-white rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  )
}

interface CustomerIntelligenceDatabaseProps {
  title?: string
  height?: number
}

export default function CustomerIntelligenceDatabase({ title }: CustomerIntelligenceDatabaseProps) {
  const [openProposition, setOpenProposition] = useState<number | null>(1)

  const toggleProposition = (num: number) => {
    setOpenProposition(openProposition === num ? null : num)
  }

  // Proposition 1 – Basic: Customer Information + Contact Details
  const renderProposition1Table = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr>
            <th colSpan={6} className="bg-[#2E4057] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Customer Information
            </th>
            <th colSpan={6} className="bg-[#048A81] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Contact Details
            </th>
          </tr>
          <tr>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[50px]">S.No.</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">Company / Organization Name</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Parent Group</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[80px]">Country</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">City / Region</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Industry / Application Segment</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Key Contact Person</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Designation / Department</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">Email Address</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[140px]">Phone / WhatsApp</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[160px]">LinkedIn Profile</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Website URL</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-3 py-2 text-center text-black">{row.sNo}</td>
              <td className="border border-gray-300 px-3 py-2 text-black font-medium">{row.companyName}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.parentGroup}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.country}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.cityRegion}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.industry} – {row.applicationSegment}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyContact}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.designation}</td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.phone}</td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`https://${row.linkedIn}`} target="_blank" rel="noopener noreferrer">{row.linkedIn}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`https://${row.website}`} target="_blank" rel="noopener noreferrer">{row.website}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Proposition 2 – Advanced: + Needs & Pain Points + Spectral Usage Details
  const renderProposition2Table = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr>
            <th colSpan={6} className="bg-[#2E4057] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Customer Information
            </th>
            <th colSpan={6} className="bg-[#048A81] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Contact Details
            </th>
            <th colSpan={3} className="bg-[#E07A5F] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Needs & Pain Points
            </th>
            <th colSpan={3} className="bg-[#6A4C93] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Spectral Usage & Setup
            </th>
          </tr>
          <tr>
            {/* Customer Info */}
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[50px]">S.No.</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">Company Name</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Parent Group</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[80px]">Country</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">City / Region</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Industry</th>
            {/* Contact Details */}
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Key Contact</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Designation</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[170px]">Email</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Phone</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">LinkedIn</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Website</th>
            {/* Needs & Pain Points */}
            <th className="bg-[#F5C8BE] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">
              <div>Primary Need</div>
              <div className="font-normal text-[10px] text-gray-700">(Products / Services / Both)</div>
            </th>
            <th className="bg-[#F5C8BE] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">
              <div>Key Product Needs</div>
              <div className="font-normal text-[10px] text-gray-700">(sensor type, spectral range, form factor)</div>
            </th>
            <th className="bg-[#F5C8BE] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">
              <div>Key Service Needs</div>
              <div className="font-normal text-[10px] text-gray-700">(calibration, integration, support)</div>
            </th>
            {/* Spectral Usage */}
            <th className="bg-[#DDD5E8] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[160px]">
              <div>Spectral Range Used</div>
              <div className="font-normal text-[10px] text-gray-700">(UV / VIS / NIR / SWIR / MWIR / LWIR)</div>
            </th>
            <th className="bg-[#DDD5E8] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">
              <div>Current Instrument Setup</div>
              <div className="font-normal text-[10px] text-gray-700">(make/model/deployment)</div>
            </th>
            <th className="bg-[#DDD5E8] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">
              <div>Primary Use Case</div>
              <div className="font-normal text-[10px] text-gray-700">(application description)</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-3 py-2 text-center text-black">{row.sNo}</td>
              <td className="border border-gray-300 px-3 py-2 text-black font-medium">{row.companyName}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.parentGroup}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.country}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.cityRegion}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.industry}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyContact}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.designation}</td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.phone}</td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`https://${row.linkedIn}`} target="_blank" rel="noopener noreferrer">{row.linkedIn}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`https://${row.website}`} target="_blank" rel="noopener noreferrer">{row.website}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.primaryNeed}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyProductNeeds}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyServiceNeeds}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.spectralRangeUsed}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.currentInstrumentSetup}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.primaryUseCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Proposition 3 – Premium: + Purchasing Behaviour + Opportunity & Project Status + CMI Insights
  const renderProposition3Table = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr>
            <th colSpan={6} className="bg-[#2E4057] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Customer Information
            </th>
            <th colSpan={6} className="bg-[#048A81] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Contact Details
            </th>
            <th colSpan={3} className="bg-[#E07A5F] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Needs & Pain Points
            </th>
            <th colSpan={3} className="bg-[#6A4C93] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Spectral Usage & Setup
            </th>
            <th colSpan={3} className="bg-[#1D7874] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Purchasing Behaviour
            </th>
            <th colSpan={3} className="bg-[#CC5803] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              Opportunity & Project Status
            </th>
            <th colSpan={1} className="bg-[#393E41] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-white">
              CMI Insights
            </th>
          </tr>
          <tr>
            {/* Customer Info */}
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[50px]">S.No.</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">Company Name</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Parent Group</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[80px]">Country</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">City / Region</th>
            <th className="bg-[#D6E4F0] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Industry</th>
            {/* Contact Details */}
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Key Contact</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Designation</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[170px]">Email</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Phone</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">LinkedIn</th>
            <th className="bg-[#C8EDE9] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Website</th>
            {/* Needs & Pain Points */}
            <th className="bg-[#F5C8BE] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[130px]">Primary Need</th>
            <th className="bg-[#F5C8BE] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">Key Product Needs</th>
            <th className="bg-[#F5C8BE] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">Key Service Needs</th>
            {/* Spectral Usage */}
            <th className="bg-[#DDD5E8] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[150px]">Spectral Range Used</th>
            <th className="bg-[#DDD5E8] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">Current Instrument Setup</th>
            <th className="bg-[#DDD5E8] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">Primary Use Case</th>
            {/* Purchasing Behaviour */}
            <th className="bg-[#B2DFDB] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">
              <div>Decision Makers</div>
              <div className="font-normal text-[10px] text-gray-700">(roles involved in purchase)</div>
            </th>
            <th className="bg-[#B2DFDB] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">
              <div>Current Supplier(s)</div>
              <div className="font-normal text-[10px] text-gray-700">(OEM / distributor / in-house)</div>
            </th>
            <th className="bg-[#B2DFDB] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[170px]">
              <div>Procurement Model</div>
              <div className="font-normal text-[10px] text-gray-700">(direct / tender / contract / OEM)</div>
            </th>
            {/* Opportunity & Project Status */}
            <th className="bg-[#FFD9B3] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[160px]">
              <div>Priority Level</div>
              <div className="font-normal text-[10px] text-gray-700">(Low / Medium / High)</div>
            </th>
            <th className="bg-[#FFD9B3] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[180px]">
              <div>Expected Opportunity Size</div>
              <div className="font-normal text-[10px] text-gray-700">(USD range / annual spend)</div>
            </th>
            <th className="bg-[#FFD9B3] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[200px]">
              <div>Planned Projects / Triggers</div>
              <div className="font-normal text-[10px] text-gray-700">(expansion, upgrade, R&D, compliance)</div>
            </th>
            {/* CMI Insights */}
            <th className="bg-[#CFD8DC] border border-gray-300 px-3 py-2 text-left font-semibold text-black min-w-[220px]">
              <div>Customer Benchmarking Summary</div>
              <div className="font-normal text-[10px] text-gray-700">(Strategic / Growth / Maintenance)</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-3 py-2 text-center text-black">{row.sNo}</td>
              <td className="border border-gray-300 px-3 py-2 text-black font-medium">{row.companyName}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.parentGroup}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.country}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.cityRegion}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.industry}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyContact}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.designation}</td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.phone}</td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`https://${row.linkedIn}`} target="_blank" rel="noopener noreferrer">{row.linkedIn}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-blue-600 hover:underline">
                <a href={`https://${row.website}`} target="_blank" rel="noopener noreferrer">{row.website}</a>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.primaryNeed}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyProductNeeds}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.keyServiceNeeds}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.spectralRangeUsed}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.currentInstrumentSetup}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.primaryUseCase}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.decisionMakers}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.currentSupplier}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.procurementModel}</td>
              <td className={`border border-gray-300 px-3 py-2 font-semibold ${row.priorityLevel === 'High' ? 'text-red-600' : row.priorityLevel === 'Medium' ? 'text-amber-600' : 'text-green-600'}`}>
                {row.priorityLevel}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.expectedOpportunitySize}</td>
              <td className="border border-gray-300 px-3 py-2 text-black">{row.plannedProjects}</td>
              <td className="border border-gray-300 px-3 py-2 text-black italic">{row.benchmarkingSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-black mb-2">Customer Intelligence Database</h2>
      <p className="text-sm text-gray-600 mb-6">
        Spectral Sensors Market – Key end-user accounts across Agriculture, Healthcare &amp; Life Sciences, Food &amp; Beverage, Industrial &amp; Manufacturing, Environmental Monitoring, and Aerospace &amp; Defense / Research segments.
      </p>

      <Proposition
        title="Proposition 1 – Basic: Customer Directory"
        isOpen={openProposition === 1}
        onToggle={() => toggleProposition(1)}
      >
        <p className="text-xs text-gray-500 px-4 mb-3">Customer Information + Contact Details. Covers company name, industry, country, and key contact data.</p>
        {renderProposition1Table()}
      </Proposition>

      <Proposition
        title="Proposition 2 – Advanced: Needs & Spectral Setup"
        isOpen={openProposition === 2}
        onToggle={() => toggleProposition(2)}
      >
        <p className="text-xs text-gray-500 px-4 mb-3">All Proposition 1 data + Needs & Pain Points + Spectral Usage details including current instrument setup and primary use case.</p>
        {renderProposition2Table()}
      </Proposition>

      <Proposition
        title="Proposition 3 – Premium: Full Intelligence Profile"
        isOpen={openProposition === 3}
        onToggle={() => toggleProposition(3)}
      >
        <p className="text-xs text-gray-500 px-4 mb-3">Complete profile including Purchasing Behaviour, Opportunity & Project Status, and CMI Benchmarking Insights for strategic account targeting.</p>
        {renderProposition3Table()}
      </Proposition>
    </div>
  )
}
