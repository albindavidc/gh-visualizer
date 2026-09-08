import fs from 'fs';

let reactCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// Change the flame mask background
reactCode = reactCode.replace(
  '<div className="absolute -top-5 px-3 py-1 rounded-full" style={{ backgroundColor: currentTheme.bg }}>',
  '<div className="absolute -top-5 px-1.5 py-1 rounded-full" style={{ backgroundColor: hideBorder ? \'#0A0A0A\' : currentTheme.bg }}>'
);
fs.writeFileSync('src/components/ContributionGraph.tsx', reactCode);

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Reduce width of box below fire in SVG
svgCode = svgCode.replace(
  '<rect x="-18" y="-22" width="36" height="26" rx="13" fill="${theme.bg}" />',
  '<rect x="-14" y="-22" width="28" height="26" rx="13" fill="${hideBorder ? \'#0A0A0A\' : theme.bg}" />'
);

fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
