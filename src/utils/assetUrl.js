/** Prefix public asset paths with Vite BASE_URL (e.g. `/asas/` on GitHub Pages). */
export function assetUrl(path = '') {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Detect base: from import.meta.env.BASE_URL, or detect '/asas/' from window.location on GitHub Pages
  let base = import.meta.env.BASE_URL || '/';
  if (base === '/' && typeof window !== 'undefined' && window.location.pathname.startsWith('/asas')) {
    base = '/asas/';
  }

  if (!base.endsWith('/')) {
    base = `${base}/`;
  }

  const cleanPath = String(path).replace(/^(\.\/|\/)+/, '');
  return `${base}${cleanPath}`;
}
