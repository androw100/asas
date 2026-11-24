/**
 * Prefix public asset paths with Vite BASE_URL (e.g. `/asas/` on GitHub Pages).
 * Fully idempotent: safely handles already-prefixed, relative, or absolute paths without duplicating.
 */
export function assetUrl(path = '') {
  if (!path) return '';
  const str = String(path);
  if (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:') ||
    str.startsWith('blob:')
  ) {
    return str;
  }

  // Detect base: from import.meta.env.BASE_URL, or detect '/asas/' from window.location on GitHub Pages
  let base = (typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL) || '/';
  if (base === '/' && typeof window !== 'undefined' && window.location.pathname.startsWith('/asas')) {
    base = '/asas/';
  }

  if (!base.endsWith('/')) {
    base = `${base}/`;
  }

  const cleanBase = base.replace(/\/$/, '').replace(/^\//, ''); // e.g. 'asas'
  const cleanPath = str.replace(/^(\.\/|\/)+/, ''); // strip leading './' or '/'

  // If path already starts with the base path, do NOT duplicate it!
  if (cleanBase && (cleanPath === cleanBase || cleanPath.startsWith(`${cleanBase}/`))) {
    return `/${cleanPath}`;
  }

  return `${base}${cleanPath}`;
}
