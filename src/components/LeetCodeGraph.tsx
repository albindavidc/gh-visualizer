import React from 'react';
import { THEMES } from '../themes';
import { calculateStreaks } from '../utils/streaks';
import { Flame, Target } from 'lucide-react';
import { parseSubmissionCalendar } from '../utils/leetcode';

interface LeetCodeGraphProps {
  data: any;
  theme?: string;
  font?: string;
  hideBorder?: boolean;
}

export function LeetCodeGraph({ data, theme = 'github', font = 'inter', hideBorder = false }: LeetCodeGraphProps) {
  const currentTheme = THEMES[theme] || THEMES.github;
  
  const weeks = parseSubmissionCalendar(data.submissionCalendar);
  const primaryColor = currentTheme.levels[4] || '#ffa116';
  
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
  const weekCount = weeks.length;
  const computedWidth = weekCount * 12 + Math.max(0, weekCount - 1) * 3 + 18;
  const maxDays = Math.max(...weeks.map(w => w.days.length), 1);
  const computedHeight =
    44 + // title block: text-lg line-height (28) + mb-4 (16)
    (maxDays * 12 + Math.max(0, maxDays - 1) * 3 + 18) + // grid rows (12px cells + 3px gaps) + p-2 padding (16) + border (2)
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

  const totalSolved = (data.problem?.easy?.solved || 0) + (data.problem?.medium?.solved || 0) + (data.problem?.hard?.solved || 0);
  const totalQuestions = (data.problem?.easy?.total || 0) + (data.problem?.medium?.total || 0) + (data.problem?.hard?.total || 0);
  const percentSolved = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  
  // Calculate dash offset for ring
  const circleCircumference = 2 * Math.PI * 50; // r=50
  const strokeDashoffset = circleCircumference - (percentSolved / 100) * circleCircumference;

  const titleColor = currentTheme.text?.[0] || '#fff';
  const subtitleColor = currentTheme.text?.[1] || '#8b949e';
  const borderColor = currentTheme.levels[1] || '#2d333b';

  return (
    <div 
      className={`w-full flex flex-col items-center justify-center min-h-[650px] pb-12 pl-12 pr-12 rounded-lg border ${!hideBorder ? 'border-gray-800' : 'border-transparent'}`}
      style={{ backgroundColor: currentTheme.bg, fontFamily, color: titleColor }}
    >
      {/* Header: Username */}
      <div className="w-full flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: titleColor }}><path d="M22,14.355c0-0.742-0.564-1.346-1.26-1.346H10.676c-0.696,0-1.26,0.604-1.26,1.346s0.563,1.346,1.26,1.346H20.74C21.436,15.702,22,15.098,22,14.355z" /><path d="M3.482,18.187l4.313,4.361C8.768,23.527,10.113,24,11.598,24c1.485,0,2.83-0.512,3.805-1.494l2.588-2.637c0.51-0.514,0.492-1.365-0.039-1.9c-0.531-0.535-1.375-0.553-1.884-0.039l-2.676,2.607c-0.462,0.467-1.102,0.662-1.809,0.662s-1.346-0.195-1.81-0.662l-4.298-4.363c-0.463-0.467-0.696-1.15-0.696-1.863c0-0.713,0.233-1.357,0.696-1.824l4.285-4.38c0.463-0.467,1.116-0.645,1.822-0.645s1.346,0.195,1.809,0.662l2.676,2.606c0.51,0.515,1.354,0.497,1.885-0.038c0.531-0.536,0.549-1.387,0.039-1.901l-2.588-2.636c-0.649-0.646-1.471-1.116-2.392-1.33l-0.034-0.007l2.447-2.503c0.512-0.514,0.494-1.366-0.037-1.901c-0.531-0.535-1.376-0.552-1.887-0.038L3.482,10.476C2.509,11.458,2,12.813,2,14.311C2,15.809,2.509,17.207,3.482,18.187z" /></svg>
          <span className="text-2xl font-semibold tracking-wide" style={{ color: titleColor }}>{(data.profile?.username || '').toLowerCase()}</span>
        </div>
        <div className="text-sm" style={{ color: primaryColor }}>
          LeetCode Stats
        </div>
      </div>

      {/* Top Stats Section */}
      <div className="w-full max-w-[800px] flex items-center justify-center mb-10 gap-16">
        
        {/* Completion Ring */}
        <div className="flex flex-col items-center justify-center text-center relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Ring Background */}
            <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                fill="none" 
                stroke={currentTheme.levels[1] || '#2d333b'} 
                strokeWidth="8" 
              />
              {/* SVG Ring Progress */}
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                fill="none" 
                stroke={primaryColor} 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={(2 * Math.PI * 70) - ((totalSolved / (totalQuestions || 1)) * (2 * Math.PI * 70))}
                transform="rotate(-90 80 80)"
              />
            </svg>
            
            <span className="text-5xl font-bold tracking-tight" style={{ color: titleColor }}>
              {totalSolved}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-32 w-px" style={{ backgroundColor: '#1f2937' }} />

        {/* Difficulty Breakdown with Progress Bars */}
        <div className="flex flex-col justify-center w-full max-w-[480px] gap-6">
           
           {/* Easy */}
           <div className="flex flex-col w-full">
             <div className="flex justify-between items-end mb-2">
               <span className="text-base font-bold" style={{ color: currentTheme.levels[2] || '#00b8a3' }}>Easy</span>
               <span className="font-bold text-base" style={{ color: currentTheme.levels[2] || subtitleColor }}>{data.problem?.easy?.solved} <span className="font-medium text-sm opacity-60" style={{ color: currentTheme.levels[2] || '#00b8a3' }}>/ {data.problem?.easy?.total}</span></span>
             </div>
             <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.levels[1] || '#2d333b' }}>
               <div className="h-full rounded-full" style={{ width: `${(data.problem?.easy?.solved / (data.problem?.easy?.total || 1)) * 100}%`, backgroundColor: currentTheme.levels[2] || '#00b8a3' }} />
             </div>
           </div>

           {/* Medium */}
           <div className="flex flex-col w-full">
             <div className="flex justify-between items-end mb-2">
               <span className="text-base font-bold" style={{ color: currentTheme.levels[3] || '#ffc01e' }}>Medium</span>
               <span className="font-bold text-base" style={{ color: currentTheme.levels[3] || subtitleColor }}>{data.problem?.medium?.solved} <span className="font-medium text-sm opacity-60" style={{ color: currentTheme.levels[3] || '#ffc01e' }}>/ {data.problem?.medium?.total}</span></span>
             </div>
             <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.levels[1] || '#2d333b' }}>
               <div className="h-full rounded-full" style={{ width: `${(data.problem?.medium?.solved / (data.problem?.medium?.total || 1)) * 100}%`, backgroundColor: currentTheme.levels[3] || '#ffc01e' }} />
             </div>
           </div>

           {/* Hard */}
           <div className="flex flex-col w-full">
             <div className="flex justify-between items-end mb-2">
               <span className="text-base font-bold" style={{ color: currentTheme.levels[4] || '#ef4743' }}>Hard</span>
               <span className="font-bold text-base" style={{ color: currentTheme.levels[4] || subtitleColor }}>{data.problem?.hard?.solved} <span className="font-medium text-sm opacity-60" style={{ color: currentTheme.levels[4] || '#ef4743' }}>/ {data.problem?.hard?.total}</span></span>
             </div>
             <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.levels[1] || '#2d333b' }}>
               <div className="h-full rounded-full" style={{ width: `${(data.problem?.hard?.solved / (data.problem?.hard?.total || 1)) * 100}%`, backgroundColor: currentTheme.levels[4] || '#ef4743' }} />
             </div>
           </div>
        </div>

      </div>

      <div className="w-full max-w-[800px] h-px mt-8 mb-[18px]" style={{ backgroundColor: '#1f2937' }} />

      {/* Heatmap Section */}
      <div className="w-full h-full flex justify-center" ref={containerRef} style={{ maxWidth: `${computedWidth}px`, maxHeight: containerHeight }}>
        <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: `${computedWidth}px`, minWidth: `${computedWidth}px`, flexShrink: 0 }}>
          <div className="text-lg mb-4" style={{ color: primaryColor }}>
            Heatmap (Last 52 Weeks)
          </div>
          
          <div className="flex gap-[3px] p-2 rounded-lg border border-[#162413] bg-[#0A0A0A]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    title={`${day.count} submissions on ${day.date || 'unknown'}`}
                    className="w-[12px] h-[12px] rounded-sm transition-opacity hover:opacity-80 cursor-pointer"
                    style={{ backgroundColor: currentTheme.levels[day.level] || currentTheme.levels[4] }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm" style={{ color: primaryColor }}>
            <span>{weeks[0]?.days[0]?.date?.replace(/-/g, '.')}</span>
            <span>{weeks[weeks.length - 1]?.days[weeks[weeks.length - 1]?.days.length - 1]?.date?.replace(/-/g, '.')}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
