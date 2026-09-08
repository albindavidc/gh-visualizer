import fs from 'fs';

let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// Update Legend Grid to match the image strictly
const newGrid = `        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 w-full max-w-[600px] mx-auto mt-2">
          {data.topLanguages?.slice(0, 6).map((lang, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: lang.color || '#8b949e' }} />
              <span className="text-gray-300 tracking-tight">
                {lang.name} <span className="text-gray-500 ml-1">{lang.percent.toFixed(2)}%</span>
              </span>
            </div>
          ))}
        </div>`;

code = code.replace(/        \{\/\* Legend Grid \*\/\}[\s\S]*?<\/div>/, newGrid);

fs.writeFileSync('src/components/ContributionGraph.tsx', code);
