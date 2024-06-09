/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const MAX_PAGE_CONTAINER_WIDTH = 1024;

/**
 * Tokens will injected at build process. These are client token.
 */
export const COVALENT_API_KEY = process.env.COVALENT_KEY!;

export const JPUSH_KEY = process.env.JPUSH_KEY!;

export const HARDWARE_SDK_IFRAME_SRC_DEUSSO =
  process.env.HARDWARE_SDK_CONNECT_SRC || 'https://jssdk.deus.so';

export const HARDWARE_SDK_IFRAME_SRC_DEUSCN =
  process.env.HARDWARE_SDK_CONNECT_SRC_DEUSCN || 'https://jssdk.deuscn.com';

export const HARDWARE_SDK_VERSION = '0.3.48';

export const HARDWARE_BRIDGE_DOWNLOAD_URL =
  'https://deus.so/download/?client=bridge';

export const CERTIFICATE_URL = 'https://certificate.deus.so/verify';
