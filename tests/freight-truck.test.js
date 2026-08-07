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
  { level: 1, originalTime: '2D 14:52:23', timeSeconds: 226343, resources: { cash: 2039715, arms: 671132, cargo: 710611, metal: 855365, diamonds: 1315945, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 904, influenceIncrease: 3907 },
  { level: 2, originalTime: '3D 06:35:29', timeSeconds: 282929, resources: { cash: 2549644, arms: 838915, cargo: 888263, metal: 1069206, diamonds: 1644931, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1085, influenceIncrease: 4298 },
  { level: 3, originalTime: '4D 02:14:21', timeSeconds: 353661, resources: { cash: 3187055, arms: 1048644, cargo: 1110329, metal: 1336507, diamonds: 2056164, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1325, influenceIncrease: 9028 },
  { level: 4, originalTime: '5D 02:47:56', timeSeconds: 442076, resources: { cash: 3983818, arms: 1310805, cargo: 1387911, metal: 1670634, diamonds: 2570205, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1636, influenceIncrease: 18962 },
  { level: 5, originalTime: '6D 09:29:55', timeSeconds: 552595, resources: { cash: 4979772, arms: 1638506, cargo: 1734889, metal: 2088292, diamonds: 3212756, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 2044, influenceIncrease: 39827 }
];

const EXPECTED_HIJACK_BOOST_LEVELS = [
  { level: 1, originalTime: '1D 07:02:06', timeSeconds: 111726, resources: { cash: 1006831, arms: 331280, cargo: 350767, metal: 422220, diamonds: 649568, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 516, influenceIncrease: 192, prerequisites: [{ name: 'Basic Resource', level: 1 }] },
  { level: 2, originalTime: '1D 14:47:37', timeSeconds: 139657, resources: { cash: 1258539, arms: 414100, cargo: 438459, metal: 527775, diamonds: 811960, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 635, influenceIncrease: 210, prerequisites: [] },
  { level: 3, originalTime: '2D 00:29:32', timeSeconds: 174572, resources: { cash: 1573171, arms: 517624, cargo: 548073, metal: 659717, diamonds: 1014949, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 746, influenceIncrease: 442, prerequisites: [] },
  { level: 4, originalTime: '2D 12:36:55', timeSeconds: 218215, resources: { cash: 1966465, arms: 647031, cargo: 685091, metal: 824647, diamonds: 1268687, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 879, influenceIncrease: 928, prerequisites: [] },
  { level: 5, originalTime: '3D 03:46:08', timeSeconds: 272768, resources: { cash: 2458080, arms: 808788, cargo: 856364, metal: 1030808, diamonds: 1585858, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1051, influenceIncrease: 1948, prerequisites: [] },
  { level: 6, originalTime: '3D 22:42:40', timeSeconds: 340960, resources: { cash: 3072601, arms: 1010985, cargo: 1070455, metal: 1288510, diamonds: 1982323, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1282, influenceIncrease: 4093, prerequisites: [] },
  { level: 7, originalTime: '4D 22:23:20', timeSeconds: 426200, resources: { cash: 3840750, arms: 1263731, cargo: 1338068, metal: 1610637, diamonds: 2447903, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1577, influenceIncrease: 8597, prerequisites: [] },
  { level: 8, originalTime: '6D 03:59:10', timeSeconds: 532750, resources: { cash: 4800938, arms: 1579664, cargo: 1672585, metal: 2013297, diamonds: 3097379, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 1971, influenceIncrease: 18056, prerequisites: [] },
  { level: 9, originalTime: '7D 16:58:57', timeSeconds: 665937, resources: { cash: 6001173, arms: 1974580, cargo: 2090731, metal: 2516621, diamonds: 3871724, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 2462, influenceIncrease: 37924, prerequisites: [] },
  { level: 10, originalTime: '9D 15:13:41', timeSeconds: 832421, resources: { cash: 7501464, arms: 2468224, cargo: 2468224, metal: 3145776, diamonds: 4839654, oil: 0, crypto_coins: 0, family_currency: 0, family_insignia: 0 }, goldApprox: 3076, influenceIncrease: 79653, prerequisites: [{ name: 'Basic Resource', level: 5 }] }
];

function plainKnownLevels(investment) {
  return investment.knownLevels.map(level => ({
    level: level.level,
    originalTime: level.originalTime,
    timeSeconds: level.timeSeconds,
    resources: { ...level.resources },
    goldApprox: level.goldApprox,
    influenceIncrease: level.influenceIncrease,
    prerequisites: level.prerequisites.map(prerequisite => ({ ...prerequisite }))
  }));
}

test('Freight Truck is ordered between Kingpins and Advanced Defenses', () => {
  assert.match(investmentController, /1, 2, 3, 5, FREIGHT_TRUCK_CATEGORY\.id, 7/);
  assert.equal(FREIGHT_TRUCK_CATEGORY.name, 'Freight Truck');
});

test('Freight Truck exposes the requested construction tree', () => {
  assert.deepEqual(
    FREIGHT_TRUCK_CATEGORY.investments.map(investment => investment.name),
    ['Basic Resource', 'Hijack Boost', 'Safeguard Boost', 'Faster Shipment', 'Lucky Hijack', 'Lucky Recovery', 'Extra Run', 'Ultimate Protection']
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
  assert.equal(investment.maxLevel, 5);
  assert.equal(investment.dataComplete, true);
  assert.equal(investment.knownLevels.length, 5);
  const actual = plainKnownLevels(investment).map(({ prerequisites, ...level }) => level);
  assert.deepEqual(actual, EXPECTED_BASIC_RESOURCE_LEVELS);
  assert.ok(investment.knownLevels.every(level => level.prerequisites.length === 0));
});

test('Hijack Boost has complete source data for levels 1 through 10', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Hijack Boost');
  assert.equal(investment.maxLevel, 10);
  assert.equal(investment.dataComplete, true);
  assert.equal(investment.knownLevels.length, 10);
  assert.deepEqual(plainKnownLevels(investment), EXPECTED_HIJACK_BOOST_LEVELS);
  assert.deepEqual(investment.knownLevels[0].prerequisites, [{ name: 'Basic Resource', level: 1 }]);
  assert.deepEqual(investment.knownLevels[9].prerequisites, [{ name: 'Basic Resource', level: 5 }]);
  assert.ok(investment.knownLevels.slice(1, 9).every(level => level.prerequisites.length === 0));
});

test('Extra Run has exactly one level and uses the supplied data', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Extra Run');
  assert.equal(investment.maxLevel, 1);
  assert.equal(investment.knownLevel.level, 1);
  assert.equal(investment.knownLevels, undefined);
  assert.deepEqual(investment.knownLevel.resources, EXPECTED_EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES);
  assert.equal(investment.knownLevel.influenceIncrease, 152043);
  assert.deepEqual(investment.knownLevel.prerequisites, [
    { name: 'Lucky Hijack', level: 5 },
    { name: 'Lucky Recovery', level: 5 }
  ]);
});

test('Ultimate Protection has exactly one level and depends only on Extra Run level 1', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Ultimate Protection');
  assert.equal(investment.maxLevel, 1);
  assert.equal(investment.knownLevel.level, 1);
  assert.equal(investment.knownLevels, undefined);
  assert.deepEqual(investment.knownLevel.resources, EXPECTED_EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES);
  assert.equal(investment.knownLevel.influenceIncrease, 152043);
  assert.deepEqual(investment.knownLevel.prerequisites, [{ name: 'Extra Run', level: 1 }]);
  assert.equal(investment.knownLevel.prerequisites.some(item => item.name === 'Investment Center'), false);
});

test('known Freight Truck data supports complete and partial browsing without enabling incomplete totals', () => {
  assert.match(investmentController, /underConstruction/);
  assert.match(investmentController, /button\.hidden = construction/);
  assert.match(legacyControls, /dataset\.construction === 'true'/);
  assert.match(investmentsHtml, /id="investmentConstructionNotice"/);
  assert.match(investmentsHtml, /src\/app\/freight-truck-known-data\.js/);
  assert.match(knownDataController, /function levelsFor\(investment\)/);
  assert.match(knownDataController, /data is complete for levels 1–/);
  assert.match(knownDataController, /setText\('inv_time_human', level\.originalTime \|\| 'Unknown'\)/);
  assert.match(knownDataController, /setText\('inv_gold', level\.goldApprox == null \? 'Unknown' : number\(level\.goldApprox\)\)/);
  assert.doesNotMatch(knownDataController, /`~\$\{number\(level\.goldApprox\)\}`/);
  assert.match(knownDataController, /Not calculated/);
  assert.match(knownDataController, /levelActions\.hidden = levels\.length <= 1/);
  assert.match(knownDataController, /totals\.hidden = true/);
  assert.match(knownDataController, /event\.stopImmediatePropagation\(\)/);
});

test('Freight Truck known data is available offline', () => {
  assert.match(serviceWorker, /\.\/src\/investments\/construction\.js/);
  assert.match(serviceWorker, /\.\/src\/app\/freight-truck-known-data\.js/);
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v\d+'/);
});
