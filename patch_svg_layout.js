import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Update statsHeight to accommodate the stacked design
svgCode = svgCode.replace('const statsHeight = 140;', 'const statsHeight = 280;'); 

// The structure of the SVG for the stats currently looks like:
/*
    <g transform="translate(0, ${padding + 60})">
      <!-- Column 1: Total Contributions -->
      ...
      <!-- Column 4: Most Used Languages -->
      ...
    </g>
*/

const newStatsSVG = `    <!-- Stats Row 1: 3 Columns -->
    <g transform="translate(0, \${padding + 60})">
      <!-- Column 1: Total Contributions -->
      <g transform="translate(\${cardWidth * 0.22}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${totalContributions.toLocaleString()}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Total Contributions</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">\${stats.totalRange}</text>
      </g>
      
      <!-- Divider 1 -->
      <rect x="\${cardWidth * 0.38}" y="10" width="1" height="110" fill="#1f2937" />
      
      <!-- Column 2: Current Streak (Larger) -->
      <g transform="translate(\${cardWidth * 0.5}, 0)">
        <!-- Larger Ring -->
        <circle cx="0" cy="35" r="50" fill="none" stroke="\${primaryColor}" stroke-width="4" />
        <rect x="-18" y="-25" width="36" height="28" fill="\${theme.bg}" />
        <g transform="translate(-14, -27) scale(1.2)">
          \${flameSvg}
        </g>
        <text x="0" y="50" text-anchor="middle" class="text bold title" font-size="40">\${stats.currentStreak}</text>
        <text x="0" y="105" text-anchor="middle" class="text bold label" font-size="16">\${stats.currentStreak === 1 ? 'Current Streak' : 'Current Streak'}</text>
        <text x="0" y="125" text-anchor="middle" class="mono date">\${stats.currentRange}</text>
      </g>
      
      <!-- Divider 2 -->
      <rect x="\${cardWidth * 0.62}" y="10" width="1" height="110" fill="#1f2937" />
      
      <!-- Column 3: Longest Streak -->
      <g transform="translate(\${cardWidth * 0.78}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">\${stats.longestStreak}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Longest Streak</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">\${stats.longestRange}</text>
      </g>
    </g>
    
    <!-- Horizontal Divider -->
    <rect x="\${padding}" y="\${padding + 210}" width="\${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(\${padding}, \${padding + 230})">
      <text x="\${(cardWidth - padding*2) / 2}" y="0" text-anchor="middle" class="text medium label" font-size="16" fill="\${primaryColor}">Most Used Languages</text>
      
      <!-- Progress Bar Background/Mask -->
      <g transform="translate(0, 15)">
        <g clip-path="url(#bar-clip-full)">
          <rect x="0" y="0" width="\${cardWidth - padding*2}" height="10" fill="#1f2937" />
          \${langBarSvg}
        </g>
      </g>
      
      <!-- Legend Grid -->
      <g transform="translate(0, 45)">
        \${langGridSvg}
      </g>
    </g>`;

// To replace the full <g> block that wraps the columns:
// We need a regex or simple string parsing to find it.
// It starts with `<g transform="translate(0, \${padding + 60})">` and ends right before `<!-- Horizontal Divider -->`

svgCode = svgCode.replace(/    <g transform="translate\(0, \$\{padding \+ 60\}\)">[\s\S]*?<!-- Horizontal Divider -->/g, newStatsSVG + '\n    \n    <!-- Horizontal Divider -->');

// Also update langBarSvg generation for full width
const newLangGen = `    // Generate Progress Bar segments
    const fullWidth = cardWidth - (padding * 2);
    topLanguages.forEach((lang) => {
      const barWidth = (lang.percent / 100) * fullWidth;
      langBarSvg += \`<rect x="\${currentX}" y="0" width="\${barWidth}" height="10" fill="\${lang.color || '#8b949e'}" />\`;
      currentX += barWidth;
    });
    
    // Generate flexible grid for up to 6 languages, centered
    const visibleLangs = topLanguages.slice(0, 6);
    const itemWidth = 120;
    const totalGridWidth = visibleLangs.length * itemWidth;
    const startX = (fullWidth - totalGridWidth) / 2 + 15;
    
    visibleLangs.forEach((lang, i) => {
      const xPos = startX + (i * itemWidth);
      const yPos = 0;
      
      langGridSvg += \`
        <g transform="translate(\${xPos}, \${yPos})">
          <circle cx="4" cy="-3" r="5" fill="\${lang.color || '#8b949e'}" />
          <text x="14" y="0" class="text label">\${lang.name} <tspan fill="#6b7280">\${lang.percent.toFixed(1)}%</tspan></text>
        </g>
      \`;
    });`;

svgCode = svgCode.replace(/    \/\/ Generate Progress Bar segments[\s\S]*?\}\);/g, newLangGen);

// Add full width clip path
const clipPathDef = `
      <clipPath id="bar-clip-full">
        <rect x="0" y="0" width="\${cardWidth - padding*2}" height="10" rx="5" />
      </clipPath>
`;
svgCode = svgCode.replace('</clipPath>', '</clipPath>' + clipPathDef);

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
