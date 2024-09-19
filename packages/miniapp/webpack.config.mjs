import * as Repack from '@callstack/repack';
import path from 'path';
import rspack from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import {getSharedDependencies} from 'kernel-sdk';
/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.netlify.app/
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native CLI
 *            when running with `react-native start/bundle`.
 */
export default env => {

  console.log("**** env: " + JSON.stringify(env));

  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL('./node_modules/react-native', import.meta.url)
      .pathname,
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
    entry: {},
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),
      alias: {
        'react-native': reactNativePath,
      },
      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      // alias: {
      //   'react-native': reactNativePath,
      // },
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
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
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
          
          test: /\.[jt]sx?$/,
          type: 'javascript/auto',
          include: [/repack[/\\]dist/],
          use: {
            loader: 'builtin:swc-loader',
            options: {
              env: { targets: { 'react-native': '0.75' } },
              jsc: { externalHelpers: true },
            },
          },
        },
        /**
         * Here you can adjust loader that will process your files.
         *
         * You can also enable persistent caching with `cacheDirectory` - please refer to:
         * https://github.com/babel/babel-loader#options
         */
        {
          test: /\.[jt]sx?$/,
          type: 'javascript/auto',
          exclude: [/node_modules/, /repack[/\\]dist/],
          use: {
            loader: 'builtin:swc-loader',
            options: {
              /** Add React Refresh transform only when HMR is enabled. */
              sourceMaps: true,
              env: {
                targets: { 'react-native': '0.75' },
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
        /**
         * This loader handles all static assets (images, video, audio and others), so that you can
         * use (reference) them inside your application.
         *
         * If you wan to handle specific asset type manually, filter out the extension
         * from `ASSET_EXTENSIONS`, for example:
         * ```
         * Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
         * ```
         */
        {
          test: Repack.getAssetExtensionsRegExp(Repack.ASSET_EXTENSIONS),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              inline: true,
              /**
               * Defines which assets are scalable - which assets can have
               * scale suffixes: `@1x`, `@2x` and so on.
               * By default all images are scalable.
               */
              // scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
      ],
    },
    plugins: [
      new rspack.IgnorePlugin({ resourceRegExp: /@react-native-masked-view/ }),
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
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
        name: 'miniapp',
        /**
         * This is a list of modules that will be shared between remote containers.
         */
        exposes: {
          './MiniAppScreen': './src/screens/MiniAppScreen',
        },
        /**
         * Shared modules are shared in the share scope.
         * React, React Native and React Navigation should be provided here because there should be only one instance of these modules.
         * Their names are used to match requested modules in this compilation.
         */
        shared: {
          react: {
            singleton: true,
            eager: false,
            requiredVersion: '18.3.1',
          },
          'react-native': {
            singleton: true,
            eager: false,
            requiredVersion: '0.75.3',
          },
          'react-native/Libraries/Core/Devtools/getDevServer': {
            singleton: true,
            eager: true,
            requiredVersion: '0.75.3',
            shareScope: 'internal',
          },
        }
      }),
      // new Repack.plugins.ChunksToHermesBytecodePlugin({
      //   reactNativePath: reactNativePath,
      //   enabled: mode === 'production' && !devServer,
      //   test: /\.(js)?bundle$/,
      //   exclude: /index.bundle$/,
      // }),
      process.env.RSDOCTOR && new RsdoctorRspackPlugin(),
      // new Repack.plugins.CodeSigningPlugin({
      //   enabled: mode === 'production',
      //   privateKeyPath: path.join('..', '..', 'code-signing.pem'),
      // }),
    ].filter(Boolean),
  };
};
