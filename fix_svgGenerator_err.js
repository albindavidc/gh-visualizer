import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

if (!code.includes('const headerHeight = 40;')) {
  code = code.replace(
    'const statsHeight = 140;',
    'const headerHeight = 40;\n    const statsHeight = 140;'
  );
}

// Ensure cardHeight includes the headerHeight
code = code.replace(
  'const cardHeight = padding + statsHeight',
  'const cardHeight = padding + headerHeight + 30 + statsHeight'
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
