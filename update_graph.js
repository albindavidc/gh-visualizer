import fs from 'fs';

let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// 1. Update props interface
code = code.replace(
  "  font?: string;",
  "  font?: string;\n  hideBorder?: boolean;"
);

// 2. Destructure prop
code = code.replace(
  "font = 'inter' }: ContributionGraphProps",
  "font = 'inter', hideBorder = false }: ContributionGraphProps"
);

// 3. Update className and style
code = code.replace(
  "      className=\"w-full flex flex-col items-center justify-center p-8 rounded-lg\"",
  "      className={`w-full flex flex-col items-center justify-center p-8 rounded-lg ${!hideBorder ? 'border border-gray-800' : ''}`}"
);

// We should also remove the background color if hideBorder is true? Usually hideBorder implies removing the bounding box entirely (so no background, no border).
// Wait, GitHub embeds with &hide_border=true usually just remove the border, but they keep the background. Let's make background transparent if they hide border?
// Let's just remove the border for now, but also we can make background transparent if needed. Let's do background transparent and no border.
code = code.replace(
  "      style={{ backgroundColor: currentTheme.bg, fontFamily }}",
  "      style={{ backgroundColor: hideBorder ? 'transparent' : currentTheme.bg, fontFamily }}"
);

fs.writeFileSync('src/components/ContributionGraph.tsx', code);
