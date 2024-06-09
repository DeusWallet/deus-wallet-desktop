import { serverPresetNetworks } from './presetNetworks';

export const DeusNetwork = serverPresetNetworks.reduce((memo, n) => {
  memo[n.shortcode] = n.id;
  return memo;
}, {} as Record<string, string>);
