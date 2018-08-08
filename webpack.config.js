/*eslint-disable */
import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import PhenomicFeedWebpackPlugin from 'phenomic-serverless/lib/loader-feed-webpack-plugin'
import { phenomicLoader } from 'phenomic-serverless'
import pkg from './package.json'
import getSiteConfig from './src/_config'
var Visualizer = require('webpack-visualizer-plugin');

export default (config = {}) => {
  // console.log('phenomic config', config)
  const isProd = config.production
  const siteConfig = getSiteConfig(isProd)
  const dynamicEnvVariables = {
    NODE_ENV: (isProd) ? '"production"' : '"development"',
    BROWSER: (isProd) ? '"false"' : '"true"',
    DOCS_VERSION: '1.2.0'
  }
  const processEnvVariables = Object.keys(siteConfig).reduce((memo, key) => {
    memo[key] = JSON.stringify(siteConfig[key])
    return memo
  }, dynamicEnvVariables)

  const postcssPluginFile = require.resolve("./postcss.config.js")
  const postcssPlugins = (webpackInstance) => {
    const varFile = require.resolve("./src/_variables.js")
    const varFileContents = () => {
      webpackInstance.addDependency(varFile)
      delete require.cache[varFile]
      return require(varFile)()
    }
    webpackInstance.addDependency(postcssPluginFile)
    delete require.cache[postcssPluginFile]
    return require(postcssPluginFile)(config, varFileContents())
  }

  console.log('processEnvVariables', processEnvVariables)
  return {
    ...config.dev && {
      devtool: '#cheap-module-eval-source-map',
    },
    module: {
      noParse: [/\.min\.js/, /autoit.js/, /node_modules\/localforage\/dist\/localforage.js/],
      rules: [
        {
          // phenomic requirement for loading markdown
          test: /\.(md|markdown)$/,
          loader: phenomicLoader,
          query: {
            context: path.join(__dirname, config.source),
            // plugins: [
            //   ...require("phenomic/lib/loader-preset-markdown").default
            // ]
            // see https://phenomic.io/docs/usage/plugins/
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'scripts'),
            path.resolve(__dirname, 'src'),
          ],
          loaders: [
            "babel-loader?cacheDirectory",
            // "eslint-loader?fix",
          ],
        },

        {
          // *.css => CSS Modules
          test: /\.css$/,
          exclude: [/\.global\.css$/, path.join(__dirname, 'node_modules')],
          include: path.resolve(__dirname, 'src'),
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                query: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: (
                    config.production
                    ? "[hash:base64:5]"
                    : "[path][name]--[local]--[hash:base64:5]"
                  ),
                },
              },
              {
                loader: "postcss-loader",
                // query for postcss can't be used right now
                // https://github.com/postcss/postcss-loader/issues/99
                // meanwhile, see webpack.LoaderOptionsPlugin in plugins list
                // query: { plugins: postcssPlugins },
              },
            ],
          }),
        },
        {
          // *.global.css => global (normal) css
          test: /\.global\.css$/,
          include: path.resolve(__dirname, 'src'),
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              "css-loader",
              {
                loader: "postcss-loader",
                // query for postcss can't be used right now
                // https://github.com/postcss/postcss-loader/issues/99
                // meanwhile, see webpack.LoaderOptionsPlugin in plugins list
                // query: { plugins: postcssPlugins },
              },
            ],
          }),
        },
        {
          test: /\.(html|ico|jpe?g|png|gif|eot|otf|webp|ttf|woff|woff2)$/,
          loader: "file-loader",
           query: {
             name: "[path][name].[hash].[ext]",
             context: path.join(__dirname, config.source),
           },
        },
        {
          test: /\.svg$/,
          loader: 'raw-loader',
        },
      ],
    },

    plugins: [
      // new Visualizer({
      //   filename: './statistics.html'
      // }),
      // possible perf upgrade for local dev
      // new webpack.DllReferencePlugin({
      //    context: process.cwd(),
      //    manifest: require(path.resolve(pkg.dllPlugin.path, 'vendorPackages.json'))
      // }),
      new webpack.LoaderOptionsPlugin({
        test: /\.css$/,
        options: {
          postcss: postcssPlugins,
          // required to avoid issue css-loader?modules
          // this is normally the default value, but when we use
          // LoaderOptionsPlugin, we must specify it again, otherwise,
          // context is missing (and css modules names can be broken)!
          context: __dirname,
        },
      }),

      new PhenomicFeedWebpackPlugin({
        // here you define generic metadata for your feed
        feedsOptions: {
          title: 'Serverless Blog',
          site_url: pkg.homepage,
        },
        feeds: {
          // here we define one feed, but you can generate multiple, based
          // on different filters
          'blog/feed.xml': {
            // here you can define options for the feed
            title: `${pkg.name}: Latest Posts`,

            // this special key allows to filter the collection
            collectionOptions: {
              filter: { layout: 'Post' },
              sort: 'date',
              reverse: true,
              limit: 20,
            },
          },
        },
      }),

      new ExtractTextPlugin({
       filename: "[name].[hash].css",
       disable: config.dev,
      }),

      ...config.production && [
        new webpack.optimize.UglifyJsPlugin(
          { compress: { warnings: false } }
        ),
      ],

      new webpack.DefinePlugin({
        // set 'process.env.[vars]'
        'process.env': processEnvVariables,
        // Auth0Lock: 'Auth0Lock',
        // 'window.Auth0Lock': 'Auth0Lock'
      }),
    ],
    // externals: {
    //   // Use external version of React
    //   'Auth0Lock': 'Auth0Lock',
    // },
    output: {
      path: path.join(__dirname, config.destination),
      publicPath: config.baseUrl.pathname,
      filename: '[name].[hash].js',
    },
    resolve: { extensions: [ ".js", ".json" ] },
  }
}
