import React from 'react';

interface ContributionGraphProps {
  data: {
    username: string;
    weeks: {
      days: { count: number; level: number; date: string }[];
    }[];
  };
}

const THEME = {
  bg: '#0A0A0A', // the requested color
  levels: [
    '#161b22', // Level 0 (Empty)
    '#0e4429', // Level 1
    '#006d32', // Level 2
    '#26a641', // Level 3
    '#39d353', // Level 4
  ],
};

export function ContributionGraph({ data }: ContributionGraphProps) {
  // We expect up to 52 weeks, 7 days a week.
  return (
    <div 
      className="w-full flex items-center justify-center p-6 rounded-lg"
      style={{ backgroundColor: THEME.bg }}
    >
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {data.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {/* Some weeks might have fewer than 7 days if it's the start/end of the year,
                so we render up to 7 slots properly aligned. 
                For a simple visualization, we just map over the days. */}
            {week.days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                title={`${day.count} contributions on ${day.date || 'unknown'}`}
                className="w-[12px] h-[12px] rounded-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: THEME.levels[day.level] || THEME.levels[4] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
