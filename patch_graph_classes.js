import fs from 'fs';

let graphCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// Remove font-mono so everything inherits the selected font family
graphCode = graphCode.replace(/font-mono/g, '');

fs.writeFileSync('src/components/ContributionGraph.tsx', graphCode);
