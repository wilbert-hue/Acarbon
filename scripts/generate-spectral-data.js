/**
 * Generates spectral sensors market data JSON files with hierarchical By Offering
 * Run with: node scripts/generate-spectral-data.js
 */

const fs = require('fs');
const path = require('path');

const years = ['2021','2022','2023','2024','2025','2026','2027','2028','2029','2030','2031','2032','2033'];

const geoWeights = {
  'North America': 0.33,
  'U.S.': 0.27,
  'Canada': 0.06,
  'Europe': 0.26,
  'U.K.': 0.05,
  'Germany': 0.07,
  'Italy': 0.03,
  'France': 0.04,
  'Spain': 0.03,
  'Russia': 0.02,
  'Rest of Europe': 0.02,
  'Asia Pacific': 0.30,
  'China': 0.12,
  'India': 0.05,
  'Japan': 0.07,
  'South Korea': 0.03,
  'ASEAN': 0.02,
  'Australia': 0.01,
  'Rest of Asia Pacific': 0.01,
  'Latin America': 0.06,
  'Brazil': 0.025,
  'Argentina': 0.015,
  'Mexico': 0.015,
  'Rest of Latin America': 0.005,
  'Middle East & Africa': 0.05,
  'GCC': 0.025,
  'South Africa': 0.015,
  'Rest of Middle East & Africa': 0.01,
};

// Global total market values (USD millions) by year
const globalTotals = {
  '2021': 1050, '2022': 1148, '2023': 1255, '2024': 1373, '2025': 1502,
  '2026': 1643, '2027': 1797, '2028': 1966, '2029': 2150, '2030': 2352,
  '2031': 2573, '2032': 2815, '2033': 3080
};

// ─── By Offering hierarchy ────────────────────────────────────────────────────
// Parent shares of total By Offering
const offeringParentShares = {
  Hardware: 0.52,
  Software: 0.28,
  Services: 0.20,
};

// Children shares within each parent (sum to 1.0)
const offeringChildShares = {
  Hardware: {
    'Sensors & Detectors': 0.35,
    'Optical Components (Filters, Lenses, Diffraction Gratings)': 0.20,
    'Light Sources (LED, Laser)': 0.15,
    'Processing Units and Embedded Hardware': 0.20,
    'Supporting Hardware (Power Supply, Thermal, Enclosures, Connectivity)': 0.10,
  },
  Software: {
    'Spectral Data Processing & Analysis Software': 0.30,
    'AI/ML-based Spectral Interpretation Software': 0.25,
    'Imaging & Visualization Software': 0.20,
    'Calibration & Correction Software': 0.15,
    'Data Management & Integration Platforms': 0.10,
  },
  Services: {
    'System Integration & Deployment Services': 0.35,
    'Calibration & Maintenance Services': 0.25,
    'Managed Data Analysis & Interpretation Services': 0.20,
    'Training & Technical Support Services': 0.12,
    'Consulting & Custom Solution Development': 0.08,
  },
};

// CAGRs for each offering sub-item
const offeringChildCAGRs = {
  Hardware: {
    'Sensors & Detectors': '9.1%',
    'Optical Components (Filters, Lenses, Diffraction Gratings)': '8.3%',
    'Light Sources (LED, Laser)': '7.8%',
    'Processing Units and Embedded Hardware': '10.2%',
    'Supporting Hardware (Power Supply, Thermal, Enclosures, Connectivity)': '6.9%',
  },
  Software: {
    'Spectral Data Processing & Analysis Software': '15.4%',
    'AI/ML-based Spectral Interpretation Software': '18.7%',
    'Imaging & Visualization Software': '12.8%',
    'Calibration & Correction Software': '11.5%',
    'Data Management & Integration Platforms': '16.2%',
  },
  Services: {
    'System Integration & Deployment Services': '13.5%',
    'Calibration & Maintenance Services': '10.8%',
    'Managed Data Analysis & Interpretation Services': '14.9%',
    'Training & Technical Support Services': '11.2%',
    'Consulting & Custom Solution Development': '12.4%',
  },
};

