import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { issueToSubmission } from './build-community-feed.mjs';

export function publicationRecord(issue, approvedAt = new Date().toISOString()) {
  const submission = issueToSubmission(issue);
  if (!submission) throw new Error('Issue is not a supported TGM Companion community submission.');
  if (submission.status !== 'approved') {
    throw new Error(`Issue #${issue?.number ?? '?'} is not maintainer approved.`);
  }

  return {
    version: 1,
    sourceIssue: submission.issue,
    sourceUrl: submission.url,
    approvedAt,
    type: submission.type,
    title: submission.title,
    status: 'approved',
    ...(submission.category ? { category: submission.category } : {}),
    ...(submission.investment ? { investment: submission.investment } : {}),
    ...(submission.building ? { building: submission.building } : {}),
    ...(submission.topic ? { topic: submission.topic } : {}),
    ...(submission.level ? { level: submission.level } : {}),
    values: submission.values || {}
  };
}

async function fetchIssue(token, repository, issueNumber) {
  const response = await fetch(`https://api.github.com/repos/${repository}/issues/${issueNumber}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tgm-companion-community-publication'
    }
  });
  if (!response.ok) throw new Error(`GitHub Issue API returned ${response.status}: ${await response.text()}`);
  return response.json();
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const issueNumber = Number(process.argv[2]);
  const outputPath = process.argv[3];

  if (!token) throw new Error('GITHUB_TOKEN is required.');
  if (!repository) throw new Error('GITHUB_REPOSITORY is required.');
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) throw new Error('A positive issue number is required.');
  if (!outputPath) throw new Error('Output path is required.');

  const issue = await fetchIssue(token, repository, issueNumber);
  const record = publicationRecord(issue);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  console.log(`Prepared approved community submission #${issueNumber} at ${outputPath}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
