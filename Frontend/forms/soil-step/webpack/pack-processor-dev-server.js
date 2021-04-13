const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

const externals = {
  serialport: 'SerialPort',
  fs: 'fs',
};

const config = {
  entry: {
    app: ['babel-polyfill', './src/processor.js'],
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'processor-browser-debug.js',
    libraryTarget: 'var',
    library: 'Processor',
  },
  externals,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader?limit=10000&mimetype=application/font-woff'],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: true,
    }),
    new HtmlWebpackPlugin({
      template: 'src/template.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

const options = {
  contentBase: 'public',
  historyApiFallback: true,
  host: '127.0.0.1',
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);

const devServerOptions = Object.assign({}, options, {
  stats: {
    colors: true,
  },
});

// compiler.run((err, status) => {});
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(9091, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:9091');
});
