import { Image, Keyboard } from 'react-native';

import { Box } from '@deushq/components';
import splashImage from '@deushq/kit/assets/splash.png';
import platformEnv from '@deushq/shared/src/platformEnv';

import { showOverlay } from '../../utils/overlayUtils';

export const showSplashScreen = () => {
  Keyboard.dismiss();
  showOverlay(() => (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="background-default"
    >
      <Image
        style={{
          height: '100%',
          width: '100%',
          resizeMode: platformEnv.isWeb ? 'center' : 'contain',
        }}
        source={splashImage}
      />
    </Box>
  ));
};
