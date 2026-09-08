import fs from 'fs';

let graphCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// Update Interface
graphCode = graphCode.replace('    topLanguage?: { name: string; color: string };', '    topLanguages?: { name: string; color: string; percent: number }[];');

// Replace Top Language column
const topLanguagesUI = `        {/* Most Used Languages */}
        <div className="flex-[1.5] flex flex-col justify-center min-w-[200px]">
          <div className="text-sm font-medium mb-3" style={{ color: primaryColor }}>
            Most Used Languages
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2.5 flex rounded-full overflow-hidden mb-4">
            {data.topLanguages?.map((lang, idx) => (
              <div key={idx} style={{ width: \`\${lang.percent}%\`, backgroundColor: lang.color || '#8b949e' }} />
            ))}
          </div>
          
          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {data.topLanguages?.slice(0, 6).map((lang, idx) => (
              <div key={idx} className="flex items-center text-xs">
                <div className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: lang.color || '#8b949e' }} />
                <span className="text-gray-300 font-mono tracking-tight truncate">
                  {lang.name} {lang.percent.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>`;

graphCode = graphCode.replace(/        \{\/\* Top Language \*\/\}[\s\S]*?<\/div>\n\n      <\/div>/, topLanguagesUI + '\n\n      </div>');

fs.writeFileSync('src/components/ContributionGraph.tsx', graphCode);
