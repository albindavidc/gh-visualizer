import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/isFork: false, /g, '');
fs.writeFileSync('server.ts', code);
