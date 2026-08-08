function ensurePwaHeadLinks() {
  const links = [
    { rel: 'manifest', href: 'manifest.webmanifest' },
    { rel: 'icon', href: 'assets/icons/tgm-icon-192.svg', type: 'image/svg+xml', sizes: '192x192' },
    { rel: 'apple-touch-icon', href: 'assets/icons/tgm-icon-192.svg', sizes: '192x192' }
  ];

  for (const definition of links) {
    if (document.head.querySelector(`link[rel="${definition.rel}"]`)) continue;
    const link = document.createElement('link');
    Object.assign(link, definition);
    document.head.append(link);
  }
}

function ensureProjectFooterStyles() {
  if (document.head.querySelector('link[data-project-footer-styles]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'css/footer.css';
  link.dataset.projectFooterStyles = '';
  document.head.append(link);
}

function ensureProjectFooter() {
  const footer = document.querySelector('body > footer');
  if (!footer) return;

  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-copy">
      <strong>TGM Companion</strong>
      <span>Open-source community planner for The Grand Mafia.</span>
    </div>
    <nav class="footer-links" aria-label="Project links">
      <a href="wiki.html">Wiki</a>
      <a href="https://github.com/Ipl0x/tgm-companion" target="_blank" rel="noopener noreferrer">View source</a>
      <a href="https://github.com/Ipl0x/tgm-companion/issues" target="_blank" rel="noopener noreferrer">Report issue</a>
      <a href="https://github.com/Ipl0x/tgm-companion/issues/new?template=feature_request.yml" target="_blank" rel="noopener noreferrer">Request feature</a>
      <details class="footer-data-menu">
        <summary>Submit data</summary>
        <div class="footer-data-options">
          <a href="https://github.com/Ipl0x/tgm-companion/issues/new?template=investment_data_submission.yml" target="_blank" rel="noopener noreferrer">Investment data</a>
          <a href="https://github.com/Ipl0x/tgm-companion/issues/new?template=star_up_data_submission.yml" target="_blank" rel="noopener noreferrer">Star-Up data</a>
        </div>
      </details>
      <a href="https://github.com/Ipl0x/tgm-companion/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute</a>
      <a href="https://github.com/Ipl0x/tgm-companion/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">Changelog</a>
    </nav>
    <small class="footer-disclaimer">Fan-made tool. Not affiliated with or endorsed by the game publisher. All planner data remains in your browser.</small>
  `;
}

function ensureInstallButton() {
  let button = document.querySelector('[data-install-app]');
  if (button) return button;

  const actions = document.querySelector('.top-actions');
  if (!actions) return null;

  button = document.createElement('button');
  button.className = 'btn btn-ghost install-app-btn';
  button.type = 'button';
  button.dataset.installApp = '';
  button.textContent = 'Install app';
  button.hidden = true;
  actions.prepend(button);
  return button;
}

ensurePwaHeadLinks();
ensureProjectFooterStyles();
ensureProjectFooter();
ensureInstallButton();

const installButtons = [...document.querySelectorAll('[data-install-app]')];
let deferredInstallPrompt = null;
let reloadingForUpdate = false;

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

function setInstallButtonsVisible(visible) {
  for (const button of installButtons) {
    button.hidden = !visible;
    button.style.display = visible ? 'inline-flex' : '';
  }
}

function showUpdateBanner(registration) {
  if (document.querySelector('.pwa-update-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'pwa-update-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = '<span><strong>Update available</strong><small>A newer TGM Companion version is ready.</small></span><button type="button">Update now</button>';
  banner.querySelector('button').addEventListener('click', () => {
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    banner.querySelector('button').disabled = true;
    banner.querySelector('button').textContent = 'Updating…';
  });
  document.body.append(banner);
}

async function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    setInstallButtonsVisible(false);
    return;
  }

  if (isIos() && !isStandalone()) {
    window.alert('To install TGM Companion on iPhone or iPad: open the Share menu and choose “Add to Home Screen”.');
  }
}

for (const button of installButtons) button.addEventListener('click', installApp);

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (!isStandalone()) setInstallButtonsVisible(true);
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  setInstallButtonsVisible(false);
});

if (isIos() && !isStandalone()) setInstallButtonsVisible(true);
if (isStandalone()) setInstallButtonsVisible(false);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const serviceWorkerUrl = new URL('sw.js', document.baseURI);
      const scopeUrl = new URL('./', document.baseURI);
      const registration = await navigator.serviceWorker.register(serviceWorkerUrl, {
        scope: scopeUrl.pathname,
        updateViaCache: 'none'
      });

      if (registration.waiting && navigator.serviceWorker.controller) showUpdateBanner(registration);

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(registration);
        });
      });

      window.setTimeout(() => registration.update().catch(() => {}), 1500);
    } catch (error) {
      console.warn('TGM PWA registration failed.', error);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
}
