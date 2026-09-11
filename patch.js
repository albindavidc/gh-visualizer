import fs from 'fs';
let content = fs.readFileSync('src/utils/leetcodeSvgGenerator.ts', 'utf8');

// Replace vertical divider fill
content = content.replace(/<rect x="200" y="5" width="1" height="150" fill="\$\{borderColor\}"/, '<rect x="200" y="5" width="1" height="150" fill="#1f2937"');

fs.writeFileSync('src/utils/leetcodeSvgGenerator.ts', content);
console.log('Success');
