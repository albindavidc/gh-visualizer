import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

code = code.replace(
  'class="date" fill="${primaryColor}"',
  'class="text" font-size="12" fill="${primaryColor}"'
);
code = code.replace(
  'class="date" fill="${primaryColor}"',
  'class="text" font-size="12" fill="${primaryColor}"'
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
