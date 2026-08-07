import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FREIGHT_TRUCK_CATEGORY } from '../src/investments/construction.js';

const investmentController = await readFile('src/app/investments.js', 'utf8');
const legacyControls = await readFile('src/app/investments-legacy-controls.js', 'utf8');
const knownDataController = await readFile('src/app/freight-truck-known-data.js', 'utf8');
const investmentsHtml = await readFile('investments.html', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');

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

test('Extra Run level 1 uses the supplied resources and prerequisites', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Extra Run');
  assert.equal(investment.knownLevel.level, 1);
  assert.deepEqual(investment.knownLevel.resources, {
    cash: 33480002,
    arms: 11016001,
    cargo: 11664001,
    metal: 14040001,
    diamonds: 21600001
  });
  assert.deepEqual(investment.knownLevel.prerequisites, [
    { name: 'Lucky Hijack', level: 5 },
    { name: 'Lucky Recovery', level: 5 }
  ]);
});

test('Ultimate Protection level 1 uses the supplied resources and prerequisites', () => {
  const investment = FREIGHT_TRUCK_CATEGORY.investments.find(item => item.name === 'Ultimate Protection');
  assert.equal(investment.knownLevel.level, 1);
  assert.deepEqual(investment.knownLevel.resources, {
    cash: 33480002,
    arms: 11016001,
    cargo: 11664001,
    metal: 14040001,
    diamonds: 21600001
  });
  assert.deepEqual(investment.knownLevel.prerequisites, [
    { name: 'Extra Run', level: 1 },
    { name: 'Investment Center', level: 10 }
  ]);
});

test('Freight Truck keeps incomplete calculations disabled while showing known level details', () => {
  assert.match(investmentController, /underConstruction/);
  assert.match(investmentController, /button\.hidden = construction/);
  assert.match(legacyControls, /dataset\.construction === 'true'/);
  assert.match(investmentsHtml, /id="investmentConstructionNotice"/);
  assert.match(investmentsHtml, /src\/app\/freight-truck-known-data\.js/);
  assert.match(knownDataController, /Level \$\{investment\.knownLevel\.level\} data available/);
  assert.match(knownDataController, /not all data is available yet/);
  assert.match(knownDataController, /totals\.hidden = true/);
});

test('Freight Truck known data is available offline', () => {
  assert.match(serviceWorker, /\.\/src\/investments\/construction\.js/);
  assert.match(serviceWorker, /\.\/src\/app\/freight-truck-known-data\.js/);
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v9'/);
});
