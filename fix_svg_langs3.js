import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Update Legend Grid in SVG to match the image exactly (2 decimals and 2-column)
const newLangGen = `    // Generate Progress Bar segments
    const fullWidth = cardWidth - (padding * 2);
    topLanguages.forEach((lang) => {
      const barWidth = (lang.percent / 100) * fullWidth;
      langBarSvg += \`<rect x="\${currentX}" y="0" width="\${barWidth}" height="10" fill="\${lang.color || '#8b949e'}" />\`;
      currentX += barWidth;
    });
    
    // Generate 2-column grid for up to 6 languages, perfectly centered to match image
    const visibleLangs = topLanguages.slice(0, 6);
    visibleLangs.forEach((lang, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col * (fullWidth / 2) + (fullWidth * 0.15); // Offset to center 2 columns
      const yPos = 24 + (row * 24);
      
      langGridSvg += \`
        <g transform="translate(\${xPos}, \${yPos})">
          <circle cx="4" cy="-4" r="5" fill="\${lang.color || '#8b949e'}" />
          <text x="16" y="0" class="text label" font-size="14">\${lang.name} <tspan fill="#6b7280">\${lang.percent.toFixed(2)}%</tspan></text>
        </g>
      \`;
    });`;

svgCode = svgCode.replace(/    \/\/ Generate Progress Bar segments[\s\S]*?\}\);/g, newLangGen);

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
