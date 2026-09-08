// Circumference of r=40 is 251.32
// dasharray "210 50" -> 210 solid, 50 gap. Sum is 260 (close enough to 251.32).
// A better sum is exactly 251.3
// Let's use 200 solid, 51.3 gap.
// offset = -25.65
import fs from 'fs';
let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

svgCode = svgCode.replace(
  'stroke-dasharray="210 50" stroke-dashoffset="-25"',
  'stroke-dasharray="205 46.3" stroke-dashoffset="-23.15"'
);

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
