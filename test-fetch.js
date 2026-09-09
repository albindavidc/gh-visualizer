const http = require('http');

http.get('http://localhost:3000/api/github?username=zane-chen', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS:`, res.headers);
    console.log(`BODY: ${data.substring(0, 100)}...`);
  });
}).on('error', err => console.error(err));
