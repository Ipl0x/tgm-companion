import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const investmentForm = await readFile('.github/ISSUE_TEMPLATE/investment_data_submission.yml', 'utf8');
const starUpForm = await readFile('.github/ISSUE_TEMPLATE/star_up_data_submission.yml', 'utf8');

test('investment data form captures source values needed for verification', () => {
  assert.match(investmentForm, /name: Submit Investment data/);
  assert.match(investmentForm, /Investment category/);
  assert.match(investmentForm, /Investment name/);
  assert.match(investmentForm, /Investment level/);
  assert.match(investmentForm, /Original investment time shown by the game/);
  assert.match(investmentForm, /not your buffed or reduced time/);

  const fields = [
    ['cash', 'Cash'],
    ['arms', 'Arms'],
    ['cargo', 'Cargo'],
    ['metal', 'Metal'],
    ['diamonds', 'Diamonds'],
    ['oil', 'Oil'],
    ['crypto_coins', 'Crypto Coins'],
    ['family_currency', 'Family Currency'],
    ['family_insignia', 'Family Insignia'],
    ['gold', 'Gold'],
    ['influence', 'Influence']
  ];

  for (const [id, label] of fields) {
    assert.match(investmentForm, new RegExp(`id: ${id}\\n    attributes:\\n      label: ${label}`));
  }

  assert.doesNotMatch(investmentForm, /id: investment_data/);
  assert.match(investmentForm, /placeholder: "Example: 33,480,002"/);
  assert.match(investmentForm, /placeholder: "Example: 0"/);
  assert.match(investmentForm, /placeholder: "Unknown"/);
  assert.match(investmentForm, /Prerequisites \/ dependencies/);
  assert.match(investmentForm, /type: upload/);
  assert.match(investmentForm, /Screenshots \/ evidence/);
  assert.match(investmentForm, /multiple independent submissions/);
});

test('investment time confirmation explicitly rejects personal buff time', () => {
  assert.match(investmentForm, /original\/base game time, not my personally buffed or reduced time/);
});

test('Star-Up data form uses persistent labels for levels and costs', () => {
  assert.match(starUpForm, /name: Submit Star-Up data/);
  assert.match(starUpForm, /id: building\n    attributes:\n      label: Building name/);
  assert.match(starUpForm, /id: current_star\n    attributes:\n      label: Current completed star level/);
  assert.match(starUpForm, /id: target_step\n    attributes:\n      label: Target Star-Up level \/ step/);
  assert.match(starUpForm, /id: family_currency\n    attributes:\n      label: Family Currency/);
  assert.match(starUpForm, /id: family_insignia\n    attributes:\n      label: Family Insignia/);
  assert.doesNotMatch(starUpForm, /id: costs/);
  assert.match(starUpForm, /placeholder: "Example: 1,234,567"/);
  assert.match(starUpForm, /placeholder: "Example: 12,345"/);
  assert.match(starUpForm, /Required buildings \/ prerequisites/);
  assert.match(starUpForm, /type: upload/);
  assert.match(starUpForm, /Screenshots \/ evidence/);
  assert.match(starUpForm, /multiple independent submissions/);
});
