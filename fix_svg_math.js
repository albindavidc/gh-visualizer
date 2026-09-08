import fs from 'fs';
let reactCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// The circumference of a circle with r=52 is 2 * pi * 52 = 326.7
// If we want a gap at the top, we need strokeDasharray="gap_length solid_length" or "solid_length gap_length".
// Actually, dasharray="solid gap". Let's say solid is 260, gap is 66.
// To put the gap at the top, we rotate by -90deg. The stroke starts at the top (12 o'clock).
// Wait, if it starts at 12 o'clock, the first value is SOLID.
// So if we do dasharray="solid gap" and we want the gap centered at 12 o'clock,
// we strokeDashoffset="-(gap/2)". This shifts the stroke start backwards by half the gap.
// Let's do: r="50", circumference = 314.15
// Solid = 270, gap = 44
// dasharray = "270 44"
// offset = "-22"

reactCode = reactCode.replace(
  'r="52"',
  'r="50"'
);
reactCode = reactCode.replace(
  'strokeDasharray="280"',
  'strokeDasharray="264 50"'
);
reactCode = reactCode.replace(
  'strokeDashoffset="-32"',
  'strokeDashoffset="-25"'
);

fs.writeFileSync('src/components/ContributionGraph.tsx', reactCode);
