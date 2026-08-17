import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { issueToSubmission, parseIssueSections, statusFromLabels } from '../scripts/build-community-feed.mjs';

const html = await readFile('community-data.html', 'utf8');
const styles = await readFile('css/community-data.css', 'utf8');
const controller = await readFile('src/app/community-data.js', 'utf8');
const pwa = await readFile('src/app/pwa.js', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');
const workflow = await readFile('.github/workflows/community-data.yml', 'utf8');
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

test('Community Data reads the live issue feed and keeps a local offline fallback', () => {
  assert.match(controller, /raw\.githubusercontent\.com\/Ipl0x\/tgm-companion\/community-feed\/assets\/community\/submissions\.json/);
  assert.match(controller, /LOCAL_FEED_URL = 'assets\/community\/submissions\.json'/);
  assert.match(controller, /Connected to GitHub Issues/);
  assert.match(controller, /Offline\/local snapshot/);
  assert.match(controller, /communityTypeFilter/);
  assert.match(controller, /communityStatusFilter/);
  assert.match(controller, /communitySearch/);
  assert.match(controller, /REPOSITORY_ISSUE_URL/);
  assert.match(controller, /textContent =/);
  assert.doesNotMatch(controller, /submission\.innerHTML/);
});

test('Community feed workflow rebuilds on Submit Data issue changes and publishes to a separate branch', () => {
  assert.match(workflow, /issues:/);
  assert.match(workflow, /opened, edited, closed, reopened, labeled, unlabeled/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents: write/);
  assert.match(workflow, /issues: read/);
  assert.match(workflow, /community-feed/);
  assert.match(workflow, /build-community-feed\.mjs/);
  assert.match(workflow, /git push origin HEAD:community-feed/);
});

test('Investment Issue Form output is converted into a reviewable community submission', () => {
  const body = `### Investment category\n\nFreight Truck\n\n### Investment name\n\nSafeguard Boost\n\n### Investment level\n\n1\n\n### Original investment time shown by the game\n\n1D 07:00:00\n\n### Cash\n\n123\n\n### Screenshots / evidence\n\nhttps://github.com/user-attachments/assets/example`;
  const sections = parseIssueSections(body);
  assert.equal(sections.get('investment category'), 'Freight Truck');

  const submission = issueToSubmission({
    number: 18,
    html_url: 'https://github.com/Ipl0x/tgm-companion/issues/18',
    title: '[Data][Investment]: Safeguard Boost',
    body,
    labels: [{ name: 'enhancement' }],
    updated_at: '2026-08-17T18:30:00Z'
  });

  assert.equal(submission.type, 'investment');
  assert.equal(submission.status, 'needs-review');
  assert.equal(submission.category, 'Freight Truck');
  assert.equal(submission.investment, 'Safeguard Boost');
  assert.equal(submission.level, 1);
  assert.equal(submission.values.originalTime, '1D 07:00:00');
  assert.equal(submission.values.cash, '123');
  assert.equal(submission.issue, 18);
});

test('explicit review labels control the Community Data status', () => {
  assert.equal(statusFromLabels([{ name: 'status:cross-checking' }]), 'cross-checking');
  assert.equal(statusFromLabels([{ name: 'status:verified' }]), 'verified');
  assert.equal(statusFromLabels([]), 'needs-review');
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
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v19'/);
});
