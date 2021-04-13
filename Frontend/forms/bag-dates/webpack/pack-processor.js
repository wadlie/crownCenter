const path = require('path');
const webpack = require('webpack');
const fs = require('fs-cli');

let type;
const opts = ['android', 'browser'];
if (process.argv.length !== 3 || !opts.includes(process.argv[2])) {
  console.log('usage: node pack-processor (processor|android) defaulting to android');
  type = 'android';
} else {
  const [, , t] = process.argv;
  type = t;
}

let ext;

let filename = '';
if (type === 'browser') {
  ext = {
    serialport: 'SerialPort',
    fs: 'fs',
  };

  filename = 'processor-browser-debug.js';
  console.log(`URL for browser: file://${path.join(__dirname, '../dist', 'processor.html')}`);
} else {
  ext = [
    {
      '../data/result.json': 'mock',
      serialport: 'SerialPort',
      fs: 'fs',
    },
  ];

  filename = 'processor.js';
}

const target = {
  filename,
  dist: path.resolve(__dirname, '../dist'),
  build: path.resolve(__dirname, '../build'),
};

console.log(ext);
module.exports.pack = (done) => {
  webpack(
    {
      entry: {
        app: ['babel-polyfill', './src/processor.js'],
      },
      output: {
        path: target.build,
        filename: target.filename,
      },
      externals: ext,
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
        console.log(`success, processor script: ${path.join(target.dist, target.filename)}`);
        done();
      }
      // Done processing
    },
  );
};

module.exports.pack(() => {
  console.log('done');
});
