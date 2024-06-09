// used in babel config so must be commonjs format
// can only access "process.env" here as it would be shared between buildtime and runtime
const isJest =
  process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';

const isDev = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

const isWeb = process.env.DEUS_PLATFORM === 'web';
const isWebEmbed = process.env.DEUS_PLATFORM === 'webEmbed';
const isDesktop = process.env.DEUS_PLATFORM === 'desktop';
const isExtension = process.env.DEUS_PLATFORM === 'ext';
const isNative = process.env.DEUS_PLATFORM === 'app';

const isExtChrome = process.env.EXT_CHANNEL === 'chrome';
const isExtFirefox = process.env.EXT_CHANNEL === 'firefox';

module.exports = {
  isJest,
  isDev,
  isProduction,
  isWeb,
  isWebEmbed,
  isDesktop,
  isExtension,
  isNative,
  isExtChrome,
  isExtFirefox,
};
