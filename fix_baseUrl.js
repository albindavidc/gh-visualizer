import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const baseUrl = 'https://gh-visualizer.vercel.app';",
  "const baseUrl = window.location.origin;"
);
code = code.replace(
  "const baseUrl = 'https://gh-visualizer.vercel.app';",
  "const baseUrl = window.location.origin;"
);

fs.writeFileSync('src/App.tsx', code);
