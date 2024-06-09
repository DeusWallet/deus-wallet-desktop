import { createLazyKitProvider } from '@deushq/kit/src/provider/createLazyKitProvider';
import '@deushq/shared/src/web/index.css';

const KitProviderExt = createLazyKitProvider({
  displayName: 'KitProviderExt',
});
export default KitProviderExt;
