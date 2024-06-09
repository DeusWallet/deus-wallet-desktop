function interceptTimeout(
  method: 'setTimeout' | 'setInterval',
  checkProp: '$$deusDisabledSetTimeout' | '$$deusDisabledSetInterval',
) {
  const methodOld = global[method];

  // @ts-ignore
  global[method] = function (
    fn: (...args: any[]) => any,
    timeout: number | undefined,
  ) {
    return methodOld(() => {
      if (global[checkProp]) {
        console.error(`${method} is disabled`);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn();
    }, timeout);
  };
}

function interceptTimerWithDisable() {
  try {
    interceptTimeout('setTimeout', '$$deusDisabledSetTimeout');
  } catch (error) {
    console.error(error);
  }
  try {
    interceptTimeout('setInterval', '$$deusDisabledSetInterval');
  } catch (error) {
    console.error(error);
  }
}

function enableSetTimeout() {
  global.$$deusDisabledSetTimeout = undefined;
}

function disableSetTimeout() {
  global.$$deusDisabledSetTimeout = true;
}

function enableSetInterval() {
  global.$$deusDisabledSetInterval = undefined;
}

function disableSetInterval() {
  global.$$deusDisabledSetInterval = true;
}

export default {
  interceptTimerWithDisable,
  enableSetTimeout,
  disableSetTimeout,
  enableSetInterval,
  disableSetInterval,
};
