import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { issueToSubmission, parseIssueSections, statusFromLabels } from '../scripts/build-community-feed.mjs';
import { publicationRecord } from '../scripts/export-approved-submission.mjs';

const html = await readFile('community-data.html', 'utf8');
const styles = await readFile('css/community-data.css', 'utf8');
const controller = await readFile('src/app/community-data.js', 'utf8');
const pwa = await readFile('src/app/pwa.js', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');
const feedWorkflow = await readFile('.github/workflows/community-data.yml', 'utf8');
const reviewWorkflow = await readFile('.github/workflows/community-review.yml', 'utf8');
const ciWorkflow = await readFile('.github/workflows/test.yml', 'utf8');
const approvedReadme = await readFile('data/community/approved/README.md', 'utf8');
const feed = JSON.parse(await readFile('assets/community/submissions.json', 'utf8'));

test('Community Data page exposes the complete review and publication lifecycle', async () => {
  await access('community-data.html');
  await access('css/community-data.css');
  await access('src/app/community-data.js');
  assert.match(html, /COMMUNITY VERIFICATION/);
  assert.match(html, />Submitted</);
  assert.match(html, />Needs review</);
  assert.match(html, />Cross-checking</);
  assert.match(html, />Verified candidate</);
  assert.match(html, />Maintainer approved</);
  assert.match(html, />Published</);
  assert.match(html, /status:\*/);
  assert.match(html, /publication pull request/i);
  assert.match(styles, /data-status="verified-candidate"/);
  assert.match(styles, /data-status="approved"/);
  assert.match(styles, /data-status="published"/);
  assert.deepEqual(feed, { version: 1, generatedAt: null, submissions: [] });
});

test('Community Data reads the live issue feed and keeps a local offline fallback', () => {
  assert.match(controller, /raw\.githubusercontent\.com\/Ipl0x\/tgm-companion\/community-feed\/assets\/community\/submissions\.json/);
  assert.match(controller, /LOCAL_FEED_URL = 'assets\/community\/submissions\.json'/);
  assert.match(controller, /Connected to GitHub Issues/);
  assert.match(controller, /Offline\/local snapshot/);
  assert.match(controller, /verified-candidate/);
  assert.match(controller, /Maintainer approved/);
  assert.match(controller, /Published/);
  assert.match(controller, /communityTypeFilter/);
  assert.match(controller, /communityStatusFilter/);
  assert.match(controller, /communitySearch/);
  assert.match(controller, /REPOSITORY_ISSUE_URL/);
  assert.match(controller, /textContent =/);
  assert.doesNotMatch(controller, /submission\.innerHTML/);
});

test('Community feed workflow rebuilds on Submit Data issue changes and publishes to a separate branch', () => {
  assert.match(feedWorkflow, /issues:/);
  assert.match(feedWorkflow, /opened, edited, closed, reopened, labeled, unlabeled/);
  assert.match(feedWorkflow, /workflow_dispatch:/);
  assert.match(feedWorkflow, /contents: write/);
  assert.match(feedWorkflow, /issues: read/);
  assert.match(feedWorkflow, /community-feed/);
  assert.match(feedWorkflow, /build-community-feed\.mjs/);
  assert.match(feedWorkflow, /git push origin HEAD:community-feed/);
});

test('review workflow keeps one controlled status and creates a publication PR only after approval', () => {
  assert.match(reviewWorkflow, /status:needs-review/);
  assert.match(reviewWorkflow, /status:cross-checking/);
  assert.match(reviewWorkflow, /status:verified-candidate/);
  assert.match(reviewWorkflow, /status:approved/);
  assert.match(reviewWorkflow, /status:published/);
  assert.match(reviewWorkflow, /status:rejected/);
  assert.match(reviewWorkflow, /target === 'published' && actor !== 'github-actions\[bot\]'/);
  assert.match(reviewWorkflow, /status:published is system-owned/);
  assert.match(reviewWorkflow, /community\/issue-\$\{ISSUE_NUMBER\}-approved/);
  assert.match(reviewWorkflow, /export-approved-submission\.mjs/);
  assert.match(reviewWorkflow, /data\/community\/approved\/issue-\$\{ISSUE_NUMBER\}\.json/);
  assert.match(reviewWorkflow, /gh pr create/);
  assert.match(reviewWorkflow, /Allow GitHub Actions to create and approve pull requests/);
  assert.match(reviewWorkflow, /remove and re-add \\`status:approved\\` to retry/);
  assert.match(reviewWorkflow, /gh workflow run test\.yml --ref/);
  assert.match(reviewWorkflow, /state_reason: 'completed'/);
  assert.doesNotMatch(reviewWorkflow, /git push origin (?:HEAD:)?main/);
  assert.match(ciWorkflow, /workflow_dispatch:/);
  assert.match(approvedReadme, /does \*\*not\*\* write directly to `main`/);
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
    state: 'open',
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

test('review labels map to the new lifecycle and keep legacy verified compatible', () => {
  assert.equal(statusFromLabels([{ name: 'status:cross-checking' }]), 'cross-checking');
  assert.equal(statusFromLabels([{ name: 'status:verified-candidate' }]), 'verified-candidate');
  assert.equal(statusFromLabels([{ name: 'status:verified' }]), 'verified-candidate');
  assert.equal(statusFromLabels([{ name: 'status:approved' }]), 'approved');
  assert.equal(statusFromLabels([{ name: 'status:published' }]), 'published');
  assert.equal(statusFromLabels([{ name: 'status:rejected' }]), 'rejected');
  assert.equal(statusFromLabels([]), 'needs-review');
});

test('approved submissions produce deterministic maintained source records', () => {
  const issue = {
    number: 42,
    html_url: 'https://github.com/Ipl0x/tgm-companion/issues/42',
    title: '[Data][Investment]: Hijack Boost',
    body: '### Investment category\n\nFreight Truck\n\n### Investment name\n\nHijack Boost\n\n### Investment level\n\n10\n\n### Cash\n\n7,501,464',
    state: 'open',
    labels: [{ name: 'status:approved' }],
    updated_at: '2026-08-19T20:00:00Z'
  };
  const record = publicationRecord(issue, '2026-08-19T20:05:00Z');
  assert.equal(record.sourceIssue, 42);
  assert.equal(record.status, 'approved');
  assert.equal(record.type, 'investment');
  assert.equal(record.category, 'Freight Truck');
  assert.equal(record.investment, 'Hijack Boost');
  assert.equal(record.level, 10);
  assert.equal(record.values.cash, '7,501,464');
  assert.equal(record.approvedAt, '2026-08-19T20:05:00Z');
  assert.throws(() => publicationRecord({ ...issue, labels: [{ name: 'status:needs-review' }] }), /not maintainer approved/);
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
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v20'/);
});
