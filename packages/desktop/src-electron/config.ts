export const allowedDomains = [
  'localhost',
  '127.0.0.1',
  'api.github.com',
  'o554666.ingest.sentry.io',
  'deus.so',
  'swap.deus.so',
  'portfolio.deus.so',
  'discover.deus.so',
  '243096.com',
  'deus-asset.com',
];

export const cspRules = [
  // Default to only own resources
  "default-src 'self' 'unsafe-inline' deus.243096.com dev.243096.com deus-asset.com",
  // Allow all API calls (Can't be restricted bc of custom backends)
  'connect-src *',
  // Allow images from trezor.io
  "img-src 'self' deus.243096.com devs.243096.com deus.so *.deus.so deus-asset.com",
];
