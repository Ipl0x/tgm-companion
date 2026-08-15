import './pwa.js';

const THEME_KEY = 'tgm-theme';
const FEED_URL = 'assets/community/submissions.json';
const REPOSITORY_ISSUE_URL = /^https:\/\/github\.com\/Ipl0x\/tgm-companion\/issues\/\d+$/i;
const STATUS_LABELS = Object.freeze({
  'needs-review': 'Needs review',
  'cross-checking': 'Cross-checking',
  verified: 'Verified',
  rejected: 'Rejected'
});
const TYPE_LABELS = Object.freeze({
  investment: 'Investment',
  'star-up': 'Star-Up',
  wiki: 'Wiki'
});

const elements = {
  theme: document.getElementById('communityThemeBtn'),
  search: document.getElementById('communitySearch'),
  type: document.getElementById('communityTypeFilter'),
  status: document.getElementById('communityStatusFilter'),
  feedStatus: document.getElementById('communityFeedStatus'),
  generatedAt: document.getElementById('communityGeneratedAt'),
  resultCount: document.getElementById('communityResultCount'),
  list: document.getElementById('communitySubmissionList'),
  empty: document.getElementById('communityEmptyState'),
  noMatches: document.getElementById('communityNoMatches'),
  needsReview: document.getElementById('needsReviewCount'),
  crossChecking: document.getElementById('crossCheckingCount'),
  verified: document.getElementById('verifiedCount'),
  total: document.getElementById('totalSubmissionCount')
};

let submissions = [];
let feedAvailable = false;

function normalize(value) {
  return String(value ?? '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

function validStatus(value) {
  return Object.hasOwn(STATUS_LABELS, value) ? value : 'needs-review';
}

function validType(value) {
  return Object.hasOwn(TYPE_LABELS, value) ? value : 'investment';
}

function issueUrl(submission) {
  const direct = String(submission.url || '');
  if (REPOSITORY_ISSUE_URL.test(direct)) return direct;
  const issue = Number(submission.issue);
  return Number.isInteger(issue) && issue > 0
    ? `https://github.com/Ipl0x/tgm-companion/issues/${issue}`
    : '';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function submissionTitle(submission) {
  if (submission.title) return String(submission.title);
  const parts = [submission.category, submission.item || submission.investment || submission.building || submission.topic]
    .filter(Boolean)
    .map(String);
  const level = Number(submission.level);
  if (Number.isFinite(level) && level > 0) parts.push(`Lv. ${level}`);
  return parts.join(' · ') || 'Community submission';
}

function submissionSearchText(submission) {
  return normalize([
    submissionTitle(submission),
    submission.issue,
    submission.type,
    submission.status,
    submission.category,
    submission.item,
    submission.investment,
    submission.building,
    submission.topic,
    submission.level,
    submission.reports,
    JSON.stringify(submission.values || {})
  ].join(' '));
}

function createText(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createSubmissionCard(submission) {
  const type = validType(submission.type);
  const status = validStatus(submission.status);
  const card = document.createElement('article');
  card.className = 'community-submission';
  card.dataset.type = type;
  card.dataset.status = status;

  const main = document.createElement('div');
  main.className = 'community-submission-main';

  const top = document.createElement('div');
  top.className = 'community-submission-top';
  top.append(createText('span', 'community-type', TYPE_LABELS[type]));
  const statusBadge = createText('span', 'community-status', STATUS_LABELS[status]);
  statusBadge.dataset.status = status;
  top.append(statusBadge);

  const title = createText('h3', '', submissionTitle(submission));
  const summary = createText('p', '', String(submission.summary || 'Community-submitted source data awaiting or completing review.'));

  const meta = document.createElement('div');
  meta.className = 'community-submission-meta';
  const issue = Number(submission.issue);
  if (Number.isInteger(issue) && issue > 0) {
    const issueMeta = document.createElement('span');
    issueMeta.append('Issue ', createText('strong', '', `#${issue}`));
    meta.append(issueMeta);
  }
  if (submission.category) {
    const categoryMeta = document.createElement('span');
    categoryMeta.append('Category ', createText('strong', '', String(submission.category)));
    meta.append(categoryMeta);
  }
  if (submission.level) {
    const levelMeta = document.createElement('span');
    levelMeta.append('Level ', createText('strong', '', String(submission.level)));
    meta.append(levelMeta);
  }
  const updated = formatDate(submission.updatedAt || submission.updated_at);
  if (updated) {
    const updatedMeta = document.createElement('span');
    updatedMeta.append('Updated ', createText('strong', '', updated));
    meta.append(updatedMeta);
  }

  main.append(top, title, summary, meta);

  const side = document.createElement('div');
  side.className = 'community-submission-side';
  const reports = Math.max(1, Number(submission.reports) || 1);
  const reportsBlock = document.createElement('div');
  reportsBlock.className = 'community-reports';
  reportsBlock.append(createText('strong', '', String(reports)), document.createTextNode(reports === 1 ? ' report' : ' reports'));
  side.append(reportsBlock);

  const url = issueUrl(submission);
  if (url) {
    const link = createText('a', 'community-issue-link', 'View GitHub issue →');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    side.append(link);
  }

  card.append(main, side);
  return card;
}

function updateCounts() {
  const counts = submissions.reduce((result, submission) => {
    const status = validStatus(submission.status);
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {});
  elements.needsReview.textContent = counts['needs-review'] || 0;
  elements.crossChecking.textContent = counts['cross-checking'] || 0;
  elements.verified.textContent = counts.verified || 0;
  elements.total.textContent = submissions.length;
}

function render() {
  const query = normalize(elements.search?.value);
  const typeFilter = elements.type?.value || 'all';
  const statusFilter = elements.status?.value || 'all';
  const filtered = submissions.filter(submission => {
    const type = validType(submission.type);
    const status = validStatus(submission.status);
    if (typeFilter !== 'all' && type !== typeFilter) return false;
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    return !query || submissionSearchText(submission).includes(query);
  });

  elements.list.replaceChildren(...filtered.map(createSubmissionCard));
  elements.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'submission' : 'submissions'}`;
  elements.empty.hidden = submissions.length !== 0 || !feedAvailable;
  elements.noMatches.hidden = submissions.length === 0 || filtered.length !== 0;
}

function initializeTheme() {
  if (localStorage.getItem(THEME_KEY) === 'light') document.documentElement.classList.add('light');
  elements.theme?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem(THEME_KEY, document.documentElement.classList.contains('light') ? 'light' : 'dark');
  });
}

async function loadFeed() {
  try {
    const response = await fetch(FEED_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Community feed returned ${response.status}`);
    const payload = await response.json();
    submissions = Array.isArray(payload.submissions) ? payload.submissions.filter(item => item && typeof item === 'object') : [];
    feedAvailable = true;
    elements.feedStatus.textContent = submissions.length ? 'Connected' : 'Ready · waiting for issue sync';
    const generated = formatDate(payload.generatedAt);
    elements.generatedAt.textContent = generated ? `Last generated ${generated}` : 'No generated issue snapshot yet';
  } catch (error) {
    console.error('Unable to load community submission feed.', error);
    submissions = [];
    feedAvailable = false;
    elements.feedStatus.textContent = 'Feed unavailable';
    elements.generatedAt.textContent = 'The review page is still available.';
  }

  updateCounts();
  render();
}

elements.search?.addEventListener('input', render);
elements.search?.addEventListener('search', render);
elements.type?.addEventListener('change', render);
elements.status?.addEventListener('change', render);

initializeTheme();
await loadFeed();
