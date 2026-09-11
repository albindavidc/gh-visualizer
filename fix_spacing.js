import fs from 'fs';
let content = fs.readFileSync('src/utils/leetcodeSvgGenerator.ts', 'utf8');

// Update barsAreaWidth
content = content.replace(
  'const barsAreaWidth = cardWidth - padding - 200 - padding;',
  'const barsAreaWidth = cardWidth - padding - 225 - padding;'
);

// Move vertical divider
content = content.replace(
  '<rect x="170" y="5" width="1" height="150" fill="#1f2937"',
  '<rect x="190" y="5" width="1" height="150" fill="#1f2937"'
);

// Move bars group
content = content.replace(
  '<g transform="translate(200, 20)">',
  '<g transform="translate(225, 20)">'
);

// Increase vertical spacing
content = content.replace(
  '<g transform="translate(0, 48)">',
  '<g transform="translate(0, 60)">'
);

content = content.replace(
  '<g transform="translate(0, 96)">',
  '<g transform="translate(0, 120)">'
);

fs.writeFileSync('src/utils/leetcodeSvgGenerator.ts', content);
console.log('Success');
