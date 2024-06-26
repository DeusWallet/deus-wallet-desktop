import { useEffect, useRef, useState } from 'react';

import '../background/instance/backgroundApiProxy';

export function createLazyKitProviderLegacy({
  displayName,
}: {
  displayName: string;
}) {
  const LazyKitProvider = (props: any) => {
    const propsRef = useRef(props);
    const [cmp, setCmp] = useState<any>(null);
    useEffect(() => {
      setTimeout(() => {
        // KitProviderMock index
        import('./KitProvider').then((module) => {
          const KitProvider = module.default;
          setCmp(<KitProvider {...propsRef.current} />);
        });
      }, 0);
    }, []);
    if (cmp) {
      global.$$deusPerfTrace?.log({
        name: 'LazyKitProvider render **children**',
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return cmp;
    }
    global.$$deusPerfTrace?.log({ name: 'LazyKitProvider render [null]' });
    return null;
  };
  LazyKitProvider.displayName = displayName;
  return LazyKitProvider;
}

export function createLazyKitProvider({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  displayName,
}: {
  displayName?: string;
} = {}) {
  const KitProvider = require('./KitProvider');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
  return KitProvider.default;
}
