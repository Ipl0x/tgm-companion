import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FREIGHT_TRUCK_CATEGORY } from '../src/investments/construction.js';

const investmentController = await readFile('src/app/investments.js', 'utf8');
const legacyControls = await readFile('src/app/investments-legacy-controls.js', 'utf8');
const knownDataController = await readFile('src/app/freight-truck-known-data.js', 'utf8');
const investmentsHtml = await readFile('investments.html', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');

const EXPECTED_EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES = {
  cash: 33480002,
  arms: 11016001,
  cargo: 11664001,
  metal: 14040001,
  diamonds: 21600001,
  oil: 0,
  crypto_coins: 0,
  family_currency: 0,
  family_insignia: 0
};

const EXPECTED_BASIC_RESOURCE_LEVELS = [
  {
    level: 1,
    originalTime: '2D 14:52:23',
    timeSeconds: 226343,
    resources: { cash: 2039715, arms: 671132, cargo: 710611, metal: 855365, diamonds: 1315945, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 },
    goldApprox: 904,
    influenceIncrease: 3907
  },
  {
    level: 2,
    originalTime: '3D 06:35:29',
    timeSeconds: 282929,
    resources: { cash: 2549644, arms: 838915, cargo: 888263, metal: 1069206, diamonds: 1644931, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 },
    goldApprox: 1085,
    influenceIncrease: 4298
  },
  {
    level: 3,
    originalTime: '4D 02:14:21',
    timeSeconds: 353661,
    resources: { cash: 3187055, arms: 1048644, cargo: 1110329, metal: 1336507, diamonds: 2056164, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 },
    goldApprox: 1325,
    influenceIncrease: 9028
  },
  {
    level: 4,
    originalTime: '5D 02:47:56',
    timeSeconds: 442076,
    resources: { cash: 3983818, arms: 1310805, cargo: 1387911, metal: 1670634, diamonds: 2570205, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 },
    goldApprox: 1636,
    influenceIncrease: 18962
  },
  {
    level: 5,
    originalTime: '6D 09:29:55',
    timeSeconds: 552595,
    resources: { cash: 4979772, arms: 1638506, cargo: 1734889, metal: 2088292, diamonds: 3212756, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 },
    goldApprox: 2044,
    influenceIncrease: 39827
  }
];

test('Freight Truck is ordered between Kingpins and Advanced Defenses', () => {
  assert.match(investmentController, /1, 2, 3, 5, FREIGHT_TRUCK_CATEGORY\.id, 7/);
  assert.equal(FREIGHT_TRUCK_CATEGORY.name, 'Freight Truck');
});

test('Freight Truck exposes the requested construction tree', () => {
  assert.deepEqual(
    FREIGHT_TRUCK_CATEGORY.investments.map(investment => investment.name),
    [
      'Basic Resource',
      'Hijack Boost',
      'Safeguard Boost',
      'Faster Shipment',
      'Lucky Hijack',
      'Lucky Recovery',
      'Extra Run',
      'Ultimate Protection'
    ]
  );

  assert.deepEqual(FREIGHT_TRUCK_CATEGORY.layout, [
    ['', -1001, '', ''],
    [-1002, '', -1003, ''],
    ['', -1004, '', ''],
    [-1005, '', -1006, ''],
    ['', -1007, '', ''],
    ['', -1008, '', '']
  ]);
});

test('Basic Resource has complete source data for levels 1 through 5', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Basic Resource');
  assert.equal(investment.dataComplete, true);
  assert.equal(investment.knownLevels.length, 5);
  assert.equal(Math.max(...investment.knownLevels.map(level => level.level)), 5);

  const actual = investment.knownLevels.map(level => ({
    level: level.level,
    originalTime: level.originalTime,
    timeSeconds: level.timeSeconds,
    resources: { ...level.resources },
    goldApprox: level.goldApprox,
    influenceIncrease: level.influenceIncrease
  }));
  assert.deepEqual(actual, EXPECTED_BASIC_RESOURCE_LEVELS);
  assert.ok(investment.knownLevels.every(level => level.prerequisites.length === 0));
});

test('Extra Run level 1 uses the supplied resources, influence, and prerequisites', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Extra Run');
  assert.equal(investment.knownLevel.level, 1);
  assert.deepEqual(investment.knownLevel.resources, EXPECTED_EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES);
  assert.equal(investment.knownLevel.influenceIncrease, 152043);
  assert.deepEqual(investment.knownLevel.prerequisites, [
    { name: 'Lucky Hijack', level: 5 },
    { name: 'Lucky Recovery', level: 5 }
  ]);
});

test('Ultimate Protection level 1 depends only on Extra Run level 1', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Ultimate Protection');
  assert.equal(investment.knownLevel.level, 1);
  assert.deepEqual(investment.knownLevel.resources, EXPECTED_EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES);
  assert.equal(investment.knownLevel.influenceIncrease, 152043);
  assert.deepEqual(investment.knownLevel.prerequisites, [
    { name: 'Extra Run', level: 1 }
  ]);
  assert.equal(investment.knownLevel.prerequisites.some(item => item.name === 'Investment Center'), false);
});

test('known Freight Truck data supports complete multi-level browsing without enabling incomplete totals', () => {
  assert.match(investmentController, /underConstruction/);
  assert.match(investmentController, /button\.hidden = construction/);
  assert.match(legacyControls, /dataset\.construction === 'true'/);
  assert.match(investmentsHtml, /id="investmentConstructionNotice"/);
  assert.match(investmentsHtml, /src\/app\/freight-truck-known-data\.js/);
  assert.match(knownDataController, /function levelsFor\(investment\)/);
  assert.match(knownDataController, /data is complete for levels 1–/);
  assert.match(knownDataController, /Levels 1–\$\{levels\.at\(-1\)\.level\} data complete/);
  assert.match(knownDataController, /setText\('inv_time_human', level\.originalTime \|\| 'Unknown'\)/);
  assert.match(knownDataController, /`~\$\{number\(level\.goldApprox\)\}`/);
  assert.match(knownDataController, /Not calculated/);
  assert.match(knownDataController, /totals\.hidden = true/);
  assert.match(knownDataController, /event\.stopImmediatePropagation\(\)/);
});

test('Freight Truck known data is available offline', () => {
  assert.match(serviceWorker, /\.\/src\/investments\/construction\.js/);
  assert.match(serviceWorker, /\.\/src\/app\/freight-truck-known-data\.js/);
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v\d+'/);
});
