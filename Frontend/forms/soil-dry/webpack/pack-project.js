const fs = require('fs-cli');
const fs2 = require('fs');
const path = require('path');
const archiver = require('archiver');

const processor = require('./pack-processor.js');
const sensor = require('./pack-sensor.js');

processor.pack(() => {
  console.log('processor packed');

  sensor.pack(() => {
    console.log('sensor packed');

    const baseDir = path.join(__dirname, '../');
    const zip = `${path.basename(baseDir)}.zip`;
    const file = path.join(baseDir, 'dist', zip);

    const archive = archiver('zip', {
      zlib: {
        level: 9,
      }, // Sets the compression level.
    });

    fs.rm(file);

    const s = path.resolve(__dirname, '../dist/sensor.js');
    const p = path.resolve(__dirname, '../dist/processor.js');
    const m = path.resolve(__dirname, '../src/manifest.json');
    fs.cp(m, path.join(baseDir, 'dist', 'manifest.json'));

    const output = fs2.createWriteStream(file);
    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    output.on('end', () => {
      console.log('Data has been drained');
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.log('ENOENT');
      } else {
        throw err;
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    archive.append(fs2.createReadStream(s), {
      name: 'sensor.js',
    });

    archive.append(fs2.createReadStream(p), {
      name: 'processor.js',
    });

    archive.append(fs2.createReadStream(m), {
      name: 'manifest.json',
    });

    archive.finalize();
  });
});
