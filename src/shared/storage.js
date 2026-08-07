import '../app/pwa.js';

export function readState(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
