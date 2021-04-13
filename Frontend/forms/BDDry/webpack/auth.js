import http from 'http';
import url from 'url';

import opn from 'opn';
import fs from 'fs';
import path from 'path';

const server = http.createServer((r, response) => {
  response.writeHead(200);
  const { token } = url.parse(r.url, true).query;
  if (token) {
    const dest = path.join(__dirname, '..', '.access-token');
    fs.writeFileSync(dest, token);
    console.log(`added token to file .access-token: ${token}`);
    response.end('success, you can close this window now.');
    process.exit(0);
    return;
  }

  // console.log(`token ${token}`);
  response.end(fs.readFileSync(path.join(__dirname, 'signin.html')));
  // process.exit(0);
});

server.listen(12312, 'localhost');
console.log('listening');

opn('http://localhost:12312/');
