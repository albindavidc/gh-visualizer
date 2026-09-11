import fs from 'fs';
let content = fs.readFileSync('src/utils/leetcodeSvgGenerator.ts', 'utf8');

content = content.replace(
  'const svg = `<svg xmlns',
  'const barsAreaWidth = cardWidth - padding - 200 - padding;\n\n  const svg = `<svg xmlns'
);

content = content.replace(
  /<g transform="translate\(\$\{cardWidth \/ 2 - 265\}, 120\)" class="fade-in delay-1">/,
  '<g transform="translate(${padding}, 120)" class="fade-in delay-1">'
);

content = content.replace(
  /<g transform="translate\(210, 20\)">/,
  '<g transform="translate(200, 20)">'
);

// We need to be careful with global replacements to only touch the right section.
// The easiest way is to use a replacer function on the whole SVG string, 
// or just chain replaces carefully.
// But we know "320" is used specifically in the difficulty bars section right now.

content = content.replace(/width="320"/g, 'width="${barsAreaWidth}"');
content = content.replace(/\* 320/g, '* barsAreaWidth');
content = content.replace(/<text x="320"/g, '<text x="${barsAreaWidth}"');

fs.writeFileSync('src/utils/leetcodeSvgGenerator.ts', content);
console.log('Success');
