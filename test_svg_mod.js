import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// The Github logo SVG for the header
const githubLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`;

code = code.replace(
  'const statsHeight = 140;',
  'const headerHeight = 40;\n  const statsHeight = 140;'
);
code = code.replace(
  'const cardHeight = padding + 60 + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + 50 + padding;',
  'const cardHeight = padding + headerHeight + 30 + 60 + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + 50 + padding;'
);

const headerSvg = `
    <!-- Header -->
    <g transform="translate(\${padding + 16}, \${padding})">
      \${githubLogo}
      <text x="40" y="20" class="text bold" font-size="24" fill="#ffffff" dominant-baseline="middle">\${username}</text>
    </g>
    <g transform="translate(\${cardWidth - padding - 16}, \${padding})">
      <text x="0" y="20" class="text medium label" text-anchor="end" dominant-baseline="middle">GitHub Stats</text>
    </g>
`;

code = code.replace(
  '<!-- Top Stats Section - Row 1 -->\n    <g transform="translate(0, ${padding})">',
  headerSvg.trim() + '\n    \n    <!-- Top Stats Section - Row 1 -->\n    <g transform="translate(0, ${padding + headerHeight + 30})">'
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
