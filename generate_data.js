const fs = require('fs');
const path = require('path');

const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

/** Countries under Africa (image 4); Russia & Australia are standalone regions */
const AFRICA_COUNTRIES = [
  'South Africa',
  'Ghana',
  'Mali',
  'Burkina Faso',
  'Tanzania',
  "Côte d'Ivoire",
  'Zimbabwe',
  'Democratic Republic of the Congo',
  'Guinea',
  'Sudan',
  'Mauritania',
];

const AFRICA_COUNTRY_SHARES = {
  'South Africa': 0.22,
  Ghana: 0.1,
  Mali: 0.08,
  'Burkina Faso': 0.07,
  Tanzania: 0.09,
  "Côte d'Ivoire": 0.08,
  Zimbabwe: 0.06,
  'Democratic Republic of the Congo': 0.12,
  Guinea: 0.05,
  Sudan: 0.07,
  Mauritania: 0.06,
};

const GEO_BASE_2021 = {
  Africa: 55,
  Russia: 42,
  Australia: 38,
};

const GEO_GROWTH = {
  Africa: 0.092,
  Russia: 0.071,
  Australia: 0.081,
};

/**
 * Nested share trees (sums = 1 per segment type). Keys match UI copy from reference images.
 */
const SEGMENT_STRUCTURES = {
  'By Raw Material Source': {
    'Coal-Based Activated Carbon': {
      'Bituminous Coal-Based': 0.14,
      'Lignite/Sub-Bituminous Coal-Based': 0.1,
      'Anthracite Coal-Based': 0.08,
    },
    'Coconut Shell-Based Activated Carbon': 0.32,
    'Wood-Based Activated Carbon': 0.14,
    'Peat-Based Activated Carbon': 0.09,
    'Other Biomass-Based Activated Carbon (Bamboo-Based, etc.)': 0.13,
  },
  'By Product Form': {
    'Powdered Activated Carbon (PAC)': 0.36,
    'Granular Activated Carbon (GAC)': 0.39,
    'Extruded / Pelletized Activated Carbon (EAC)': 0.14,
    'Others (Bead / Spherical Activated Carbon, etc.)': 0.11,
  },
  'Application / Use Case': {
    'Gold Mining': {
      'Carbon-in-Leach (CIL)': 0.038,
      'Carbon-in-Pulp (CIP)': 0.032,
      'Carbon-in-Column (CIC)': 0.02,
      Others: 0.01,
    },
    'Other Mining & Metallurgical Processing': {
      'Precious Metal Recovery': 0.042,
      'Base Metal Process Purification': 0.028,
      'Metallurgical Water Treatment': 0.02,
      Others: 0.01,
    },
    'Water Treatment': {
      'Potable / Drinking Water Treatment': 0.12,
      'Industrial Water Treatment': 0.1,
      'Wastewater / Effluent Treatment': 0.09,
      'Mine Water Treatment': 0.05,
    },
    'Air & Gas Purification': 0.075,
    'Food & Beverage Processing': 0.065,
    'Pharmaceutical & Life Sciences Processing': 0.055,
    'Chemical & Industrial Processing': 0.085,
    'Oil, Gas & Energy-Linked Purification': 0.075,
    'Others (Consumer, Commercial & Specialty Filtration, etc.)': 0.08,
  },
  'By Supply Type': {
    'Virgin Activated Carbon': 0.72,
    'Reactivated / Regenerated Activated Carbon': 0.28,
  },
};

