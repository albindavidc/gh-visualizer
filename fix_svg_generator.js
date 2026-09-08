import fs from 'fs';

let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Replace the entire Top Stats Section up to the Heatmap translation
const regex = /    <!-- Top Stats Section -->[\s\S]*?<!-- Heatmap -->/g;

const newStats = `    <!-- Top Stats Section - Row 1 -->
    <g transform="translate(0, \${padding})">
      <!-- Column 1: Total Contributions -->
      <g transform="translate(\${cardWidth * 0.22}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${totalContributions.toLocaleString()}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Total Contributions</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">\${stats.totalRange}</text>
      </g>
      
      <!-- Divider 1 -->
      <rect x="\${cardWidth * 0.38}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 2: Current Streak -->
      <g transform="translate(\${cardWidth * 0.50}, 0)">
        <circle cx="0" cy="30" r="40" fill="none" stroke="\${primaryColor}" stroke-width="4" />
        <rect x="-18" y="-22" width="36" height="26" fill="\${theme.bg}" />
        <g transform="translate(-14, -24) scale(1.1)">
          \${flameSvg}
        </g>
        <text x="0" y="42" text-anchor="middle" class="text bold title" font-size="36">\${stats.currentStreak}</text>
        <text x="0" y="90" text-anchor="middle" class="text medium label">Current Streak</text>
        <text x="0" y="115" text-anchor="middle" class="mono date">\${stats.currentRange}</text>
      </g>
      
      <!-- Divider 2 -->
      <rect x="\${cardWidth * 0.62}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 3: Longest Streak -->
      <g transform="translate(\${cardWidth * 0.78}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${stats.longestStreak}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Longest Streak</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">\${stats.longestRange}</text>
      </g>
    </g>
    
    <!-- Horizontal Divider -->
    \${!hideLanguages ? \\\`
    <rect x="\\\${padding}" y="\\\${padding + 150}" width="\\\${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(\\\${padding}, \\\${padding + 180})">
      <text x="\\\${(cardWidth - padding*2) / 2}" y="0" text-anchor="middle" class="text medium label" font-size="16" fill="\\\${primaryColor}">Most Used Languages</text>
      
      <!-- Progress Bar Background/Mask -->
      <g transform="translate(0, 20)">
        <g clip-path="url(#bar-clip-full)">
          <rect x="0" y="0" width="\\\${cardWidth - padding*2}" height="12" fill="#1f2937" />
          \\\${langBarSvg}
        </g>
      </g>
      
      <!-- Legend Grid -->
      <g transform="translate(0, 50)">
        \\\${langGridSvg}
      </g>
    </g>
    \\\` : ''}

    <!-- Horizontal Divider -->
    <rect x="\${padding}" y="\${padding + statsHeight + innerPadding}" width="\${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Heatmap -->`;

code = code.replace(regex, newStats);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
