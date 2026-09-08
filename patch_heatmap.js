import fs from 'fs';
let reactCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// Looking closely at the image, the Heatmap container itself is a very sleek black panel with a subtle border.
// Currently it is: <div className="flex gap-[3px] p-4 rounded-xl border border-gray-800/30 bg-black/20 shadow-inner">
// Let's make it slightly closer to the image's aesthetic:
reactCode = reactCode.replace(
  'className="flex gap-[3px] p-4 rounded-xl border border-gray-800/30 bg-black/20 shadow-inner"',
  'className="flex gap-[3px] p-4 rounded-xl border border-[#162413] bg-[#0A0A0A] shadow-inner"'
);

fs.writeFileSync('src/components/ContributionGraph.tsx', reactCode);

