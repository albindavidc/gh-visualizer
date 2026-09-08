import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

svgCode = svgCode.replace('langGridSvg += \\`', 'langGridSvg += `');
svgCode = svgCode.replace('      \\`;', '      `;');
svgCode = svgCode.replace(/\\\$/g, '$');

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
