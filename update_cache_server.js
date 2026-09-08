import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');",
  "res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');"
);

fs.writeFileSync('server.ts', code);
