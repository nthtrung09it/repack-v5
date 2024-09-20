import path from 'path';
import {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import {getSharedDependencies} from 'kernel-sdk';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const resolve = require.resolve;

export default env => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = (reactNativePath = resolve('react-native')),
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }

  /**
   * Using Module Federation might require disabling hmr.
   * Uncomment below to set `devServer.hmr` to `false`.
   *
   * Keep in mind that `devServer` object is not available
   * when running `webpack-bundle` command. Be sure
   * to check its value to avoid accessing undefined value,
   * otherwise an error might occur.
   */
  // if (devServer) {
  //   devServer.hmr = false;
  // }

  /**
   * Depending on your Babel configuration you might want to keep it.
   * If you don't use `env` in your Babel config, you can remove it.
   *
   * Keep in mind that if you remove it you should set `BABEL_ENV` or `NODE_ENV`
   * to `development` or `production`. Otherwise your production code might be compiled with
   * in development mode by Babel.
   */
  // process.env.BABEL_ENV = mode;

  const realmPath = path.join(
    path.dirname(resolve('realm/package.json')),
    'dist/platform/react-native/index.js',
  );

  return {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false,
    context,
    /**
     * `getInitializationEntries` will return necessary entries with setup and initialization code.
     * If you don't want to use Hot Module Replacement, set `hmr` option to `false`. By default,
     * HMR will be enabled in development mode.
     */
    entry,
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),
      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      // conditionNames: [],
      importsFields: [],
      // exportsFields: [],
      alias: {
        'react-native': reactNativePath,
        // realm$: realmPath,
      },
    },

    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
      uniqueName: 'sas-host',
    },
    /**
     * Configures optimization of the built bundle.
     */
    // optimization: {
    //   /** Enables minification based on values passed from React Native CLI or from fallback. */
    //   minimize,
    //   /** Configure minimizer to process the bundle. */
    //   minimizer: [
    //     new TerserPlugin({
    //       test: /\.(js)?bundle(\?.*)?$/i,
    //       /**
    //        * Prevents emitting text file with comments, licenses etc.
    //        * If you want to gather in-file licenses, feel free to remove this line or configure it
    //        * differently.
    //        */
    //       extractComments: false,
    //       terserOptions: {
    //         format: {
    //           comments: false,
    //         },
    //       },
    //     }),
    //   ],
    //   chunkIds: 'named',
    // },
    optimization: {
      minimize,
      chunkIds: 'named',
    },
    module: {
      /**
       * This rule will process all React Native related dependencies with Babel.
       * If you have a 3rd-party dependency that you need to transpile, you can add it to the
       * `include` list.
       *
       * You can also enable persistent caching with `cacheDirectory` - please refer to:
       * https://github.com/babel/babel-loader#options
       */
      rules: [
        Repack.REACT_NATIVE_LOADING_RULES,
        Repack.NODE_MODULES_LOADING_RULES,
        {
          test: /\.jsx?$/,
          type: 'javascript/auto',
          include: [
            /node_modules[/\\]react-native-vector-icons/,
            /node_modules[/\\]react-native-fs/,
          ],
          use: {
            loader: '@callstack/repack/flow-loader',
            options: {all: true},
          },
        },
        /* codebase rules */
        {
          test: /\.[jt]sx?$/,
          type: 'javascript/auto',
          exclude: [/node_modules/],
          use: {
            loader: 'builtin:swc-loader',
            options: {
              /** @type {import('@rspack/core').SwcLoaderOptions} */
              sourceMaps: true,
              env: {
                targets: {'react-native': '0.75'},
              },
              jsc: {
                externalHelpers: true,
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        },
        {
          test: /\.[cm]?[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+realm/,
            /node_modules(.*[/\\])+@realm\/react/,
            // Make redux work
            /node_modules(.*[/\\])+redux/,
            /node_modules(.*[/\\])+redux-thunk/,
            /node_modules(.*[/\\])+react-redux/,
            /node_modules(.*[/\\])+reselect/,
            /node_modules(.*[/\\])+@reduxjs\/toolkit/,
            /node_modules(.*[/\\])+@reduxjs(.*[/\\])+toolkit/,
          ],
          rules: [
            {
              test: /\.[cm]?[jt]sx?$/,
              use: [
                {
                  loader: 'babel-loader',
                  // options: {
                  //   babelrc: false,
                  //   browserslistConfigFile: false,
                  //   configFile: false,
                  //   compact: false,
                  // },
                },
              ],
            },
          ],
          type: 'javascript/auto',
        },
        Repack.REACT_NATIVE_CODEGEN_RULES,
        {
          test: Repack.getAssetExtensionsRegExp(Repack.ASSET_EXTENSIONS),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
            },
          },
        },
      ],
    },
    plugins: [
      new rspack.IgnorePlugin({resourceRegExp: /@react-native-masked-view/}),
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      /**
       * This plugin is nessessary to make Module Federation work.
       */
      new Repack.plugins.ModuleFederationPlugin({
        /**
         * The name of the module is used to identify the module in URLs resolver and imports.
         */
        name: 'host',
        /**
         * Shared modules are shared in the share scope.
         * React, React Native and React Navigation should be provided here because there should be only one instance of these modules.
         * Their names are used to match requested modules in this compilation.
         */
        shared: getSharedDependencies({eager: true}),
      }),
      new rspack.EnvironmentPlugin({MF_CACHE: null}),
      process.env.RSDOCTOR && new RsdoctorRspackPlugin(),
    ].filter(Boolean),
  };
};
