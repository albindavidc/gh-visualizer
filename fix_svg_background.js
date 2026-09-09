import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// 1. Fix Background
code = code.replace(
  "    <!-- Background -->\n    ${!hideBorder ? `<rect width=\"100%\" height=\"100%\" fill=\"${theme.bg}\" rx=\"12\" stroke=\"#1f2937\" stroke-width=\"1\" />` : ''}",
  "    <!-- Background -->\n    <rect width=\"100%\" height=\"100%\" fill=\"${theme.bg}\" rx=\"12\" ${!hideBorder ? 'stroke=\"#1f2937\" stroke-width=\"1\"' : ''} />"
);

// 2. Fix Heatmap Dates
const oldEnd = `  svg += \`
    </g>
  </svg>\`;
  return svg;
}`;

const newEnd = `
  const firstDate = weeks[0]?.days[0]?.date?.replace(/-/g, '.') || '';
  const lastWeek = weeks[weeks.length - 1];
  const lastDate = lastWeek?.days[lastWeek.days.length - 1]?.date?.replace(/-/g, '.') || '';

  svg += \`
    </g>
    <!-- Heatmap Dates -->
    <g transform="translate(\${heatmapXOffset}, \${heatmapY + heatmapHeight + 30})">
      <text x="0" y="0" class="date" fill="\${primaryColor}">\${firstDate}</text>
      <text x="\${heatmapWidth}" y="0" text-anchor="end" class="date" fill="\${primaryColor}">\${lastDate}</text>
    </g>
  </svg>\`;
  
  return svg;
}`;
code = code.replace(oldEnd, newEnd);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
