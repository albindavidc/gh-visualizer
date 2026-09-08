import fs from 'fs';

let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// I need to find the stats block and replace it. Let's just output the file from line 100 to 140 to see what it looks like.
