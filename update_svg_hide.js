import fs from 'fs';

let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// 1. Update signature
code = code.replace(
  "hideBorder: boolean = false) {",
  "hideBorder: boolean = false, hideLanguages: boolean = false) {"
);

// 2. Adjust statsHeight
// Currently: const statsHeight = 280;
// If hideLanguages is true, statsHeight should be around 140.
code = code.replace(
  "const statsHeight = 280;",
  "const statsHeight = hideLanguages ? 140 : 280;"
);

// 3. Conditionally render the second row
// We need to find the blocks:
/*
    <!-- Horizontal Divider -->
    <rect x="${padding}" y="${padding + 210}" width="${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(${padding}, ${padding + 230})">
...
*/

// Let's replace the whole stats block rendering
const statsSVGBlock = `    <!-- Horizontal Divider -->
    \${!hideLanguages ? \\\`<rect x="\\\${padding}" y="\\\${padding + 210}" width="\\\${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(\\\${padding}, \\\${padding + 230})">
      <text x="\\\${(cardWidth - padding*2) / 2}" y="0" text-anchor="middle" class="text medium label" font-size="16" fill="\\\${primaryColor}">Most Used Languages</text>
      
      <!-- Progress Bar Background/Mask -->
      <g transform="translate(0, 15)">
        <g clip-path="url(#bar-clip-full)">
          <rect x="0" y="0" width="\\\${cardWidth - padding*2}" height="10" fill="#1f2937" />
          \\\${langBarSvg}
        </g>
      </g>
      
      <!-- Legend Grid -->
      <g transform="translate(0, 45)">
        \\\${langGridSvg}
      </g>
    </g>\\\` : ''}`;

code = code.replace(
  /    <!-- Horizontal Divider -->\n    <rect x="\$\{padding\}" y="\$\{padding \+ 210\}" width="\$\{cardWidth - \(padding \* 2\)\}" height="1" fill="#1f2937" \/>\n    \n    <!-- Stats Row 2: Most Used Languages -->\n    <g transform="translate\(\$\{padding\}, \$\{padding \+ 230\}\)">[\s\S]*?<\/g>\n    <\/g>/,
  statsSVGBlock
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
