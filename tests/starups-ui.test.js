import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const starupsController = await readFile('src/app/starups.js', 'utf8');

test('building cards do not expose internal IDs', () => {
  assert.doesNotMatch(starupsController, /building-cat\">ID \$\{building\.id\}/);
  assert.match(starupsController, /building-cat\">Current stars/);
});
