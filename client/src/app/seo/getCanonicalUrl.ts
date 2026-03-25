import { SITE_ORIGIN } from './site';

export const getCanonicalUrl = (pathname: string, search: string) => {
  const base =
    process.env.REACT_APP_PROD && process.env.REACT_APP_PROD !== 'false'
      ? SITE_ORIGIN
      : window.location.origin;

  // Keep canonical stable (no trailing slash except root).
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  const normalizedSearch = search || '';
  return `${base}${normalizedPath}${normalizedSearch}`;
};

