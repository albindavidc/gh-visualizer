import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// The original `Generate flexible grid for up to 6 languages, centered` block should be completely removed, because the `Generate 2-column grid` replaced it.

svgCode = svgCode.replace(/    \/\/ Generate flexible grid for up to 6 languages, centered[\s\S]*?\}\);/g, '');

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
