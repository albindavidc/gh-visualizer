import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Update signature
svgCode = svgCode.replace('export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string) {', 'export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguage?: { name: string, color: string }) {');

// Update column placement logic
const statsReplacement = `    <!-- Column 1: Total Contributions -->
      <g transform="translate(\${cardWidth * 0.125}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${totalContributions.toLocaleString()}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Total Contributions</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">\${stats.totalRange}</text>
      </g>
      
      <!-- Divider 1 -->
      <rect x="\${cardWidth * 0.25}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 2: Current Streak -->
      <g transform="translate(\${cardWidth * 0.375}, 0)">
        <circle cx="0" cy="30" r="36" fill="none" stroke="\${primaryColor}" stroke-width="3" />
        <rect x="-16" y="-20" width="32" height="24" fill="\${theme.bg}" />
        <g transform="translate(-12, -22)">
          \${flameSvg}
        </g>
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${stats.currentStreak}</text>
        <text x="0" y="90" text-anchor="middle" class="text medium label">Current Streak</text>
        <text x="0" y="115" text-anchor="middle" class="mono date">\${stats.currentRange}</text>
      </g>
      
      <!-- Divider 2 -->
      <rect x="\${cardWidth * 0.5}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 3: Longest Streak -->
      <g transform="translate(\${cardWidth * 0.625}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${stats.longestStreak}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Longest Streak</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">\${stats.longestRange}</text>
      </g>
      
      <!-- Divider 3 -->
      <rect x="\${cardWidth * 0.75}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 4: Top Language -->
      <g transform="translate(\${cardWidth * 0.875}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title" fill="\${topLanguage?.color || '#ffffff'}">\${topLanguage?.name || 'N/A'}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Most Used</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">Language</text>
      </g>`;

// Replace existing stats columns
svgCode = svgCode.replace(/    <!-- Column 1: Total Contributions -->[\s\S]*?<!-- Horizontal Divider -->/, statsReplacement + '\n    </g>\n    \n    <!-- Horizontal Divider -->');

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
