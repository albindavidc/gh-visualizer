import fs from 'fs';
let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// replace style={{ backgroundColor: hideBorder ? 'transparent' : currentTheme.bg, fontFamily }}
// with style={{ backgroundColor: currentTheme.bg, fontFamily }}
code = code.replace(
  "style={{ backgroundColor: hideBorder ? 'transparent' : currentTheme.bg, fontFamily }}",
  "style={{ backgroundColor: currentTheme.bg, fontFamily }}"
);

fs.writeFileSync('src/components/ContributionGraph.tsx', code);
