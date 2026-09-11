import fs from 'fs';
let content = fs.readFileSync('src/utils/leetcodeSvgGenerator.ts', 'utf8');
content = content.replace(
  'const svg = `',
  'const barsAreaWidth = cardWidth - padding - 200 - padding;\n\n  const svg = `'
);
fs.writeFileSync('src/utils/leetcodeSvgGenerator.ts', content);
console.log('Success');