/** Per-leaf growth multiplier vs geography CAGR (segment-type-relative noise) */
const LEAF_MULTIPLIERS = {
  // By Raw Material Source — coal grades
  'Bituminous Coal-Based': 1.02,
  'Lignite/Sub-Bituminous Coal-Based': 1.05,
  'Anthracite Coal-Based': 0.98,
  'Coconut Shell-Based Activated Carbon': 1.08,
  'Wood-Based Activated Carbon': 1.04,
  'Peat-Based Activated Carbon': 0.96,
  'Other Biomass-Based Activated Carbon (Bamboo-Based, etc.)': 1.12,
  // By Product Form
  'Powdered Activated Carbon (PAC)': 0.97,
  'Granular Activated Carbon (GAC)': 1.0,
  'Extruded / Pelletized Activated Carbon (EAC)': 1.06,
  'Others (Bead / Spherical Activated Carbon, etc.)': 1.1,
  // Application leaves
  'Carbon-in-Leach (CIL)': 1.05,
  'Carbon-in-Pulp (CIP)': 1.03,
  'Carbon-in-Column (CIC)': 1.04,
  'Precious Metal Recovery': 1.06,
  'Base Metal Process Purification': 1.02,
  'Metallurgical Water Treatment': 1.01,
  'Potable / Drinking Water Treatment': 0.99,
  'Industrial Water Treatment': 1.0,
  'Wastewater / Effluent Treatment': 1.03,
  'Mine Water Treatment': 1.07,
  'Air & Gas Purification': 1.04,
  'Food & Beverage Processing': 1.02,
  'Pharmaceutical & Life Sciences Processing': 1.09,
  'Chemical & Industrial Processing': 1.01,
  'Oil, Gas & Energy-Linked Purification': 1.0,
  'Others (Consumer, Commercial & Specialty Filtration, etc.)': 1.05,
  // By Supply Type
  'Virgin Activated Carbon': 1.0,
  'Reactivated / Regenerated Activated Carbon': 1.08,
};

// “Others” keys share one multiplier where not listed
const DEFAULT_LEAF_MULT = 1.03;

const volumePerMillionUSD = 920;

let seed = 42;
function seededRandom() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function addNoise(value, noiseLevel = 0.028) {
  return value * (1 + (seededRandom() - 0.5) * 2 * noiseLevel);
}

function roundTo1(val) {
  return Math.round(val * 10) / 10;
}

function roundToInt(val) {
  return Math.round(val);
}

function generateTimeSeries(baseValue, growthRate, roundFn) {
  const series = {};
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const rawValue = baseValue * Math.pow(1 + growthRate, i);
    series[year] = roundFn(addNoise(rawValue));
  }
  return series;
}

function leafMultiplier(name) {
  return LEAF_MULTIPLIERS[name] ?? DEFAULT_LEAF_MULT;
}

/** Build nested segment objects with time series from share tree */
function buildSegmentsForGeo(totalBase, geoGrowth, structure, roundFn) {
  const out = {};
  for (const [key, val] of Object.entries(structure)) {
    if (typeof val === 'number') {
      const mult = leafMultiplier(key);
      const g = geoGrowth * mult;
      const base = totalBase * val;
      out[key] = generateTimeSeries(base, g, roundFn);
    } else {
      out[key] = buildSegmentsForGeo(totalBase, geoGrowth, val, roundFn);
    }
  }
  return out;
}

function buildByRegionBlock(roundFn, multiplier) {
  const africaNested = {};

  for (const c of AFRICA_COUNTRIES) {
    const share = AFRICA_COUNTRY_SHARES[c];
    const base = GEO_BASE_2021.Africa * multiplier * share;
    const gv = GEO_GROWTH.Africa * (1 + (seededRandom() - 0.5) * 0.05);
    africaNested[c] = generateTimeSeries(base, gv, roundFn);
  }

  const rBase = GEO_BASE_2021.Russia * multiplier;
  const rGrowth = GEO_GROWTH.Russia * (1 + (seededRandom() - 0.5) * 0.04);
  const auBase = GEO_BASE_2021.Australia * multiplier;
  const auGrowth = GEO_GROWTH.Australia * (1 + (seededRandom() - 0.5) * 0.04);

  return {
    Africa: africaNested,
    Russia: generateTimeSeries(rBase, rGrowth, roundFn),
    Australia: generateTimeSeries(auBase, auGrowth, roundFn),
  };
}

function buildGeoPayload(totalMarketBase, geoGrowth, roundFn) {
  const payload = {};
  for (const segType of Object.keys(SEGMENT_STRUCTURES)) {
    payload[segType] = buildSegmentsForGeo(
      totalMarketBase,
      geoGrowth,
      SEGMENT_STRUCTURES[segType],
      roundFn
    );
  }
  return payload;
}

/**
 * Sum child time-series into each parent node so paths like "Gold Mining" and
 * "Coal-Based Activated Carbon" exist in value.json / volume.json with year keys.
 * filterData keeps leaf rows out when a parent is selected only if the parent aggregate exists.
 */
