import fs from 'fs';
let code = fs.readFileSync('api/graph.ts', 'utf8');

code = code.replace(
  "res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=86400');",
  "res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');"
);

fs.writeFileSync('api/graph.ts', code);
