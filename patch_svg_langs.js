import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Update signature
svgCode = svgCode.replace('export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguage?: { name: string, color: string }) {', 'export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguages?: { name: string, color: string, percent: number }[]) {');

// Build the languages SVG blocks dynamically
const generateLangsBlock = `
  let langBarSvg = '';
  let langGridSvg = '';
  let currentX = 0;
  
  if (topLanguages && topLanguages.length > 0) {
    // Generate Progress Bar segments
    topLanguages.forEach((lang) => {
      const barWidth = (lang.percent / 100) * 180; // Total width is 180
      langBarSvg += \`<rect x="\${currentX}" y="0" width="\${barWidth}" height="8" fill="\${lang.color || '#8b949e'}" />\`;
      currentX += barWidth;
    });
    
    // Generate 2-column grid for up to 6 languages
    const visibleLangs = topLanguages.slice(0, 6);
    visibleLangs.forEach((lang, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col * 90;
      const yPos = 24 + (row * 18);
      
      langGridSvg += \`
        <g transform="translate(\${xPos}, \${yPos})">
          <circle cx="4" cy="-3" r="4" fill="\${lang.color || '#8b949e'}" />
          <text x="12" y="0" class="mono date">\${lang.name} \${lang.percent.toFixed(2)}%</text>
        </g>
      \`;
    });
  } else {
    langGridSvg = '<text x="0" y="30" class="mono date">No language data</text>';
  }
`;

// Insert generation logic before final SVG template
svgCode = svgCode.replace('  const statsHeight = 140;', generateLangsBlock + '\n  const statsHeight = 140;');

// Update SVG template for the Languages Column
const langsReplacement = `      <!-- Column 4: Most Used Languages -->
      <g transform="translate(\${cardWidth * 0.77}, 30)">
        <text x="0" y="-10" class="text medium label">Most Used Languages</text>
        
        <!-- Progress Bar Background/Mask -->
        <g clip-path="url(#bar-clip)">
          <rect x="0" y="0" width="180" height="8" fill="#1f2937" />
          \${langBarSvg}
        </g>
        
        <!-- Legend Grid -->
        <g transform="translate(0, 10)">
          \${langGridSvg}
        </g>
      </g>`;

// We need to also add the clip-path defs at the beginning of the SVG.
const clipPathDef = `
    <defs>
      <clipPath id="bar-clip">
        <rect x="0" y="0" width="180" height="8" rx="4" />
      </clipPath>
    </defs>
`;

// Replace Column 4
svgCode = svgCode.replace(/      <!-- Column 4: Top Language -->[\s\S]*?<\/g>/, langsReplacement);
svgCode = svgCode.replace('<style>', clipPathDef + '    <style>');

// Also update the column translations so it flows better, since Column 4 is wider.
// Originally:
// Col 1: 0.125
// Divider 1: 0.25
// Col 2: 0.375
// Divider 2: 0.5
// Col 3: 0.625
// Divider 3: 0.75
// Let's adjust them slightly to give Column 4 more room.
svgCode = svgCode.replace('cardWidth * 0.125', 'cardWidth * 0.12');
svgCode = svgCode.replace('cardWidth * 0.25', 'cardWidth * 0.24');
svgCode = svgCode.replace('cardWidth * 0.375', 'cardWidth * 0.36');
svgCode = svgCode.replace('cardWidth * 0.5', 'cardWidth * 0.48');
svgCode = svgCode.replace('cardWidth * 0.625', 'cardWidth * 0.60');
svgCode = svgCode.replace('cardWidth * 0.75', 'cardWidth * 0.72');


fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