function rollupSegmentTree(node, roundFn) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return;

  const keys = Object.keys(node);
  const childKeys = keys.filter(
    (k) => !/^\d{4}$/.test(k) && k !== 'CAGR' && !String(k).startsWith('_')
  );

  const childObjects = [];
  for (const ck of childKeys) {
    const ch = node[ck];
    if (ch && typeof ch === 'object' && !Array.isArray(ch)) {
      rollupSegmentTree(ch, roundFn);
      childObjects.push(ch);
    }
  }

  if (childObjects.length === 0) return;

  const years = new Set();
  for (const ch of childObjects) {
    for (const k of Object.keys(ch)) {
      if (/^\d{4}$/.test(k)) years.add(k);
    }
  }
  for (const y of years) {
    let sum = 0;
    for (const ch of childObjects) {
      const v = ch[y];
      if (v !== undefined && v !== null) sum += Number(v);
    }
    node[y] = roundFn(sum);
  }
}

/** Roll up each category under a segment type (e.g. Gold Mining, Coal-Based), not the segment-type root. */
function rollupSegmentTypeBlock(block, roundFn) {
  if (!block || typeof block !== 'object') return;
  const keys = Object.keys(block);
  const childKeys = keys.filter(
    (k) => !/^\d{4}$/.test(k) && k !== 'CAGR' && !String(k).startsWith('_')
  );
  for (const ck of childKeys) {
    const ch = block[ck];
    if (ch && typeof ch === 'object' && !Array.isArray(ch)) {
      rollupSegmentTree(ch, roundFn);
    }
  }
}

function rollupAllMarketSegmentTrees(data, roundFn) {
  const segTypes = Object.keys(SEGMENT_STRUCTURES);
  for (const geo of Object.keys(data)) {
    const block = data[geo];
    if (!block || typeof block !== 'object') continue;
    for (const st of segTypes) {
      if (block[st]) rollupSegmentTypeBlock(block[st], roundFn);
    }
  }
}

function generateData(isVolume) {
  const roundFn = isVolume ? roundToInt : roundTo1;
  const mult = isVolume ? volumePerMillionUSD : 1;
  const data = {};

  const worldTotal = (GEO_BASE_2021.Africa + GEO_BASE_2021.Russia + GEO_BASE_2021.Australia) * mult;
  const worldGrowth =
    (GEO_GROWTH.Africa * GEO_BASE_2021.Africa +
      GEO_GROWTH.Russia * GEO_BASE_2021.Russia +
      GEO_GROWTH.Australia * GEO_BASE_2021.Australia) /
    (GEO_BASE_2021.Africa + GEO_BASE_2021.Russia + GEO_BASE_2021.Australia);

  data.Global = {
    ...buildGeoPayload(worldTotal, worldGrowth, roundFn),
    'By Region': buildByRegionBlock(roundFn, mult),
  };

  // Africa — country-level full segments
  for (const c of AFRICA_COUNTRIES) {
    const share = AFRICA_COUNTRY_SHARES[c];
    const countryTotal = GEO_BASE_2021.Africa * mult * share;
    const gv = GEO_GROWTH.Africa * (1 + (seededRandom() - 0.5) * 0.045);
    data[c] = buildGeoPayload(countryTotal, gv, roundFn);
  }

  const rTotal = GEO_BASE_2021.Russia * mult;
  const rG = GEO_GROWTH.Russia * (1 + (seededRandom() - 0.5) * 0.035);
  data.Russia = buildGeoPayload(rTotal, rG, roundFn);

  const auTotal = GEO_BASE_2021.Australia * mult;
  const auG = GEO_GROWTH.Australia * (1 + (seededRandom() - 0.5) * 0.035);
  data.Australia = buildGeoPayload(auTotal, auG, roundFn);

  return data;
}

seed = 42;
const valueData = generateData(false);
rollupAllMarketSegmentTrees(valueData, roundTo1);
seed = 7777;
const volumeData = generateData(true);
rollupAllMarketSegmentTrees(volumeData, roundToInt);

const outDir = path.join(__dirname, 'public', 'data');
fs.writeFileSync(path.join(outDir, 'value.json'), JSON.stringify(valueData, null, 2));
fs.writeFileSync(path.join(outDir, 'volume.json'), JSON.stringify(volumeData, null, 2));

console.log('Generated activated carbon value.json and volume.json');
console.log('Top-level geographies:', Object.keys(valueData));
console.log(
  'Segment types on Global:',
  Object.keys(valueData.Global).filter((k) => k !== 'By Region')
);
