import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

code = code.replace(
  'const statsHeight = hideLanguages ? 130 : 280;',
  'const headerHeight = 40;\n  const statsHeight = hideLanguages ? 130 : 280;'
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
