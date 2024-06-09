/* eslint-disable no-template-curly-in-string */
require('../../development/env');

module.exports = {
  'extraMetadata': {
    'main': 'dist/app.js',
    'version': process.env.VERSION,
  },
  'appId': 'so.deus.wallet.desktop',
  'productName': 'Deus',
  'copyright': 'Copyright © ${author}',
  'asar': true,
  'buildVersion': process.env.BUILD_NUMBER,
  'directories': {
    'output': 'build-electron',
  },
  'files': [
    'build/**/*',
    '!build/static/bin/**/*',
    'dist/**/*.js',
    '!dist/__**',
    'package.json',
  ],
  'protocols': {
    'name': 'electron-deep-linking',
    'schemes': ['deus-wallet', 'wc', 'ethereum'],
  },
  'extraResources': [
    {
      'from': 'build/static/images/icons/512x512.png',
      'to': 'static/images/icons/512x512.png',
    },
    {
      'from': 'build/static/preload.js',
      'to': 'static/preload.js',
    },
  ],
  'publish': {
    'provider': 'github',
    'repo': 'app-monorepo',
    'owner': 'DeusHQ',
  },
  'dmg': {
    'sign': false,
  },
  'nsis': {
    'oneClick': false,
    'installerSidebar': 'build/static/images/icons/installerSidebar.bmp',
  },
  'win': {
    'extraResources': [
      {
        'from': 'build/static/bin/bridge/win-${arch}',
        'to': 'bin/bridge',
      },
    ],
    'icon': 'build/static/images/icons/512x512.png',
    'artifactName': 'Deus-Wallet-${version}-win-store-${arch}.${ext}',
    'verifyUpdateCodeSignature': false,
    'target': ['nsis'],
  },
  'afterSign': 'scripts/notarize.js',
};
