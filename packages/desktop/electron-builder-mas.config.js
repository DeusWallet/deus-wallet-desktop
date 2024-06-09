/* eslint-disable no-template-curly-in-string */
require('../../development/env');

module.exports = {
  'extraMetadata': {
    'main': 'dist/app.js',
    'version': process.env.VERSION,
  },
  'appId': 'so.deus.wallet',
  'productName': 'Deus',
  'copyright': 'Copyright © ${author}',
  'asar': true,
  'buildVersion': `${process.env.BUILD_NUMBER}0`,
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
      'from': 'build/static/images/icons/icon.icns',
      'to': 'static/images/icons/icon.icns',
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
  'mac': {
    'identity': null,
    'icon': 'build/static/images/icons/icon.icns',
    'artifactName': 'Deus-Wallet-${version}-mac-${arch}.${ext}',
    'hardenedRuntime': true,
    'darkModeSupport': false,
    'category': 'public.app-category.finance',
    'target': [{ target: 'mas', arch: 'universal' }],
    'entitlements': 'entitlements.mac.plist',
    'extendInfo': {
      'NSCameraUsageDescription': 'Use Camera to scan QR Code.',
    },
  },
  'mas': {
    'hardenedRuntime': false,
    // 'mergeASARs': false,
    'gatekeeperAssess': true,
    'entitlements': 'entitlements.mas.plist',
    'entitlementsInherit': 'entitlements.mas.inherit.plist',
    'entitlementsLoginHelper': 'entitlements.mas.loginhelper.plist',
    'provisioningProfile': 'Deus_Mac_App.provisionprofile',
    'extendInfo': {
      'ElectronTeamID': 'BVJ3FU5H2K',
      'ITSAppUsesNonExemptEncryption': false,
    },
  },
  'afterSign': 'scripts/notarize.js',
  'afterPack': 'scripts/fileOperation.js',
  'asarUnpack': ['**/*.node'],
};