// CAGRs for parent offering items
const offeringParentCAGRs = {
  Hardware: '8.5%',
  Software: '14.2%',
  Services: '12.1%',
};

// ─── Flat segment types ───────────────────────────────────────────────────────
const flatValueSegments = {
  'By Product Type': {
    shares: {
      'Hyperspectral Sensors': 0.42,
      'Multispectral Sensors': 0.58,
    },
    cagrs: {
      'Hyperspectral Sensors': '12.4%',
      'Multispectral Sensors': '9.8%',
    }
  },
  'By Technology': {
    shares: {
      'Imaging Spectral Sensors': 0.61,
      'Non-Imaging Spectral Sensors': 0.39,
    },
    cagrs: {
      'Imaging Spectral Sensors': '10.8%',
      'Non-Imaging Spectral Sensors': '9.2%',
    }
  },
  'By Spectral Range': {
    shares: {
      'Near-Infrared (NIR)': 0.28,
      'Short-Wave Infrared (SWIR)': 0.22,
      'Visible (VIS)': 0.18,
      'Mid-Wave Infrared (MWIR)': 0.14,
      'Ultraviolet (UV)': 0.10,
      'Long-Wave Infrared (LWIR)': 0.08,
    },
    cagrs: {
      'Near-Infrared (NIR)': '10.1%',
      'Short-Wave Infrared (SWIR)': '11.5%',
      'Visible (VIS)': '8.7%',
      'Mid-Wave Infrared (MWIR)': '12.3%',
      'Ultraviolet (UV)': '9.4%',
      'Long-Wave Infrared (LWIR)': '8.1%',
    }
  },
  'By Form Factor': {
    shares: {
      'Portable': 0.44,
      'Fixed and Installed': 0.56,
    },
    cagrs: {
      'Portable': '12.6%',
      'Fixed and Installed': '8.4%',
    }
  },
  'By End User': {
    shares: {
      'Agriculture': 0.22,
      'Healthcare & Life Sciences': 0.20,
      'Industrial & Manufacturing': 0.19,
      'Food & Beverage': 0.16,
      'Environmental Monitoring': 0.14,
      'Other (Aerospace & Defense, Research & Academia, etc.)': 0.09,
    },
    cagrs: {
      'Agriculture': '13.2%',
      'Healthcare & Life Sciences': '11.8%',
      'Industrial & Manufacturing': '9.5%',
      'Food & Beverage': '10.3%',
      'Environmental Monitoring': '12.1%',
      'Other (Aerospace & Defense, Research & Academia, etc.)': '8.9%',
    }
  },
};

const volumeSegments = {
  'By Product Type': {
    shares: { 'Hyperspectral Sensors': 0.35, 'Multispectral Sensors': 0.65 },
  },
  'By Form Factor': {
    shares: { 'Portable': 0.48, 'Fixed and Installed': 0.52 },
  },
  'By End User': {
    shares: {
      'Agriculture': 0.25,
      'Healthcare & Life Sciences': 0.18,
      'Industrial & Manufacturing': 0.20,
      'Food & Beverage': 0.17,
      'Environmental Monitoring': 0.13,
      'Other (Aerospace & Defense, Research & Academia, etc.)': 0.07,
    },
  },
};

