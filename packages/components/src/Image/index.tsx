import type { ComponentProps, FC } from 'react';
import { useState } from 'react';

import { Image as NBImage } from 'native-base';

import { ImageViewer, Pressable } from '@deushq/components';
import platformEnv from '@deushq/shared/src/platformEnv';

type ImageProps = { preview?: boolean } & ComponentProps<typeof NBImage>;

const Image: FC<ImageProps> = ({ preview = false, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { src } = rest;
  const { source } = rest;
  if (preview) {
    return (
      <>
        <Pressable
          onPress={() => {
            if (platformEnv.isNative) {
              setIsVisible(true);
            } else {
              window.open(src, '_blank');
            }
          }}
        >
          <NBImage alt="-" {...rest} />
        </Pressable>
        <ImageViewer
          onToggle={setIsVisible}
          visible={isVisible}
          src={src}
          source={source}
        />
      </>
    );
  }
  return <NBImage {...rest} />;
};

export default Image;
