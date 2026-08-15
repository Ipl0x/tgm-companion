import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const html = await readFile('community-data.html', 'utf8');
const styles = await readFile('css/community-data.css', 'utf8');
const controller = await readFile('src/app/community-data.js', 'utf8');
const pwa = await readFile('src/app/pwa.js', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');
const feed = JSON.parse(await readFile('assets/community/submissions.json', 'utf8'));

test('Community Data page exposes the review workflow without fabricated submissions', async () => {
  await access('community-data.html');
  await access('css/community-data.css');
  await access('src/app/community-data.js');
  assert.match(html, /COMMUNITY VERIFICATION/);
  assert.match(html, /Needs review/);
  assert.match(html, /Cross-checking/);
  assert.match(html, /Verified/);
  assert.match(html, /Maintainer approval/);
  assert.match(html, /No community submissions published yet/);
  assert.match(styles, /\.community-submission/);
  assert.deepEqual(feed, { version: 1, generatedAt: null, submissions: [] });
});

test('Community Data page supports safe client-side filtering and issue links', () => {
  assert.match(controller, /import '\.\/pwa\.js'/);
  assert.match(controller, /assets\/community\/submissions\.json/);
  assert.match(controller, /communityTypeFilter/);
  assert.match(controller, /communityStatusFilter/);
  assert.match(controller, /communitySearch/);
  assert.match(controller, /REPOSITORY_ISSUE_URL/);
  assert.match(controller, /textContent =/);
  assert.doesNotMatch(controller, /submission\.innerHTML/);
});

test('Community Data provides all structured submission entry points', () => {
  assert.match(html, /template=investment_data_submission\.yml/);
  assert.match(html, /template=star_up_data_submission\.yml/);
  assert.match(html, /template=wiki_tip_correction\.yml/);
});

test('Community Data is exposed by shared navigation/footer and cached offline', () => {
  assert.match(pwa, /ensureCommunityNavigation/);
  assert.match(pwa, /href = 'community-data\.html'/);
  assert.match(pwa, /<a href="community-data\.html">Community Data<\/a>/);
  assert.match(serviceWorker, /\.\/community-data\.html/);
  assert.match(serviceWorker, /\.\/css\/community-data\.css/);
  assert.match(serviceWorker, /\.\/src\/app\/community-data\.js/);
  assert.match(serviceWorker, /\.\/assets\/community\/submissions\.json/);
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v18'/);
});
