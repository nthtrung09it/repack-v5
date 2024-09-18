const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (
        !moduleName.includes('..') &&
        (moduleName.includes('@reduxjs/toolkit') ||
          moduleName.includes('react-redux') ||
          moduleName.includes('redux-thunk') ||
          moduleName.includes('reselect') ||
          moduleName.includes('immer') ||
          moduleName.includes('redux'))
      ) {
        const res = context.resolveRequest(context, moduleName, platform);
        if (moduleName) {
          console.log(
            '\n' + moduleName,
            path.relative(process.cwd(), res.filePath),
          );
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  watchFolders: [path.resolve(__dirname, '../../')],
};

module.exports = mergeConfig(defaultConfig, config);
