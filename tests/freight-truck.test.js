import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FREIGHT_TRUCK_CATEGORY } from '../src/investments/construction.js';

const investmentController = await readFile('src/app/investments.js', 'utf8');
const legacyControls = await readFile('src/app/investments-legacy-controls.js', 'utf8');
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

test('Freight Truck never invents unavailable progress or calculation data', () => {
  assert.match(investmentController, /underConstruction/);
  assert.match(investmentController, /Details pending/);
  assert.match(investmentController, /is still under construction because not all data is available for this investment yet/);
  assert.match(investmentController, /button\.hidden = construction/);
  assert.match(legacyControls, /dataset\.construction === 'true'/);
  assert.match(investmentsHtml, /id="investmentConstructionNotice"/);
});

test('Freight Truck construction data is available offline', () => {
  assert.match(serviceWorker, /\.\/src\/investments\/construction\.js/);
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v8'/);
});
