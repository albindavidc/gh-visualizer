import fs from 'fs';

let graphCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

graphCode = graphCode.replace(
  '  theme?: string;',
  '  theme?: string;\n  font?: string;'
);

graphCode = graphCode.replace(
  "export function ContributionGraph({ data, theme = 'github' }: ContributionGraphProps) {",
  "export function ContributionGraph({ data, theme = 'github', font = 'inter' }: ContributionGraphProps) {"
);

// Map simple font names to actual font families
const fontMapCode = `
  const fontFamilies: Record<string, string> = {
    'inter': '"Inter", sans-serif',
    'mali': '"Mali", cursive',
    'roboto mono': '"Roboto Mono", monospace',
    'comic neue': '"Comic Neue", cursive',
  };
  const fontFamily = fontFamilies[font.toLowerCase()] || fontFamilies.inter;
`;

graphCode = graphCode.replace(
  "  const primaryColor = currentTheme.levels[4] || '#39d353';",
  "  const primaryColor = currentTheme.levels[4] || '#39d353';\n" + fontMapCode
);

// Apply font family to the wrapper
graphCode = graphCode.replace(
  '      className="w-full flex flex-col items-center justify-center p-8 rounded-lg font-sans"',
  '      className="w-full flex flex-col items-center justify-center p-8 rounded-lg"\n      style={{ backgroundColor: currentTheme.bg, fontFamily }}'
);
graphCode = graphCode.replace(
  '      style={{ backgroundColor: currentTheme.bg }}',
  '' // Already added above
);

fs.writeFileSync('src/components/ContributionGraph.tsx', graphCode);
