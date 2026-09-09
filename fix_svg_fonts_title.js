import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// 1. Font Families and Import
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Inter:wght@400;500;700&family=Mali:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap');`;

const oldStyle = `<style>
      .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
      .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
      .title { font-size: 32px; fill: #ffffff; }
      .label { font-size: 14px; fill: \${primaryColor}; }
      .date { font-size: 12px; fill: #9ca3af; }
    </style>`;

const newStyle = `
  const fontFamilies: Record<string, string> = {
    'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    'mali': '"Mali", cursive',
    'roboto mono': '"Roboto Mono", monospace',
    'comic neue': '"Comic Neue", cursive',
  };
  const fontFamily = fontFamilies[fontName.toLowerCase()] || fontFamilies.inter;

<style>
      \${fontImport}
      .text, .title, .label, .date { font-family: \${fontFamily}; }
      .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
      .title { font-size: 32px; fill: #ffffff; }
      .label { font-size: 14px; fill: \${primaryColor}; }
      .date { font-size: 12px; fill: #9ca3af; }
    </style>`;

code = code.replace(oldStyle, newStyle.split('<style>')[1]);
code = code.replace('let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}">', 
  `const fontFamilies: Record<string, string> = {
    'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    'mali': '"Mali", cursive',
    'roboto mono': '"Roboto Mono", monospace',
    'comic neue': '"Comic Neue", cursive',
  };
  const fontFamily = fontFamilies[fontName.toLowerCase()] || fontFamilies.inter;
  const fontImport = "@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Inter:wght@400;500;700&family=Mali:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap');";

  let svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${cardWidth}" height="\${cardHeight}">`);

// 2. Adjust Heights for Heatmap Title
const oldLayout = `
  const divider2Y = hideLanguages ? (row1Y + row1Height + row1Mb) : (row2Y + row2Height + row2Mb);
  const heatmapY = divider2Y + dividerHeight + divider2Mb;
  
  const cardHeight = heatmapY + heatmapHeight + 50 + padding;`;

const newLayout = `
  const divider2Y = hideLanguages ? (row1Y + row1Height + row1Mb) : (row2Y + row2Height + row2Mb);
  const heatmapTitleHeight = 30;
  const heatmapTitleY = divider2Y + dividerHeight + divider2Mb;
  const heatmapY = heatmapTitleY + heatmapTitleHeight;
  
  const cardHeight = heatmapY + heatmapHeight + 60 + padding;`;

code = code.replace(oldLayout, newLayout.trim());

// 3. Add Heatmap Title
const oldHeatmap = `    <!-- Heatmap -->
    <g transform="translate(\${heatmapXOffset}, \${heatmapY})">`;

const newHeatmap = `    <!-- Heatmap Title -->
    <g transform="translate(\${heatmapXOffset}, \${heatmapTitleY})">
      <text x="0" y="20" class="text medium" font-size="16" fill="\${primaryColor}">Heatmap (Last 52 Weeks)</text>
    </g>

    <!-- Heatmap -->
    <g transform="translate(\${heatmapXOffset}, \${heatmapY})">`;

code = code.replace(oldHeatmap, newHeatmap);

// 4. Also fix dates format to use actual date classes and smaller fonts if needed. 
// They are using class="text" font-size="12" fill="\${primaryColor}". Let's make it class="mono date" or something similar that looks good, but let's stick to .text since we added font family to it. Actually the React app uses the main font.
fs.writeFileSync('src/utils/svgGenerator.ts', code);
