import fs from 'fs';

let reactCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// The image shows the ring CUT OFF at the top, leaving a gap where the flame sits, WITHOUT any background pill mask. 
// It also has the flame sitting exactly in the gap. 
// We can achieve this gap by using a border-top-color of transparent on the ring, and rotating it if needed. 
// Or better yet, we can just use SVG for the ring in React so we can use stroke-dasharray to create a true gap, or use a pseudo-element mask.
// But the easiest way in HTML/CSS to make a ring with a gap at the top is to use a transparent border top and rotate it to balance the gap, or just a solid circle with a mask.
// The image shows a very clean gap. It's an SVG circle with stroke-dasharray, or an SVG path.

// Let's replace the React DOM element with an inline SVG to perfectly match the design.

const newReactCurrentStreak = `        {/* Current Streak (Increased Size) */}
        <div className="flex-[1.2] flex flex-col items-center justify-center text-center relative scale-110">
          <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
            {/* SVG Ring with Gap */}
            <svg width="112" height="112" viewBox="0 0 112 112" className="absolute inset-0">
              <circle 
                cx="56" 
                cy="56" 
                r="52" 
                fill="none" 
                stroke={primaryColor} 
                strokeWidth="6" 
                strokeLinecap="round"
                strokeDasharray="280"
                strokeDashoffset="-32"
                transform="rotate(-90 56 56)"
              />
            </svg>
            
            {/* Flame Icon */}
            <div className="absolute -top-4">
              <Flame size={32} style={{ color: primaryColor, fill: primaryColor, fillOpacity: 0.2 }} />
            </div>
            
            <span className="text-5xl font-bold text-white tracking-tight">{stats.currentStreak}</span>
          </div>
          <div className="text-base font-bold mb-2" style={{ color: primaryColor }}>
            Current Streak
          </div>
          <div className="text-xs text-gray-400">
            {stats.currentRange}
          </div>
        </div>`;

reactCode = reactCode.replace(
  /        \{\/\* Current Streak \(Increased Size\) \*\/\}\n        <div className="flex-\[1\.2\] flex flex-col items-center justify-center text-center relative scale-110">\n          <div className="relative w-28 h-28 mb-4 flex items-center justify-center rounded-full border-\[4px\]" style=\{\{ borderColor: primaryColor \}\}>\n            <div className="absolute -top-5 px-1\.5 py-1 rounded-full" style=\{\{ backgroundColor: hideBorder \? '#0A0A0A' : currentTheme\.bg \}\}>\n              <Flame size=\{32\} style=\{\{ color: primaryColor, fill: primaryColor, fillOpacity: 0\.2 \}\} \/>\n            <\/div>\n            <span className="text-5xl font-bold text-white tracking-tight">\{stats\.currentStreak\}<\/span>\n          <\/div>\n          <div className="text-base font-bold mb-2" style=\{\{ color: primaryColor \}\}>\n            Current Streak\n          <\/div>\n          <div className="text-xs text-gray-400">\n            \{stats\.currentRange\}\n          <\/div>\n        <\/div>/,
  newReactCurrentStreak
);
fs.writeFileSync('src/components/ContributionGraph.tsx', reactCode);


let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// For SVG Generator:
// Circumference of r="40" is 2 * pi * 40 = 251.3
// We want a gap at the top. 
// We use stroke-dasharray="210 50" (solid for 210, gap for 50) 
// stroke-dashoffset="-25" (shift the gap to the top)
// and transform="rotate(-90)"

const newSVGCurrentStreak = `      <!-- Column 2: Current Streak -->
      <g transform="translate(\${cardWidth * 0.50}, 0)">
        <circle cx="0" cy="30" r="40" fill="none" stroke="\${primaryColor}" stroke-width="4" stroke-linecap="round" stroke-dasharray="210 50" stroke-dashoffset="-25" transform="rotate(-90 0 30)" />
        <g transform="translate(-14, -24) scale(1.1)">
          \${flameSvg}
        </g>
        <text x="0" y="42" text-anchor="middle" class="text bold title" font-size="36">\${stats.currentStreak}</text>
        <text x="0" y="90" text-anchor="middle" class="text medium label">Current Streak</text>
        <text x="0" y="115" text-anchor="middle" class="mono date">\${stats.currentRange}</text>
      </g>`;

svgCode = svgCode.replace(
  /      <!-- Column 2: Current Streak -->\n      <g transform="translate\(\$\{cardWidth \* 0\.50\}, 0\)">\n        <circle cx="0" cy="30" r="40" fill="none" stroke="\$\{primaryColor\}" stroke-width="4" \/>\n        <rect x="-14" y="-22" width="28" height="26" rx="13" fill="\$\{hideBorder \? '#0A0A0A' : theme\.bg\}" \/>\n        <g transform="translate\(-14, -24\) scale\(1\.1\)">\n          \$\{flameSvg\}\n        <\/g>\n        <text x="0" y="42" text-anchor="middle" class="text bold title" font-size="36">\$\{stats\.currentStreak\}<\/text>\n        <text x="0" y="90" text-anchor="middle" class="text medium label">Current Streak<\/text>\n        <text x="0" y="115" text-anchor="middle" class="mono date">\$\{stats\.currentRange\}<\/text>\n      <\/g>/,
  newSVGCurrentStreak
);
fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
