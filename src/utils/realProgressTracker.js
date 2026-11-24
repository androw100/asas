import { useSyncExternalStore } from 'react';
import * as THREE from 'three';

// Exact byte sizes of the models in public/furniture/
export const KNOWN_MODEL_SIZES = {
  'sofa1.glb': 46413732,
  'sofa2.glb': 43102420,
  'sofa3.glb': 51497264,
  'sofa4.glb': 46806320,
  'chair1.glb': 42942420,
  'chair2.glb': 43098852,
  'chair3.glb': 43967532,
  'chair4.glb': 42137732,
  'dining_tabel.glb': 46854840,
  'Cabin.glb': 13889492
};

export function getExpectedSize(url = '') {
  if (!url) return 45 * 1024 * 1024;
  const clean = String(url).split('?')[0].split('#')[0];
  const filename = clean.split('/').pop();
  return KNOWN_MODEL_SIZES[filename] || 45 * 1024 * 1024;
}

const activeDownloads = new Map();
const listeners = new Set();

let cachedSnapshot = {
  active: false,
  progress: 100,
  percent: 100,
  loadedMB: '0.0',
  totalMB: '0.0',
  activeFilesCount: 0
};

function computeSnapshot() {
  if (activeDownloads.size === 0) {
    return {
      active: false,
      progress: 100,
      percent: 100,
      loadedMB: '0.0',
      totalMB: '0.0',
      activeFilesCount: 0
    };
  }

  let totalLoaded = 0;
  let totalSize = 0;

  for (const [_, data] of activeDownloads) {
    totalLoaded += data.loaded;
    totalSize += data.total;
  }

  const rawPercent = totalSize > 0 ? (totalLoaded / totalSize) * 100 : 0;
  const percent = Math.min(100, Math.max(1, Math.round(rawPercent)));

  return {
    active: true,
    progress: percent,
    percent,
    loadedMB: (totalLoaded / (1024 * 1024)).toFixed(1),
    totalMB: (totalSize / (1024 * 1024)).toFixed(1),
    activeFilesCount: activeDownloads.size
  };
}

function emitChange() {
  cachedSnapshot = computeSnapshot();
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedSnapshot;
}

export function useRealProgress(filterUrl = null) {
  const globalSnapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (!filterUrl) {
    return globalSnapshot;
  }

  // If a specific URL was requested, calculate for that URL
  const cleanFilter = String(filterUrl).split('?')[0].split('#')[0];
  const item = Array.from(activeDownloads.entries()).find(([url]) =>
    url.includes(cleanFilter) || cleanFilter.includes(url)
  );

  if (!item) {
    return {
      active: false,
      progress: 100,
      percent: 100,
      loadedMB: (getExpectedSize(cleanFilter) / (1024 * 1024)).toFixed(1),
      totalMB: (getExpectedSize(cleanFilter) / (1024 * 1024)).toFixed(1),
      activeFilesCount: 0
    };
  }

  const data = item[1];
  const rawPercent = data.total > 0 ? (data.loaded / data.total) * 100 : 0;
  const percent = Math.min(100, Math.max(1, Math.round(rawPercent)));

  return {
    active: true,
    progress: percent,
    percent,
    loadedMB: (data.loaded / (1024 * 1024)).toFixed(1),
    totalMB: (data.total / (1024 * 1024)).toFixed(1),
    activeFilesCount: 1
  };
}

let isHooked = false;

export function initRealProgressTracker() {
  if (isHooked || typeof window === 'undefined' || !THREE.FileLoader) return;
  isHooked = true;

  const originalLoad = THREE.FileLoader.prototype.load;

  THREE.FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    const strUrl = String(url || '');
    const isModel =
      strUrl.endsWith('.glb') ||
      strUrl.endsWith('.gltf') ||
      strUrl.includes('/furniture/');

    if (!isModel) {
      return originalLoad.call(this, url, onLoad, onProgress, onError);
    }

    const expectedSize = getExpectedSize(strUrl);
    activeDownloads.set(strUrl, { loaded: 0, total: expectedSize });
    emitChange();

    const wrappedOnProgress = (event) => {
      const loaded = event.loaded || 0;
      const total = (event.lengthComputable && event.total > 0) ? event.total : expectedSize;

      const item = activeDownloads.get(strUrl) || { loaded: 0, total };
      item.loaded = Math.min(loaded, item.total);
      item.total = total;
      activeDownloads.set(strUrl, item);
      emitChange();

      if (onProgress) onProgress(event);
    };

    const wrappedOnLoad = (response) => {
      const item = activeDownloads.get(strUrl);
      if (item) {
        item.loaded = item.total;
        emitChange();
      }
      setTimeout(() => {
        activeDownloads.delete(strUrl);
        emitChange();
      }, 500);

      if (onLoad) onLoad(response);
    };

    const wrappedOnError = (err) => {
      activeDownloads.delete(strUrl);
      emitChange();
      if (onError) onError(err);
    };

    return originalLoad.call(this, url, wrappedOnLoad, wrappedOnProgress, wrappedOnError);
  };
}
