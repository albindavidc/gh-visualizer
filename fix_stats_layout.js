import fs from 'fs';
let content = fs.readFileSync('src/utils/leetcodeSvgGenerator.ts', 'utf8');

// 1. Shift outer group for correct new centering
content = content.replace(
  /<g transform="translate\(\$\{cardWidth \/ 2 - 250\}, 120\)" class="fade-in delay-1">/,
  '<g transform="translate(${cardWidth / 2 - 265}, 120)" class="fade-in delay-1">'
);

// 2. Shift vertical divider left
content = content.replace(
  /<rect x="200" y="5" width="1" height="150" fill="#1f2937" class="fade-in delay-1" \/>/,
  '<rect x="170" y="5" width="1" height="150" fill="#1f2937" class="fade-in delay-1" />'
);

// 3. Shift difficulty bars group left
content = content.replace(
  /<g transform="translate\(240, 20\)">/,
  '<g transform="translate(210, 20)">'
);

// 4. Change all 420px widths to 320px for the progress bars and text anchoring
content = content.replace(/width="420"/g, 'width="320"');
content = content.replace(/\* 420/g, '* 320');
content = content.replace(/<text x="420"/g, '<text x="320"');

fs.writeFileSync('src/utils/leetcodeSvgGenerator.ts', content);
console.log('Success');
