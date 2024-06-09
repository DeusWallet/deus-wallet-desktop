const endpointsMap: Record<
  | 'fiat'
  | 'wss'
  | 'covalent'
  | 'mempool'
  | 'getblock'
  | 'algosigner'
  | 'tronscan'
  | 'solscan',
  { prd: string; test: string }
> = {
  fiat: {
    prd: 'https://api.deuscn.com/api',
    test: 'https://api-sandbox.deustest.com/api',
    // test: 'http://127.0.0.1:9000/api',
  },
  wss: {
    prd: 'wss://api.deuscn.com',
    test: 'wss://api-sandbox.deustest.com',
  },
  covalent: {
    prd: 'https://node.deus.so/covalent/client1-HghTg3a33',
    test: 'https://node.deustest.com/covalent/client1-HghTg3a33',
  },
  mempool: {
    prd: 'https://node.deus.so/mempool',
    test: 'https://node.deustest.com/mempool',
  },
  getblock: {
    prd: 'https://node.deus.so/getblock-{chain}-{network}',
    test: 'https://node.deustest.com/getblock-{chain}-{network}',
  },
  algosigner: {
    prd: 'https://node.deus.so/algosigner/{network}/indexer',
    test: 'https://node.deustest.com/algosigner/{network}/indexer',
  },
  tronscan: {
    prd: 'https://node.deus.so/tronscan',
    test: 'https://node.deustest.com/tronscan',
  },
  solscan: {
    prd: 'https://node.deus.so/solscan',
    test: 'https://node.deustest.com/solscan',
  },
};

let endpointType: 'prd' | 'test' = 'prd';
export const switchTestEndpoint = (isTestEnable?: boolean) => {
  endpointType = isTestEnable ? 'test' : 'prd';
};

switchTestEndpoint(false);

export const getFiatEndpoint = () => endpointsMap.fiat[endpointType];
export const getSocketEndpoint = () => endpointsMap.wss[endpointType];
export const getCovalentApiEndpoint = () => endpointsMap.covalent[endpointType];
export const getTronScanEndpoint = () => endpointsMap.tronscan[endpointType];
export const getSolScanEndpoint = () => endpointsMap.solscan[endpointType];

export function getMempoolEndpoint({
  network,
}: {
  network: 'mainnet' | 'testnet';
}) {
  const networkPath = network === 'mainnet' ? '' : network;
  return [endpointsMap.mempool[endpointType], networkPath]
    .filter(Boolean)
    .join('/');
}

export function getGetblockEndpoint({
  chain,
  network,
}: {
  chain: 'btc';
  network: 'mainnet' | 'testnet';
}) {
  return endpointsMap.getblock[endpointType]
    .replace('{chain}', chain)
    .replace('{network}', network);
}

export function getAlgoSignerEndpoint({
  network,
}: {
  network: 'mainnet' | 'testnet';
}) {
  return endpointsMap.algosigner[endpointType].replace('{network}', network);
}
