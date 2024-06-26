/* eslint-disable @typescript-eslint/no-empty-interface */
import { extendTheme } from 'native-base';

import type { ThemeValues } from '@deushq/components/src/Provider/theme';

const wrapper = () => extendTheme({});
type DefaultTheme = ReturnType<typeof wrapper>;
type CustomTheme = Omit<DefaultTheme, 'colors'> & { colors: ThemeValues };

declare module 'native-base' {
  interface ICustomTheme extends CustomTheme {}
}
