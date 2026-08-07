import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import vm from 'node:vm';

const manifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
const serviceWorkerSource = await readFile('sw.js', 'utf8');
const pwaSource = await readFile('src/app/pwa.js', 'utf8');
const storageSource = await readFile('src/shared/storage.js', 'utf8');

const pageControllers = [
  'src/app/dashboard.js',
  'src/app/starups.js',
  'src/app/investments.js'
];

test('manifest contains the required install metadata and fixed-size icons', () => {
  assert.equal(manifest.name, 'TGM Companion');
  assert.equal(manifest.start_url, './index.html');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.display, 'standalone');

  const iconSizes = new Set(manifest.icons.map(icon => icon.sizes));
  assert.ok(iconSizes.has('192x192'));
  assert.ok(iconSizes.has('512x512'));
  assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'));
});

test('manifest icons and service worker shell files exist', async () => {
  for (const icon of manifest.icons) await access(icon.src);

  const shellMatch = serviceWorkerSource.match(/const APP_SHELL = (\[[\s\S]*?\]);/);
  assert.ok(shellMatch, 'APP_SHELL should be defined in sw.js');
  const shellFiles = vm.runInNewContext(shellMatch[1]);

  for (const item of shellFiles) {
    if (item === './') continue;
    await access(item.replace(/^\.\//, ''));
  }
});

test('service worker and PWA controller have valid JavaScript syntax', () => {
  assert.doesNotThrow(() => new vm.Script(serviceWorkerSource));
  assert.doesNotThrow(() => new vm.Script(pwaSource, { sourceType: 'module' }));
  assert.match(pwaSource, /navigator\.serviceWorker\.register/);
  assert.match(pwaSource, /beforeinstallprompt/);
  assert.match(pwaSource, /SKIP_WAITING/);
});

test('all application pages initialize the shared PWA controller', async () => {
  assert.match(storageSource, /import ['"]\.\.\/app\/pwa\.js['"]/);
  for (const controllerPath of pageControllers) {
    const source = await readFile(controllerPath, 'utf8');
    assert.match(source, /\.\.\/shared\/storage\.js/);
  }
});
