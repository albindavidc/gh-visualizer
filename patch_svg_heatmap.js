import fs from 'fs';
let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Align SVG heatmap container with the React styling
svgCode = svgCode.replace(
  '<rect x="-8" y="-8" width="${heatmapWidth + 16}" height="${heatmapHeight + 16}" fill="#000000" fill-opacity="0.2" rx="8" stroke="#1f2937" stroke-opacity="0.3" stroke-width="1" />',
  '<rect x="-8" y="-8" width="${heatmapWidth + 16}" height="${heatmapHeight + 16}" fill="#0A0A0A" rx="8" stroke="#162413" stroke-width="1" />'
);

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
