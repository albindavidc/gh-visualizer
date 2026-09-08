import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const markdown = `[![GitHub Contributions](${embedUrl})](${linkUrl})`;',
  'const markdown = `![GitHub Contributions](${embedUrl})`;'
);

fs.writeFileSync('src/App.tsx', code);
