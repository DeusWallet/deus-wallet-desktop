import { wait } from '@deushq/kit/src/utils/helper';

export default class OffscreenApiXmrSdk {
  async showMe() {
    await wait(3000);
    return 'Hello World: OffscreenApiXmrSdk';
  }
}
