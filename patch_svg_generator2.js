import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

code = code.replace(/height="10" fill="\\\$\{lang.color/g, 'height="12" fill="${lang.color');
code = code.replace(/height="10" rx="5"/g, 'height="12" rx="6"');

// Fix the statsHeight
// Top row = ~150px
// If languages = true, row 2 is ~130px. So total stats height = ~280px.
// Wait, my Horizontal Divider is at y = padding + 150.
// Then languages start at padding + 180.
// Then the next Horizontal divider is at padding + statsHeight + innerPadding.
// If statsHeight = 280, then 280 + 24 = 304. So padding + 304.
code = code.replace(/const statsHeight = hideLanguages \? 140 : 280;/g, 'const statsHeight = hideLanguages ? 130 : 280;');

fs.writeFileSync('src/utils/svgGenerator.ts', code);
