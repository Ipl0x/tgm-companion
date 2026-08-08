import './pwa.js';

const THEME_KEY = 'tgm-theme';
const search = document.getElementById('wikiSearch');
const status = document.getElementById('wikiSearchStatus');
const noResults = document.getElementById('wikiNoResults');
const articles = [...document.querySelectorAll('[data-wiki-article]')];
const sections = [...document.querySelectorAll('[data-wiki-section]')];
const themeButton = document.getElementById('wikiThemeBtn');

function normalize(value) {
  return String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

function articleSearchText(article) {
  return normalize(article.textContent);
}

const searchIndex = new Map(articles.map(article => [article, articleSearchText(article)]));

function renderSearch() {
  const query = normalize(search?.value);
  let matches = 0;

  for (const article of articles) {
    const matched = !query || searchIndex.get(article).includes(query);
    article.hidden = !matched;
    article.classList.toggle('wiki-search-match', Boolean(query && matched));
    if (matched) matches += 1;
  }

  for (const section of sections) {
    const visible = [...section.querySelectorAll('[data-wiki-article]')].some(article => !article.hidden);
    section.hidden = !visible;
  }

  if (noResults) noResults.hidden = matches !== 0;
  if (status) status.textContent = query ? `Showing ${matches} of ${articles.length} articles` : `${articles.length} articles available`;
}

function initializeTheme() {
  if (localStorage.getItem(THEME_KEY) === 'light') document.documentElement.classList.add('light');
  themeButton?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem(THEME_KEY, document.documentElement.classList.contains('light') ? 'light' : 'dark');
  });
}

search?.addEventListener('input', renderSearch);
search?.addEventListener('search', renderSearch);

initializeTheme();
renderSearch();
