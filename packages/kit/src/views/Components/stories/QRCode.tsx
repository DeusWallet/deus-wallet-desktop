import { Center, QRCode } from '@deushq/components';

const QRCodeGallery = () => (
  <Center flex="1" bg="background-hovered">
    <QRCode value="https://deus.so/" size={296} />
  </Center>
);

export default QRCodeGallery;
