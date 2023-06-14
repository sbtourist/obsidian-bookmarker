const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    serviceWorker: './src/serviceWorker.ts',
    options: './src/options.ts',

    bookmarkListener: './src/bookmarkListener.ts',

    bookmarker: './src/bookmarker.ts',
    alerter: './src/alerter.ts',
    obsidianClient: './src/obsidianClient.ts',
    messages: './src/messages.ts'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
  ],
};