const globalVolumeBase = {
  '2021': 320, '2022': 360, '2023': 405, '2024': 455, '2025': 510,
  '2026': 575, '2027': 648, '2028': 730, '2029': 822, '2030': 926,
  '2031': 1043, '2032': 1175, '2033': 1324
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function round2(val) { return Math.round(val * 10) / 10; }
function addNoise(val, pct = 0.02) { return val * (1 + (Math.random() - 0.5) * pct); }

function yearValues(totalByYear, share) {
  const obj = {};
  for (const year of years) {
    obj[year] = round2(addNoise(totalByYear[year] * share, 0.02));
  }
  return obj;
}

/**
 * Build hierarchical "By Offering" block for one geography.
 * Structure:
 *   "By Offering" -> "Hardware" -> { year data (aggregated) + children { year data } }
 */
function buildOffering(geoTotals) {
  const offering = {};

  for (const [parent, parentShare] of Object.entries(offeringParentShares)) {
    // Parent-level year values (aggregate of children, slight noise)
    const parentTotals = {};
    for (const year of years) {
      parentTotals[year] = geoTotals[year] * parentShare;
    }

    offering[parent] = {
      ...yearValues(geoTotals, parentShare),
      CAGR: offeringParentCAGRs[parent],
    };

    // Add child sub-segments as nested keys
    for (const [child, childShare] of Object.entries(offeringChildShares[parent])) {
      offering[parent][child] = {
        ...yearValues(parentTotals, childShare),
        CAGR: offeringChildCAGRs[parent][child],
      };
    }
  }

  return offering;
}

// ─── Build value.json ─────────────────────────────────────────────────────────
const valueData = {};

for (const [geo, geoShare] of Object.entries(geoWeights)) {
  const geoTotals = {};
  for (const year of years) { geoTotals[year] = globalTotals[year] * geoShare; }

  valueData[geo] = {};

  // Hierarchical By Offering
  valueData[geo]['By Offering'] = buildOffering(geoTotals);

  // Flat segments
  for (const [segType, { shares, cagrs }] of Object.entries(flatValueSegments)) {
    valueData[geo][segType] = {};
    for (const [seg, share] of Object.entries(shares)) {
      valueData[geo][segType][seg] = {
        ...yearValues(geoTotals, share),
        CAGR: cagrs ? cagrs[seg] : undefined,
      };
    }
  }

  // By Country for North America
  if (geo === 'North America') {
    valueData[geo]['By Country'] = {
      'U.S.': yearValues(geoTotals, 0.82),
      'Canada': yearValues(geoTotals, 0.18),
    };
  }
}

// ─── Build volume.json ────────────────────────────────────────────────────────
const volumeData = {};

for (const [geo, geoShare] of Object.entries(geoWeights)) {
  const geoTotals = {};
  for (const year of years) { geoTotals[year] = globalVolumeBase[year] * geoShare; }

  volumeData[geo] = {};

  for (const [segType, { shares }] of Object.entries(volumeSegments)) {
    volumeData[geo][segType] = {};
    for (const [seg, share] of Object.entries(shares)) {
      volumeData[geo][segType][seg] = yearValues(geoTotals, share);
    }
  }
}

// ─── Build segmentation_analysis.json ────────────────────────────────────────
const segData = {};

for (const geo of Object.keys(geoWeights)) {
  segData[geo] = {};

  // By Offering – hierarchical
  segData[geo]['By Offering'] = {};
  for (const [parent, children] of Object.entries(offeringChildShares)) {
    segData[geo]['By Offering'][parent] = {};
    for (const child of Object.keys(children)) {
      segData[geo]['By Offering'][parent][child] = {};
    }
  }

  // Flat segments
  for (const [segType, { shares }] of Object.entries(flatValueSegments)) {
    segData[geo][segType] = {};
    for (const seg of Object.keys(shares)) {
      segData[geo][segType][seg] = {};
    }
  }
}

// ─── Write files ──────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '..', 'public', 'data');

fs.writeFileSync(path.join(outDir, 'value.json'), JSON.stringify(valueData, null, 2));
console.log('✅ value.json written');

fs.writeFileSync(path.join(outDir, 'volume.json'), JSON.stringify(volumeData, null, 2));
console.log('✅ volume.json written');

fs.writeFileSync(path.join(outDir, 'segmentation_analysis.json'), JSON.stringify(segData, null, 2));
console.log('✅ segmentation_analysis.json written');

// Quick sanity check
const v = JSON.parse(fs.readFileSync(path.join(outDir, 'value.json'), 'utf8'));
const offering = v['North America']['By Offering'];
console.log('\nBy Offering hierarchy for North America:');
for (const [parent, val] of Object.entries(offering)) {
  const childKeys = Object.keys(val).filter(k => !/^\d{4}$/.test(k) && k !== 'CAGR');
  console.log(`  ${parent}: ${childKeys.length} children ->`, childKeys);
}
console.log('\nDone!');
