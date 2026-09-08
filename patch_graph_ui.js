import fs from 'fs';

let graphCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// 1. Update interface
graphCode = graphCode.replace('      days: { count: number; level: number; date: string }[];\n    }[];\n  };\n  theme?: string;', '      days: { count: number; level: number; date: string }[];\n    }[];\n    topLanguage?: { name: string; color: string };\n  };\n  theme?: string;');

// 2. Add Top Language column to UI
const colsReplacement = `      {/* Top Stats Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center mb-8 gap-8 md:gap-0">
        
        {/* Total Contributions */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold text-white mb-2 tracking-tight">
            {data.total_contributions.toLocaleString()}
          </div>
          <div className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
            Total Contributions
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {stats.totalRange}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-24 bg-gray-800 mx-4" />

        {/* Current Streak */}
        <div className="flex-1 flex flex-col items-center justify-center text-center relative">
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center rounded-full border-[3px]" style={{ borderColor: primaryColor }}>
            <div className="absolute -top-4 px-1" style={{ backgroundColor: currentTheme.bg }}>
              <Flame size={24} style={{ color: primaryColor, fill: primaryColor, fillOpacity: 0.2 }} />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">{stats.currentStreak}</span>
          </div>
          <div className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
            Current Streak
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {stats.currentRange}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-24 bg-gray-800 mx-4" />

        {/* Longest Streak */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold text-white mb-2 tracking-tight">
            {stats.longestStreak}
          </div>
          <div className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
            Longest Streak
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {stats.longestRange}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-24 bg-gray-800 mx-4" />

        {/* Top Language */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold mb-2 tracking-tight" style={{ color: data.topLanguage?.color || '#ffffff' }}>
            {data.topLanguage?.name || 'N/A'}
          </div>
          <div className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
            Most Used
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Language
          </div>
        </div>

      </div>`;

graphCode = graphCode.replace(/      \{\/\* Top Stats Section \*\/\}[\s\S]*?<\/div>\n\n      <div className="w-full max-w-\[800px\]/, colsReplacement + '\n\n      <div className="w-full max-w-[800px]');

// 3. Scale heatmap wrapper to prevent scrollbar
// Add a container wrapping the heatmap with responsive max-width to allow browser scale via svg scaling, OR we can just use CSS transform on a wrapper.
// Easiest is to add a container that handles overflow hidden, and set a scale transform on the inner div if width is small. 
// A simpler way with Tailwind: using `overflow-x-auto` was what we had. The prompt says "there should not be scroll bar. only reduce the size if required."
// To do this, we can wrap the matrix in an SVG and let the SVG handle viewbox scaling natively, OR use container queries, OR just use standard `min-width: min-content` and CSS scale using a ref.
// Or wait, just make the grid cells use relative sizing or CSS Grid!
// But wait, the SVG is already created by svgGenerator, why don't we just use that SVG?
// Or we can just use a `transform: scale(...)` based on a ResizeObserver.
// Let's add a ResizeObserver to scale the heatmap container.

const resizeObserverCode = `
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // The heatmap is 52 weeks * 15px + some padding = roughly 800px wide.
        const width = entry.contentRect.width;
        if (width < 800) {
          setScale(width / 800);
        } else {
          setScale(1);
        }
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);
`;

// Insert after `const primaryColor = ...`
graphCode = graphCode.replace("const primaryColor = currentTheme.levels[4] || '#39d353';", "const primaryColor = currentTheme.levels[4] || '#39d353';\n" + resizeObserverCode);

// Wrap the heatmap section
const heatmapContainerReplacement = `      {/* Heatmap Section */}
      <div className="w-full max-w-[800px] flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
        <div style={{ transform: \`scale(\${scale})\`, transformOrigin: 'top center', width: '800px' }}>
          <div className="text-lg mb-4" style={{ color: primaryColor }}>
            Heatmap (Last 52 Weeks)
          </div>
          
          <div className="flex gap-[3px] p-4 rounded-xl border border-gray-800/30 bg-black/20 shadow-inner">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    title={\`\${day.count} contributions on \${day.date || 'unknown'}\`}
                    className="w-[12px] h-[12px] rounded-sm transition-opacity hover:opacity-80 cursor-pointer"
                    style={{ backgroundColor: currentTheme.levels[day.level] || currentTheme.levels[4] }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 text-sm font-mono" style={{ color: primaryColor }}>
            <span>{data.weeks[0]?.days[0]?.date.replace(/-/g, '.')}</span>
            <span>{data.weeks[data.weeks.length - 1]?.days[data.weeks[data.weeks.length - 1]?.days.length - 1]?.date.replace(/-/g, '.')}</span>
          </div>
        </div>
      </div>`;

graphCode = graphCode.replace(/      \{\/\* Heatmap Section \*\/\}[\s\S]*?<\/div>\n    <\/div>/, heatmapContainerReplacement + '\n    </div>');

fs.writeFileSync('src/components/ContributionGraph.tsx', graphCode);
