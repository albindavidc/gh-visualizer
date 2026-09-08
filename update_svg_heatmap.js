import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

const replacement = `    <!-- Heatmap Title -->
    <text x="\${heatmapXOffset}" y="\${padding + statsHeight + innerPadding + dividerHeight + innerPadding - 12}" class="text label" font-size="18">Heatmap (Last 52 Weeks)</text>

    <!-- Heatmap Container -->
    <g transform="translate(\${heatmapXOffset}, \${padding + statsHeight + innerPadding + dividerHeight + innerPadding})">
      <rect x="-8" y="-8" width="\${heatmapWidth + 16}" height="\${heatmapHeight + 16}" fill="#000000" fill-opacity="0.2" rx="8" stroke="#1f2937" stroke-opacity="0.3" stroke-width="1" />
`;

svgCode = svgCode.replace(/    <!-- Heatmap -->\\n    <g transform="translate\(\\$\\{heatmapXOffset\\}, \\$\\{padding \+ statsHeight \+ innerPadding \+ dividerHeight \+ innerPadding\\}\)">\\n      <rect x="-8" y="-8" width="\\$\\{heatmapWidth \+ 16\\}" height="\\$\\{heatmapHeight \+ 16\\}" fill="#000000" fill-opacity="0\.2" rx="8" stroke="#1f2937" stroke-opacity="0\.3" stroke-width="1" \/>/, replacement);

// We need to add the dates to the bottom of the heatmap in the SVG as well.
const datesReplacement = `
    </g>

    <!-- Dates -->
    <g transform="translate(\${heatmapXOffset}, \${padding + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + 24})">
      <text x="0" y="0" class="mono label">\${weeks[0]?.days[0]?.date.replace(/-/g, '.') || ''}</text>
      <text x="\${heatmapWidth}" y="0" text-anchor="end" class="mono label">\${weeks[weeks.length - 1]?.days[weeks[weeks.length - 1]?.days.length - 1]?.date.replace(/-/g, '.') || ''}</text>
    </g>
  </svg>`;

svgCode = svgCode.replace(/    <\/g>\\n  <\/svg>/, datesReplacement);

// Increase cardHeight to account for title at top and dates at bottom
svgCode = svgCode.replace('const cardHeight = padding + 60 + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + padding;', 'const cardHeight = padding + 60 + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + 50 + padding;');


fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
