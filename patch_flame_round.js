import fs from 'fs';

let reactCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');
reactCode = reactCode.replace(
  '<div className="absolute -top-5 px-2" style={{ backgroundColor: currentTheme.bg }}>',
  '<div className="absolute -top-5 px-2 py-0.5 rounded-full" style={{ backgroundColor: hideBorder ? \'transparent\' : currentTheme.bg }}>'
);
fs.writeFileSync('src/components/ContributionGraph.tsx', reactCode);

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');
svgCode = svgCode.replace(
  '<rect x="-18" y="-22" width="36" height="26" fill="${theme.bg}" />',
  '<rect x="-18" y="-22" width="36" height="26" rx="13" fill="${hideBorder ? \'transparent\' : theme.bg}" />'
);
fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);

