import fs from 'fs';

let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// 1. Update props interface
code = code.replace(
  "  hideBorder?: boolean;",
  "  hideBorder?: boolean;\n  hideLanguages?: boolean;"
);

// 2. Destructure prop
code = code.replace(
  "hideBorder = false }: ContributionGraphProps",
  "hideBorder = false, hideLanguages = false }: ContributionGraphProps"
);

// 3. Wrap language row in condition
// It starts with {/* Row 2: Most Used Languages */}
code = code.replace(
  /      \{\/\* Row 2: Most Used Languages \*\/\}[\s\S]*?\{\/\* Heatmap Section \*\/\}/,
  `      {!hideLanguages && (
        <>
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
            <div className="grid grid-cols-3 gap-x-8 gap-y-3 w-full max-w-[700px] mx-auto mt-2">
              {data.topLanguages?.slice(0, 6).map((lang, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: lang.color || '#8b949e' }} />
                  <span className="text-gray-300 tracking-tight">
                    {lang.name} <span className="text-gray-500 ml-1">{lang.percent.toFixed(2)}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-[800px] h-px bg-gray-800/50 mb-6" />
        </>
      )}

      {/* Heatmap Section */}`
);

fs.writeFileSync('src/components/ContributionGraph.tsx', code);
