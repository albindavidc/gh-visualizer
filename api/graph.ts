import type { VercelRequest, VercelResponse } from '@vercel/node';

// We import the same logic used in the express server
// Note: In Vercel serverless, we'll need a standalone SVG generation since ES modules pathing can be tricky.
// Let's just inline a simple require for the themes and SVG generator.
// Actually, Vercel will bundle this file, but it's safer to just provide the exact same logic.

const THEMES: Record<string, { bg: string, levels: string[] }> = {
  github: { bg: '#0d1117', levels: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] },
  sleek: { bg: '#0A0A0A', levels: ['#161b22', '#3f6212', '#65a30d', '#84cc16', '#a3e635'] },
  dracula: { bg: '#282a36', levels: ['#44475a', '#6272a4', '#8be9fd', '#bd93f9', '#ff79c6'] },
  ocean: { bg: '#0A0A0A', levels: ['#161b22', '#0c2d48', '#145da0', '#2e8bc0', '#b1d4e0'] },
  amber: { bg: '#0A0A0A', levels: ['#161b22', '#78350f', '#b45309', '#f59e0b', '#fcd34d'] },
};

function calculateStreaks(weeks: any[]) {
  const days: any[] = [];
  weeks.forEach(w => w.days.forEach((d: any) => days.push(d)));

  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakStart = "";
  let currentStreakEnd = "";
  let longestStreakStart = "";
  let longestStreakEnd = "";
  
  let tempStreak = 0;
  let tempStart = "";
  
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.count > 0) {
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStart;
        longestStreakEnd = day.date;
      }
    } else {
      tempStreak = 0;
      tempStart = "";
    }
  }

  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.count > 0) {
      if (currentStreak === 0) currentStreakEnd = day.date;
      currentStreak++;
      currentStreakStart = day.date;
    } else {
      if (i !== days.length - 1) {
        break;
      }
    }
  }

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const currentRange = currentStreak > 0 
    ? (currentStreakStart === currentStreakEnd ? formatShortDate(currentStreakStart) : `${formatShortDate(currentStreakStart)} - ${formatShortDate(currentStreakEnd)}`)
    : '-';
    
  const longestRange = longestStreak > 0
    ? (longestStreakStart === longestStreakEnd ? formatShortDate(longestStreakStart) : `${formatShortDate(longestStreakStart)} - ${formatShortDate(longestStreakEnd)}`)
    : '-';
    
  const firstDay = days[0]?.date || '';
  const lastDay = days[days.length - 1]?.date || '';
  const totalRange = firstDay && lastDay ? `${formatDate(firstDay)} - ${formatDate(lastDay).split(',')[1] || 'Present'}` : '-';

  return { currentStreak, longestStreak, currentRange, longestRange, totalRange };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = req.query.username as string;
  const themeName = (req.query.theme as string) || 'github';
  const theme = THEMES[themeName] || THEMES.github;
  const primaryColor = theme.levels[4] || '#39d353';

  if (!username) {
    return res.status(400).send("Username is required");
  }

  const token = process.env.GH_TOKEN;
  if (!token) {
    return res.status(500).send("GitHub token not configured on Vercel");
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                weekday
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      return res.status(response.status).send(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.errors || !data.data?.user) {
      return res.status(404).send(`User '${username}' not found or API error`);
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    let weeks = calendar.weeks.map((weekData: any) => {
        return {
          days: weekData.contributionDays.map((dayData: any) => ({
            date: dayData.date,
            weekday: dayData.weekday,
            count: dayData.contributionCount,
            level: {
              NONE: 0,
              FIRST_QUARTILE: 1,
              SECOND_QUARTILE: 2,
              THIRD_QUARTILE: 3,
              FOURTH_QUARTILE: 4,
            }[dayData.contributionLevel] || 0,
          })),
        };
    });
      
    if (weeks.length > 52) {
      weeks = weeks.slice(-52);
    }
    
    const stats = calculateStreaks(weeks);
    const totalContributions = calendar.totalContributions;

    const padding = 24;
    const cardWidth = 850;
    const cellSize = 12;
    const gap = 3;
    const heatmapWidth = (weeks.length * cellSize) + ((weeks.length - 1) * gap);
    const heatmapHeight = (7 * cellSize) + (6 * gap);
    const statsHeight = 140;
    const dividerHeight = 1;
    const innerPadding = 24;
    const cardHeight = padding + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + padding;
    const heatmapXOffset = Math.max(padding, (cardWidth - heatmapWidth) / 2);

    const flameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>`;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}">
      <style>
        .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
        .bold { font-weight: 700; }
        .medium { font-weight: 500; }
        .title { font-size: 32px; fill: #ffffff; }
        .label { font-size: 14px; fill: ${primaryColor}; }
        .date { font-size: 12px; fill: #9ca3af; }
      </style>
      
      <rect width="100%" height="100%" fill="${theme.bg}" rx="12" />
      
      <g transform="translate(0, ${padding})">
        <g transform="translate(${cardWidth / 6}, 0)">
          <text x="0" y="40" text-anchor="middle" class="text bold title">${totalContributions.toLocaleString()}</text>
          <text x="0" y="70" text-anchor="middle" class="text medium label">Total Contributions</text>
          <text x="0" y="95" text-anchor="middle" class="mono date">${stats.totalRange}</text>
        </g>
        
        <rect x="${cardWidth / 3}" y="10" width="1" height="90" fill="#1f2937" />
        
        <g transform="translate(${cardWidth / 2}, 0)">
          <circle cx="0" cy="30" r="36" fill="none" stroke="${primaryColor}" stroke-width="3" />
          <rect x="-16" y="-20" width="32" height="24" fill="${theme.bg}" />
          <g transform="translate(-12, -22)">
            ${flameSvg}
          </g>
          <text x="0" y="40" text-anchor="middle" class="text bold title">${stats.currentStreak}</text>
          <text x="0" y="90" text-anchor="middle" class="text medium label">Current Streak</text>
          <text x="0" y="115" text-anchor="middle" class="mono date">${stats.currentRange}</text>
        </g>
        
        <rect x="${(cardWidth / 3) * 2}" y="10" width="1" height="90" fill="#1f2937" />
        
        <g transform="translate(${(cardWidth / 6) * 5}, 0)">
          <text x="0" y="40" text-anchor="middle" class="text bold title">${stats.longestStreak}</text>
          <text x="0" y="70" text-anchor="middle" class="text medium label">Longest Streak</text>
          <text x="0" y="95" text-anchor="middle" class="mono date">${stats.longestRange}</text>
        </g>
      </g>
      
      <rect x="${padding}" y="${padding + statsHeight + innerPadding}" width="${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
      
      <g transform="translate(${heatmapXOffset}, ${padding + statsHeight + innerPadding + dividerHeight + innerPadding})">
        <rect x="-8" y="-8" width="${heatmapWidth + 16}" height="${heatmapHeight + 16}" fill="#000000" fill-opacity="0.2" rx="8" stroke="#1f2937" stroke-opacity="0.3" stroke-width="1" />
  `;

    weeks.forEach((week: any, weekIndex: number) => {
      week.days.forEach((day: any, dayIndex: number) => {
        const color = theme.levels[day.level] || theme.levels[4];
        const x = weekIndex * (cellSize + gap);
        const finalY = day.weekday !== undefined ? day.weekday * (cellSize + gap) : dayIndex * (cellSize + gap);
        svg += `<rect x="${x}" y="${finalY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2" />`;
      });
    });

    svg += `
      </g>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(svg);
  } catch (err: any) {
    res.status(500).send(err.message || "Internal Server Error");
  }
}
