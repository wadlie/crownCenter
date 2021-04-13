import path from 'path';
import fs from 'fs';
import request from 'request';

(async () => {
  const token = (() => {
    try {
      return fs.readFileSync(path.join(__dirname, '..', '.access-token'));
    } catch (err) {
      console.log('unable to read access token, run "npm run auth" first!');
      process.exit(1);
      return null;
    }
  })();

  const formData = {
    files: [
      fs.createReadStream(path.join(__dirname, '..', 'dist', 'manifest.json')),
      fs.createReadStream(path.join(__dirname, '..', 'dist', 'sensor.js')),
      fs.createReadStream(path.join(__dirname, '..', 'dist', 'processor.js')),
    ],
    override: 'true',
  };

  if (!token) {
    console.error('error reading token, please run "npm run auth" first');
    process.exit(1);
  }

  console.log(`using token ${token}`);

  request.post(
    {
      url: 'https://app.our-sci.net/api/dashboard/create',
      formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Authorization-Firebase': token,
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        return console.error('upload failed:', err);
      }

      if (httpResponse.statusCode !== 201) {
        console.error('Error:');
        console.error(JSON.parse(body).message);
        return '';
      }

      console.dir(JSON.parse(body), null, 2);
      console.dir('Upload successful!');
      return '';
    },
  );
})();
