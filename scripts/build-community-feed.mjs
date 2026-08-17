import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const STATUS_ORDER = ['needs-review', 'cross-checking', 'verified', 'rejected'];

export function parseIssueSections(body = '') {
  const sections = new Map();
  let heading = null;
  let buffer = [];

  const flush = () => {
    if (!heading) return;
    sections.set(heading.toLocaleLowerCase(), buffer.join('\n').trim());
  };

  for (const line of String(body).split(/\r?\n/)) {
    const match = line.match(/^###\s+(.+?)\s*$/);
    if (match) {
      flush();
      heading = match[1].trim();
      buffer = [];
      continue;
    }
    if (heading) buffer.push(line);
  }
  flush();
  return sections;
}

function section(sections, ...names) {
  for (const name of names) {
    const value = sections.get(String(name).toLocaleLowerCase());
    if (value) return value;
  }
  return '';
}

export function classifyIssue(title = '') {
  if (/^\[Data\]\[Investment\]:/i.test(title)) return 'investment';
  if (/^\[Data\]\[Star-Up\]:/i.test(title)) return 'star-up';
  if (/^\[Wiki\]:/i.test(title)) return 'wiki';
  return null;
}

export function statusFromLabels(labels = []) {
  const names = labels
    .map(label => typeof label === 'string' ? label : label?.name)
    .filter(Boolean)
    .map(name => String(name).toLocaleLowerCase());

  for (const status of STATUS_ORDER) {
    if (names.includes(`status:${status}`) || names.includes(status)) return status;
  }
  return 'needs-review';
}

function cleanTitle(title = '') {
  return String(title)
    .replace(/^\[Data\]\[Investment\]:\s*/i, '')
    .replace(/^\[Data\]\[Star-Up\]:\s*/i, '')
    .replace(/^\[Wiki\]:\s*/i, '')
    .trim();
}

function toPositiveInteger(value) {
  const match = String(value || '').match(/\d+/);
  if (!match) return undefined;
  const number = Number(match[0]);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function compactValues(entries) {
  return Object.fromEntries(entries.filter(([, value]) => value !== '' && value != null));
}

export function issueToSubmission(issue) {
  if (!issue || issue.pull_request) return null;
  const type = classifyIssue(issue.title);
  if (!type) return null;

  const sections = parseIssueSections(issue.body);
  const base = {
    issue: issue.number,
    url: issue.html_url,
    type,
    status: statusFromLabels(issue.labels),
    updatedAt: issue.updated_at,
    reports: 1
  };

  if (type === 'investment') {
    const category = section(sections, 'Investment category');
    const investment = section(sections, 'Investment name');
    const levelText = section(sections, 'Investment level');
    const level = toPositiveInteger(levelText);
    return {
      ...base,
      title: [category, investment, level ? `Lv. ${level}` : ''].filter(Boolean).join(' · ') || cleanTitle(issue.title),
      category,
      investment,
      item: investment,
      ...(level ? { level } : {}),
      summary: 'Community-submitted Investment source data. Review the GitHub issue and evidence before official use.',
      values: compactValues([
        ['originalTime', section(sections, 'Original investment time shown by the game')],
        ['cash', section(sections, 'Cash')],
        ['arms', section(sections, 'Arms')],
        ['cargo', section(sections, 'Cargo')],
        ['metal', section(sections, 'Metal')],
        ['diamonds', section(sections, 'Diamonds')],
        ['oil', section(sections, 'Oil')],
        ['cryptoCoins', section(sections, 'Crypto Coins')],
        ['familyCurrency', section(sections, 'Family Currency')],
        ['familyInsignia', section(sections, 'Family Insignia')],
        ['gold', section(sections, 'Gold')],
        ['influence', section(sections, 'Influence')],
        ['prerequisites', section(sections, 'Investment prerequisites / dependencies')],
        ['evidence', section(sections, 'Screenshots / evidence')]
      ])
    };
  }

  if (type === 'star-up') {
    const building = section(sections, 'Building name');
    const target = section(sections, 'Target Star-Up level / step');
    return {
      ...base,
      title: [building, target].filter(Boolean).join(' · ') || cleanTitle(issue.title),
      building,
      item: building,
      summary: 'Community-submitted Building Star-Up source data. Review the GitHub issue and evidence before official use.',
      values: compactValues([
        ['currentStar', section(sections, 'Current completed star level')],
        ['targetStep', target],
        ['familyCurrency', section(sections, 'Family Currency')],
        ['familyInsignia', section(sections, 'Family Insignia')],
        ['prerequisites', section(sections, 'Required buildings / prerequisites')],
        ['evidence', section(sections, 'Screenshots / evidence')]
      ])
    };
  }

  const wikiSection = section(sections, 'Wiki section');
  const topic = section(sections, 'Topic / article');
  return {
    ...base,
    title: topic || cleanTitle(issue.title),
    category: wikiSection,
    topic,
    item: topic,
    summary: section(sections, 'Proposed tip / correction') || 'Community-submitted Wiki tip or correction awaiting review.',
    values: compactValues([
      ['submissionType', section(sections, 'Submission type')],
      ['currentContent', section(sections, 'Current Wiki content')],
      ['proposedContent', section(sections, 'Proposed tip / correction')],
      ['context', section(sections, 'Why this should be added or changed')],
      ['evidence', section(sections, 'Screenshots / evidence')]
    ])
  };
}

async function fetchAllIssues(token, repository) {
  const issues = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`https://api.github.com/repos/${repository}/issues?state=all&per_page=100&page=${page}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'tgm-companion-community-feed'
      }
    });
    if (!response.ok) throw new Error(`GitHub Issues API returned ${response.status}: ${await response.text()}`);
    const pageItems = await response.json();
    issues.push(...pageItems);
    if (pageItems.length < 100) break;
  }
  return issues;
}

export async function buildCommunityFeed({ token, repository, generatedAt = new Date().toISOString() }) {
  const issues = await fetchAllIssues(token, repository);
  const submissions = issues
    .map(issueToSubmission)
    .filter(Boolean)
    .sort((a, b) => Number(b.issue || 0) - Number(a.issue || 0));
  return { version: 1, generatedAt, submissions };
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const outputPath = process.argv[2];
  if (!token) throw new Error('GITHUB_TOKEN is required.');
  if (!repository) throw new Error('GITHUB_REPOSITORY is required.');
  if (!outputPath) throw new Error('Output path is required.');

  const feed = await buildCommunityFeed({ token, repository });
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');
  console.log(`Published ${feed.submissions.length} community submissions to ${outputPath}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
