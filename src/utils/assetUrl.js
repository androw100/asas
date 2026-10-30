/** Prefix public asset paths with Vite BASE_URL (e.g. `/asas/` on GitHub Pages). */
export function assetUrl(path = '') {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${String(path).replace(/^\//, '')}`;
}
