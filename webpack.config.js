// Template for webpack.config.js in Fable projects
// Find latest version in https://github.com/fable-compiler/webpack-config-template

// In most cases, you'll only need to edit the CONFIG object (after dependencies)
// See below if you need better fine-tuning of Webpack options

const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = !process.argv.find(
  v => v.indexOf('webpack-dev-server') !== -1
)
const mode = isProduction ? 'production' : 'development'
process.env.NODE_ENV = mode
console.log('Bundling for ' + mode + '...')

const CONFIG = {
  // The tags to include the generated JS and CSS will be automatically injected in the HTML template
  // See https://github.com/jantimon/html-webpack-plugin
  indexHtmlTemplate: './public/index.html',
  fsharpEntry: './src/fable/App.js',
  cssEntry: './public/style.css',
  outputDir: './deploy',
  assetsDir: './public/assets',
  devServerPort: 8080,
  // When using webpack-dev-server, you may need to redirect some calls
  // to a external API server. See https://webpack.js.org/configuration/dev-server/#devserver-proxy
  devServerProxy: {
    // redirect requests that start with /api/ to the server on port 8085
    // '/api/**': {
    //     target: 'http://localhost:' + (process.env.SERVER_PROXY_PORT || "8085"),
    //     changeOrigin: true
    // },
    // redirect websocket requests that start with /socket/ to the server on the port 8085
    '/socket/**': {
      target: 'http://localhost:' + (process.env.SERVER_PROXY_PORT || '8085'),
      ws: true,
    },
  },
}

// The HtmlWebpackPlugin allows us to use a template for the index.html page
// and automatically injects <script> or <link> tags for generated bundles.
const commonPlugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: resolve(CONFIG.indexHtmlTemplate),
  }),
]

module.exports = {
  // In development, split the JavaScript and CSS files in order to
  // have a faster HMR support. In production bundle styles together
  // with the code because the MiniCssExtractPlugin will extract the
  // CSS in a separate files.
  entry: isProduction
    ? {
        app: [resolve(CONFIG.fsharpEntry), resolve(CONFIG.cssEntry)],
      }
    : {
        app: [resolve(CONFIG.fsharpEntry)],
        style: [resolve(CONFIG.cssEntry)],
      },
  // Add a hash to the output file name in production
  // to prevent browser caching if code changes
  output: {
    path: resolve(CONFIG.outputDir),
    publicPath: CONFIG.publicPath,
    filename: isProduction ? '[name].[hash].js' : '[name].js',
  },
  mode: mode,
  devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    // Split the code coming from npm packages into a different file.
    // 3rd party dependencies change less often, let the browser cache them.
    splitChunks: {
      chunks: 'all',
    },
  },
  // Besides the HtmlPlugin, we use the following plugins:
  // PRODUCTION
  //      - MiniCssExtractPlugin: Extracts CSS from bundle to a different file
  //          To minify CSS, see https://github.com/webpack-contrib/mini-css-extract-plugin#minimizing-for-production
  //      - CopyWebpackPlugin: Copies static assets to output directory
  // DEVELOPMENT
  //      - HotModuleReplacementPlugin: Enables hot reloading when code changes without refreshing
  plugins: isProduction
    ? commonPlugins.concat([
        new MiniCssExtractPlugin({ filename: 'style.[name].[hash].css' }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: resolve(CONFIG.assetsDir),
            },
          ],
        }),
      ])
    : commonPlugins,
  resolve: {
    // See https://github.com/fable-compiler/Fable/issues/1490
    symlinks: false,
  },
  // Configuration for webpack-dev-server
  devServer: {
    // Necessary when using non-hash client-side routing
    // This assumes the index.html is accessible from server root
    // For more info, see https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
    static: {
      directory: resolve(CONFIG.assetsDir),
      publicPath: CONFIG.publicPath,
    },
    host: '0.0.0.0',
    port: CONFIG.devServerPort,
    proxy: CONFIG.devServerProxy,
    hot: true,
    historyApiFallback: true,
  },
  // - sass-loaders: transforms SASS/SCSS into JS
  // - file-loader: Moves files referenced in the code (fonts, images) into output folder
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*)?$/,
        use: ['file-loader'],
      },
    ],
  },
}

function resolve(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath)
}
