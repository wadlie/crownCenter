const fs = require('fs');
const prompt = require('prompt');
const path = require('path');
const http = require('http');

const baseDir = path.join(__dirname, '../');
const zip = `${path.basename(baseDir)}.zip`;
const zipFile = path.join(baseDir, 'dist', zip);

let ip;
const propFile = path.join(path.resolve(__dirname), './.defaults.json');

function upload(ipAddress) {
  const len = fs.statSync(zipFile).size;
  const req = http
    .request(
      {
        host: ipAddress,
        port: '9095',
        path: '/upload_measurement',
        method: 'POST',
        headers: {
          'Content-Type': 'application/binary',
          'Content-Length': len,
        },
      },
      () => {},
    )
    .on('error', () => {
      console.log('done');
    });

  req.write(fs.readFileSync(zipFile));
  req.end();
}

if (!fs.existsSync(zipFile)) {
  console.log(`file not found: ${zipFile}`);
  process.exit(0);
}

try {
  ip = require(propFile).ip_address;
} catch (e) {
  console.log(e);
  ip = '192.168.1.2';
}

console.log('open our-scikit android application, go to settings and enable "Webserver"');

prompt.start();
prompt.get(
  {
    properties: {
      ip_address: {
        name: 'enter IP address displayed',
        default: ip,
      },
    },
  },
  (err, result) => {
    console.log('Command-line input received:');
    console.log(`  connecting to ip: ${result.ip_address}`);

    fs.writeFile(propFile, JSON.stringify(result), () => {
      if (err) {
        console.log(`unable to save file: ${err}`);
        return;
      }
      upload(result.ip_address);
    });
  },
);
