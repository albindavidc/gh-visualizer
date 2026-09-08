import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// I duplicated visibleLangs. Let's see the current SVG code.
const regex = /\/\/ Generate Progress Bar segments[\s\S]*?\}\);\n    \}\);/;
// Actually, it's easier to just find the block and rewrite.
