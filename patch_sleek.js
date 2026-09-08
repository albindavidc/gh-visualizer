import fs from 'fs';
let code = fs.readFileSync('src/themes.ts', 'utf8');

// Looking at the image, the blank (level 0) squares are a very dim, slightly tinted green instead of gray.
// And the active squares range from dim green to bright neon green.
// Sleek theme right now: levels: ['#161b22', '#3f6212', '#65a30d', '#84cc16', '#a3e635']
// #161b22 is the standard github empty gray color.
// We want a very dark green/yellow tint for empty squares.
// Image shows an almost black-green: e.g. #111A11 or #182216. Let's try #182215 or #141c11.
// Let's adjust the sleek theme levels to closely match the image's matrix-style neon green glow.
// Level 0: #141f11 or #162413 (a shadow of the sleek color)
// Level 1: #38591a
// Level 2: #5c8f22
// Level 3: #8be034
// Level 4: #a3ff33 or #adff2f

code = code.replace(
  "levels: ['#161b22', '#3f6212', '#65a30d', '#84cc16', '#a3e635']",
  "levels: ['#162413', '#38591a', '#5c8f22', '#7ec42a', '#a3ff33']"
);

fs.writeFileSync('src/themes.ts', code);
