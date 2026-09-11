import React from 'react';
import { THEMES } from '../themes';
import { calculateStreaks } from '../utils/streaks';
import { Flame, Github } from 'lucide-react';

interface ContributionGraphProps {
  data: {
    username: string;
    total_contributions: number;
    weeks: {
      days: { count: number; level: number; date: string }[];
    }[];
    topLanguages?: { name: string; color: string; percent: number }[];
  };
  theme?: string;
  font?: string;
  hideBorder?: boolean;
  hideLanguages?: boolean;
}

export function ContributionGraph({ data, theme = 'github', font = 'inter', hideBorder = false, hideLanguages = false }: ContributionGraphProps) {
  const currentTheme = THEMES[theme] || THEMES.github;
  const stats = calculateStreaks(data.weeks);
  const primaryColor = currentTheme.levels[4] || '#39d353';

  const fontFamilies: Record<string, string> = {
    'inter': '"Inter", sans-serif',
    'roboto': '"Roboto", sans-serif',
    'noto sans coptic': '"Noto Sans Coptic", sans-serif',
    'milonga': '"Milonga", cursive',
    'mali': '"Mali", cursive',
    'patrick_hand': '"Patrick Hand", cursive',
    'ruthie': '"Ruthie", cursive',
    'source_code_pro': '"Source Code Pro", monospace',
    'baloo_2': '"Baloo 2", cursive',
  };
  const fontFamily = fontFamilies[font.toLowerCase()] || fontFamilies.inter;


const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const weekCount = data.weeks.length;
  const computedWidth = weekCount * 12 + Math.max(0, weekCount - 1) * 3 + 34;
  const maxDays = Math.max(...data.weeks.map(w => w.days.length), 1);
  const computedHeight =
    44 + // title block: text-lg line-height (28) + mb-4 (16)
    (maxDays * 12 + Math.max(0, maxDays - 1) * 3 + 34) + // grid rows (12px cells + 3px gaps) + p-4 padding (32) + border (2)
    32; // date row: mt-3 (12) + text-sm line-height (20)

  const [containerHeight, setContainerHeight] = React.useState<number | undefined>(computedHeight);

  React.useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current || !contentRef.current) return;
      const width = containerRef.current.getBoundingClientRect().width;
      if (width < computedWidth) {
        const newScale = width / computedWidth;
        setScale(newScale);
        setContainerHeight(contentRef.current.offsetHeight * newScale + 10);
      } else {
        setScale(1);
        setContainerHeight(undefined);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    // Call once to ensure it runs immediately when data changes
    updateSize();
    
    return () => resizeObserver.disconnect();
  }, [data]);


  return (
    <div 
      className={`w-full flex flex-col items-center justify-center min-h-[800px] pb-8 pl-8 pr-8 rounded-lg border ${!hideBorder ? 'border-gray-800' : 'border-transparent'}`}
      style={{ backgroundColor: currentTheme.bg, fontFamily }}

    >
      {/* Header: Username */}
      <div className="w-full flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-3">
          <Github size={28} className="text-white" />
          <span className="text-2xl font-semibold text-white tracking-wide">{data.username}</span>
        </div>
        <div className="text-sm " style={{ color: primaryColor }}>
          GitHub Stats
        </div>
      </div>

      {/* Top Stats Section - Row 1 */}
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
            {data.createdAt 
              ? `${new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - Present` 
              : 'All Time'}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-28 bg-gray-800" />

        {/* Current Streak (Increased Size) */}
        <div className="flex-[1.2] flex flex-col items-center justify-center text-center relative scale-110">
          <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
            {/* SVG Ring with Gap */}
            <svg width="112" height="112" viewBox="0 0 112 112" className="absolute inset-0">
              <circle 
                cx="56" 
                cy="56" 
                r="50" 
                fill="none" 
                stroke={primaryColor} 
                strokeWidth="6" 
                strokeLinecap="round"
                strokeDasharray="264 50"
                strokeDashoffset="-25"
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

      {!hideLanguages && (
        <>
          {/* Row 2: Most Used Languages */}
          <div className="w-full max-w-[800px] flex flex-col mb-10">
            <div className="text-lg font-medium mb-4 text-center" style={{ color: primaryColor }}>
              Most Used Languages
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 flex rounded-full overflow-hidden mb-5 bg-gray-900">
              {data.topLanguages?.map((lang, idx) => (
                <div key={idx} style={{ width: `${lang.percent}%`, backgroundColor: lang.color || '#8b949e' }} />
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

      {/* Heatmap Section */}
      <div className="w-full flex justify-center" ref={containerRef} style={{ maxWidth: `${computedWidth}px`, maxHeight: containerHeight }}>
        <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: `${computedWidth}px`, minWidth: `${computedWidth}px`, flexShrink: 0 }}>
          <div className="text-lg mb-4" style={{ color: primaryColor }}>
            Heatmap (Last 52 Weeks)
          </div>
          
          <div className="flex gap-[3px] p-4 rounded-xl border border-[#162413] bg-[#0A0A0A] shadow-inner">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    title={`${day.count} contributions on ${day.date || 'unknown'}`}
                    className="w-[12px] h-[12px] rounded-sm transition-opacity hover:opacity-80 cursor-pointer"
                    style={{ backgroundColor: currentTheme.levels[day.level] || currentTheme.levels[4] }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 text-sm " style={{ color: primaryColor }}>
            <span>{data.weeks[0]?.days[0]?.date?.replace(/-/g, '.')}</span>
            <span>{data.weeks[data.weeks.length - 1]?.days[data.weeks[data.weeks.length - 1]?.days.length - 1]?.date?.replace(/-/g, '.')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
