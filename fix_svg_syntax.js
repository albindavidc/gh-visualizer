import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// The replacement was literal '\`' instead of '`', let's fix it
code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$\{/g, '${');

fs.writeFileSync('src/utils/svgGenerator.ts', code);
