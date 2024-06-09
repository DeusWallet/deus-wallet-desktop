/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/named */
import type { StackBasicRoutes } from '../../../../routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type DeusLiteDetailScreenValues = {
  liteId: string;
};

export type DeusLiteDetailRoutesParams = {
  [StackBasicRoutes.ScreenDeusLiteDetail]: {
    defaultValues: DeusLiteDetailScreenValues;
  };
};

export type DeusLiteDetailNavigation = NativeStackNavigationProp<
  DeusLiteDetailRoutesParams,
  StackBasicRoutes
>;
