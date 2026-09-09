import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// 2. Fix Heatmap Dates
code = code.replace(
  '  svg += `\n    </g>\n  </svg>`;\n  return svg;\n}',
  `
  const firstDate = weeks[0]?.days[0]?.date?.replace(/-/g, '.') || '';
  const lastWeek = weeks[weeks.length - 1];
  const lastDate = lastWeek?.days[lastWeek.days.length - 1]?.date?.replace(/-/g, '.') || '';

  svg += \`
    </g>
    <!-- Heatmap Dates -->
    <g transform="translate(\\\${heatmapXOffset}, \\\${heatmapY + heatmapHeight + 30})">
      <text x="0" y="0" class="date" fill="\\\${primaryColor}">\\\${firstDate}</text>
      <text x="\\\${heatmapWidth}" y="0" text-anchor="end" class="date" fill="\\\${primaryColor}">\\\${lastDate}</text>
    </g>
  </svg>\`;
  
  return svg;
}`
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
