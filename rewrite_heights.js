import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// The logic block I want to inject is:
const newLogic = `
  // Heights and Margins
  const headerHeight = 40;
  const headerMb = 30;
  const row1Height = 120;
  const row1Mb = 40;
  const dividerHeight = 1;
  const dividerMb = 32;
  const row2Height = 100;
  const row2Mb = 40;
  const divider2Mb = 24;

  const headerY = padding;
  const row1Y = headerY + headerHeight + headerMb;
  
  const divider1Y = row1Y + row1Height + row1Mb;
  const row2Y = divider1Y + dividerHeight + dividerMb;
  
  const divider2Y = hideLanguages ? (row1Y + row1Height + row1Mb) : (row2Y + row2Height + row2Mb);
  const heatmapY = divider2Y + dividerHeight + divider2Mb;
  
  const cardHeight = heatmapY + heatmapHeight + 50 + padding;
`;

const replaceOldLogic = `  const headerHeight = 40;
  const statsHeight = hideLanguages ? 130 : 280;
  const dividerHeight = 1;
  const innerPadding = 24;
  
  const cardHeight = padding + headerHeight + 30 + 60 + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + 50 + padding;`;

code = code.replace(replaceOldLogic, newLogic.trim());

// Also replace the layout section
const oldLayout = `
    <!-- Top Stats Section - Row 1 -->
    <g transform="translate(0, \${padding + headerHeight + 30})">`;
    
const newLayout = `
    <!-- Top Stats Section - Row 1 -->
    <g transform="translate(0, \${row1Y})">`;

code = code.replace(oldLayout, newLayout);

const oldDivider1 = `
    <!-- Horizontal Divider -->
    \${!hideLanguages ? \`
    <rect x="\${padding}" y="\${padding + 150}" width="\${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(\${padding}, \${padding + 180})">`;

const newDivider1 = `
    <!-- Horizontal Divider -->
    \${!hideLanguages ? \`
    <rect x="\${padding}" y="\${divider1Y}" width="\${cardWidth - (padding * 2)}" height="\${dividerHeight}" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(\${padding}, \${row2Y})">`;

code = code.replace(oldDivider1, newDivider1);

const oldDivider2 = `
    <!-- Horizontal Divider -->
    <rect x="\${padding}" y="\${padding + statsHeight + innerPadding}" width="\${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Heatmap -->
    <g transform="translate(\${heatmapXOffset}, \${padding + statsHeight + innerPadding + dividerHeight + innerPadding})">`;

const newDivider2 = `
    <!-- Horizontal Divider -->
    <rect x="\${padding}" y="\${divider2Y}" width="\${cardWidth - (padding * 2)}" height="\${dividerHeight}" fill="#1f2937" />
    
    <!-- Heatmap -->
    <g transform="translate(\${heatmapXOffset}, \${heatmapY})">`;

code = code.replace(oldDivider2, newDivider2);

fs.writeFileSync('src/utils/svgGenerator.ts', code);
