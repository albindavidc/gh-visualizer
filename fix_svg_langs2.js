import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Replace the duplicate logic
svgCode = svgCode.replace(/    \/\/ Generate 2-column grid for up to 6 languages[\s\S]*?\}\);/g, '');

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
