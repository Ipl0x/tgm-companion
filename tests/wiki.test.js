import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const wikiHtml = await readFile('wiki.html', 'utf8');
const wikiStyles = await readFile('css/wiki.css', 'utf8');
const wikiController = await readFile('src/app/wiki.js', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');
const footerController = await readFile('src/app/pwa.js', 'utf8');
const navigationPages = await Promise.all([
  'index.html',
  'star-ups.html',
  'investments.html',
  'wiki.html'
].map(path => readFile(path, 'utf8')));

test('Wiki launches with Getting Started and Tips & Tricks content', () => {
  assert.match(wikiHtml, /TGM COMPANION WIKI/);
  assert.match(wikiHtml, /id="getting-started"/);
  assert.match(wikiHtml, />Getting Started</);
  assert.match(wikiHtml, /id="tips-tricks"/);
  assert.match(wikiHtml, />Tips &amp; Tricks</);
  assert.match(wikiHtml, /Original Time/);
  assert.match(wikiHtml, /0 and Unknown are not the same/);
  assert.match(wikiHtml, /Game data vs\. tips/);
  assert.match(wikiHtml, /Backup all/);
});

test('Wiki provides client-side article search and theme support', () => {
  assert.match(wikiHtml, /id="wikiSearch"/);
  assert.match(wikiHtml, /data-wiki-article/);
  assert.match(wikiController, /import '\.\/pwa\.js'/);
  assert.match(wikiController, /addEventListener\('input', renderSearch\)/);
  assert.match(wikiController, /article\.hidden = !matched/);
  assert.match(wikiController, /section\.hidden = !visible/);
  assert.match(wikiController, /tgm-theme/);
  assert.match(wikiStyles, /\.wiki-search-box/);
  assert.match(wikiStyles, /\.wiki-article-grid/);
});

test('Wiki is linked from every primary navigation and the shared footer', () => {
  for (const page of navigationPages) {
    assert.match(page, /href="wiki\.html"/);
    assert.match(page, />Wiki</);
  }
  assert.match(footerController, /<a href="wiki\.html">Wiki<\/a>/);
});

test('Wiki page, styles, and controller are available offline', () => {
  assert.match(serviceWorker, /\.\/wiki\.html/);
  assert.match(serviceWorker, /\.\/css\/wiki\.css/);
  assert.match(serviceWorker, /\.\/src\/app\/wiki\.js/);
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-09-v16'/);
});
