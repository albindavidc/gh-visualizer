import fs from 'fs';

let content = fs.readFileSync('vercel.json', 'utf8');
const json = JSON.parse(content);
json.crons = [
  { "path": "/api/cron/refresh-github", "schedule": "0 1 * * *" }
];

fs.writeFileSync('vercel.json', JSON.stringify(json, null, 2));
console.log('Success');
