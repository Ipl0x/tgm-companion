import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const footerController = await readFile('src/app/pwa.js', 'utf8');
const footerStyles = await readFile('css/footer.css', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');
const wikiSubmissionForm = await readFile('.github/ISSUE_TEMPLATE/wiki_tip_correction.yml', 'utf8');

test('shared project footer exposes Wiki, repository, contribution, and data submission links', async () => {
  await access('css/footer.css');
  assert.match(footerController, /className = 'site-footer'/);
  assert.match(footerController, /<a href="wiki\.html">Wiki<\/a>/);
  assert.match(footerController, /github\.com\/Ipl0x\/tgm-companion/);
  assert.match(footerController, /github\.com\/Ipl0x\/tgm-companion\/issues/);
  assert.match(footerController, /issues\/new\?template=feature_request\.yml/);
  assert.match(footerController, /Request feature/);
  assert.match(footerController, /Submit data/);
  assert.match(footerController, /issues\/new\?template=investment_data_submission\.yml/);
  assert.match(footerController, /Investment data/);
  assert.match(footerController, /issues\/new\?template=star_up_data_submission\.yml/);
  assert.match(footerController, /Star-Up data/);
  assert.match(footerController, /issues\/new\?template=wiki_tip_correction\.yml/);
  assert.match(footerController, /Wiki tip \/ correction/);
  assert.match(footerController, /CONTRIBUTING\.md/);
  assert.match(footerController, /CHANGELOG\.md/);
  assert.match(footerStyles, /\.footer-data-menu/);
  assert.match(footerStyles, /\.footer-data-options/);
});

test('Wiki tip and correction submission form collects reviewable community guidance', async () => {
  await access('.github/ISSUE_TEMPLATE/wiki_tip_correction.yml');
  assert.match(wikiSubmissionForm, /name: Submit Wiki tip \/ correction/);
  assert.match(wikiSubmissionForm, /New tip \/ strategy/);
  assert.match(wikiSubmissionForm, /Correction to existing Wiki content/);
  assert.match(wikiSubmissionForm, /label: Wiki section/);
  assert.match(wikiSubmissionForm, /label: Proposed tip \/ correction/);
  assert.match(wikiSubmissionForm, /label: Screenshots \/ evidence/);
  assert.match(wikiSubmissionForm, /reviewed before being published/);
});

test('footer styles are available offline', () => {
  assert.match(serviceWorker, /\.\/css\/footer\.css/);
});
