import fs from 'fs';

let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');
code = code.replace(
  'className="grid grid-cols-2 gap-x-12 gap-y-3 w-full max-w-[600px] mx-auto mt-2"',
  'className="grid grid-cols-3 gap-x-8 gap-y-3 w-full max-w-[700px] mx-auto mt-2"'
);
fs.writeFileSync('src/components/ContributionGraph.tsx', code);

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');
svgCode = svgCode.replace(
  /\/\/ Generate 2-column grid for up to 6 languages, perfectly centered to match image[\s\S]*?\}\);/,
  `// Generate 3-column grid for up to 6 languages, perfectly centered
    const visibleLangs = topLanguages.slice(0, 6);
    visibleLangs.forEach((lang, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const xPos = col * (fullWidth / 3) + (fullWidth * 0.08); // Offset to center 3 columns
      const yPos = 24 + (row * 24);
      
      langGridSvg += \\\`
        <g transform="translate(\\\${xPos}, \\\${yPos})">
          <circle cx="4" cy="-4" r="5" fill="\\\${lang.color || '#8b949e'}" />
          <text x="16" y="0" class="text label" font-size="14">\\\${lang.name} <tspan fill="#6b7280">\\\${lang.percent.toFixed(2)}%</tspan></text>
        </g>
      \\\`;
    });`
);
fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
