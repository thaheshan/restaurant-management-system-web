const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@contexts': path.resolve(__dirname, 'src/contexts'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@constants': path.resolve(__dirname, 'src/constants'),
  '@utils': path.resolve(__dirname, 'src/utils'),
};

module.exports = config;
