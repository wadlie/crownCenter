const path = require('path');
const webpack = require('webpack');
const fs = require('fs-cli');

const filename = 'sensor.js';

const target = {
  filename,
  dist: path.resolve(__dirname, '../dist'),
  build: path.resolve(__dirname, '../build'),
};

module.exports.pack = (done) => {
  webpack(
    {
      entry: ['babel-polyfill', path.resolve(__dirname, '../src/sensor.js')],
      devtool: 'inline-source-map',
      output: {
        path: target.build,
        filename: target.filename,
        libraryTarget: 'var',
        library: 'serial',
        libraryExport: 'default',
      },
      externals: {
        serialport: 'SerialPort',
        fs: 'fs',
        mock: '../mock/mock_sensor_output.json',
        tls: 'tls',
        net: 'net',
      },
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
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(stats);
      } else {
        fs.mv(path.join(target.build, target.filename), path.join(target.dist, target.filename));
        console.log(`success, sensor script: ${path.join(target.dist, target.filename)}`);
        done();
      }
      // Done processing
    },
  );
};

module.exports.pack(() => {
  console.log('sensor packed');
});
