import fs from 'fs';

let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

const replacement = `      {/* Top Stats Section - Row 1 */}
      <div className="w-full max-w-[800px] flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        
        {/* Total Contributions */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold text-white mb-2 tracking-tight">
            {data.total_contributions.toLocaleString()}
          </div>
          <div className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
            Total Contributions
          </div>
          <div className="text-xs text-gray-400">
            {stats.totalRange}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-28 bg-gray-800" />

        {/* Current Streak (Increased Size) */}
        <div className="flex-[1.2] flex flex-col items-center justify-center text-center relative scale-110">
          <div className="relative w-28 h-28 mb-4 flex items-center justify-center rounded-full border-[4px]" style={{ borderColor: primaryColor }}>
            <div className="absolute -top-5 px-2" style={{ backgroundColor: currentTheme.bg }}>
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
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-28 bg-gray-800" />

        {/* Longest Streak */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold text-white mb-2 tracking-tight">
            {stats.longestStreak}
          </div>
          <div className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
            Longest Streak
          </div>
          <div className="text-xs text-gray-400">
            {stats.longestRange}
          </div>
        </div>

      </div>

      <div className="w-full max-w-[800px] h-px bg-gray-800/50 mb-8" />

      {/* Row 2: Most Used Languages */}
      <div className="w-full max-w-[800px] flex flex-col mb-10">
        <div className="text-lg font-medium mb-4 text-center" style={{ color: primaryColor }}>
          Most Used Languages
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 flex rounded-full overflow-hidden mb-5 bg-gray-900">
          {data.topLanguages?.map((lang, idx) => (
            <div key={idx} style={{ width: \`\${lang.percent}%\`, backgroundColor: lang.color || '#8b949e' }} />
          ))}
        </div>
        
        {/* Legend Grid */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {data.topLanguages?.slice(0, 6).map((lang, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: lang.color || '#8b949e' }} />
              <span className="text-gray-300 tracking-tight">
                {lang.name} <span className="text-gray-500 ml-1">{lang.percent.toFixed(1)}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>`;

// We want to replace everything from {/* Top Stats Section */} to the end of the </div> that closes it.
// Then the existing divider <div className="w-full max-w-[800px] h-px bg-gray-800/50 mb-6" /> will just follow.
// Wait, my replacement already includes a divider. 

code = code.replace(/      \{\/\* Top Stats Section \*\/\}[\s\S]*?<\/div>\n\n      <div className="w-full max-w-\[800px\] h-px bg-gray-800\/50 mb-6" \/>/, replacement + '\n\n      <div className="w-full max-w-[800px] h-px bg-gray-800/50 mb-6" />');

fs.writeFileSync('src/components/ContributionGraph.tsx', code);
