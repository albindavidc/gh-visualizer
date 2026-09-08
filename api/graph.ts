
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- INLINED LOGIC FOR VERCEL SERVERLESS ---
const THEMES: Record<string, { bg: string, levels: string[] }> = {
  github: {
    bg: '#0d1117',
    levels: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  sleek: {
    bg: '#0A0A0A',
    levels: ['#162413', '#38591a', '#5c8f22', '#7ec42a', '#a3ff33'],
  },
  dracula: {
    bg: '#282a36',
    levels: ['#44475a', '#6272a4', '#8be9fd', '#bd93f9', '#ff79c6'],
  },
  ocean: {
    bg: '#0A0A0A',
    levels: ['#161b22', '#0c2d48', '#145da0', '#2e8bc0', '#b1d4e0'],
  },
  amber: {
    bg: '#0A0A0A',
    levels: ['#161b22', '#78350f', '#b45309', '#f59e0b', '#fcd34d'],
  }
};


export interface Day {
  date: string;
  count: number;
  level: number;
  weekday?: number;
}

export interface Week {
  days: Day[];
}

function calculateStreaks(weeks: Week[]) {
  const days: Day[] = [];
  weeks.forEach(w => w.days.forEach(d => days.push(d)));

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

  // Current streak (counting backwards from today)
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.count > 0) {
      if (currentStreak === 0) currentStreakEnd = day.date;
      currentStreak++;
      currentStreakStart = day.date;
    } else {
      // If it's the very last day (today) and count is 0, we forgive it and keep looking at yesterday.
      // If it's NOT the last day, the streak is broken.
      if (i !== days.length - 1) {
        break;
      }
    }
  }

  // formatting helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  return {
    currentStreak,
    longestStreak,
    currentRange,
    longestRange,
    totalRange
  };
}



function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguages?: { name: string, color: string, percent: number }[], fontName: string = "inter", hideBorder: boolean = false, hideLanguages: boolean = false) {
  const theme = THEMES[themeName] || THEMES.github;
  const primaryColor = theme.levels[4] || '#39d353';
  const stats = calculateStreaks(weeks);
  
  // Dimensions
  const padding = 24;
  const cardWidth = 850;
  
  // Heatmap dimensions
  const cellSize = 12;
  const gap = 3;
  const heatmapWidth = (weeks.length * cellSize) + ((weeks.length - 1) * gap);
  const heatmapHeight = (7 * cellSize) + (6 * gap);
  

  let langBarSvg = '';
  let langGridSvg = '';
  let currentX = 0;
  
  if (topLanguages && topLanguages.length > 0) {
    // Generate Progress Bar segments
    const fullWidth = cardWidth - (padding * 2);
    topLanguages.forEach((lang) => {
      const barWidth = (lang.percent / 100) * fullWidth;
      langBarSvg += `<rect x="${currentX}" y="0" width="${barWidth}" height="10" fill="${lang.color || '#8b949e'}" />`;
      currentX += barWidth;
    });
    
    // Generate 3-column grid for up to 6 languages, perfectly centered
    const visibleLangs = topLanguages.slice(0, 6);
    visibleLangs.forEach((lang, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const xPos = col * (fullWidth / 3) + (fullWidth * 0.08); // Offset to center 3 columns
      const yPos = 24 + (row * 24);
      
      langGridSvg += `
        <g transform="translate(${xPos}, ${yPos})">
          <circle cx="4" cy="-4" r="5" fill="${lang.color || '#8b949e'}" />
          <text x="16" y="0" class="text label" font-size="14">${lang.name} <tspan fill="#6b7280">${lang.percent.toFixed(2)}%</tspan></text>
        </g>
      `;
    });
    

    

  } else {
    langGridSvg = '<text x="0" y="30" class="mono date">No language data</text>';
  }

  const statsHeight = hideLanguages ? 130 : 280;
  const dividerHeight = 1;
  const innerPadding = 24;
  
  const cardHeight = padding + 60 + statsHeight + innerPadding + dividerHeight + innerPadding + heatmapHeight + 50 + padding;
  
  const heatmapXOffset = Math.max(padding, (cardWidth - heatmapWidth) / 2);

  // Flame SVG Path
  const flameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}">
    
    <defs>
      <clipPath id="bar-clip">
        <rect x="0" y="0" width="180" height="8" rx="4" />
      </clipPath>
      <clipPath id="bar-clip-full">
        <rect x="0" y="0" width="${cardWidth - padding*2}" height="12" rx="6" />
      </clipPath>

    </defs>
    <style>
      .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
      .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
      .title { font-size: 32px; fill: #ffffff; }
      .label { font-size: 14px; fill: ${primaryColor}; }
      .date { font-size: 12px; fill: #9ca3af; }
    </style>
    
    <!-- Background -->
    ${!hideBorder ? `<rect width="100%" height="100%" fill="${theme.bg}" rx="12" stroke="#1f2937" stroke-width="1" />` : ''}
    
    <!-- Top Stats Section - Row 1 -->
    <g transform="translate(0, ${padding})">
      <!-- Column 1: Total Contributions -->
      <g transform="translate(${cardWidth * 0.22}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">${totalContributions.toLocaleString()}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Total Contributions</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">${stats.totalRange}</text>
      </g>
      
      <!-- Divider 1 -->
      <rect x="${cardWidth * 0.38}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 2: Current Streak -->
      <g transform="translate(${cardWidth * 0.50}, 0)">
        <circle cx="0" cy="30" r="40" fill="none" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" stroke-dasharray="205 46.3" stroke-dashoffset="-23.15" transform="rotate(-90 0 30)" />
        <g transform="translate(-14, -24) scale(1.1)">
          ${flameSvg}
        </g>
        <text x="0" y="42" text-anchor="middle" class="text bold title" font-size="36">${stats.currentStreak}</text>
        <text x="0" y="90" text-anchor="middle" class="text medium label">Current Streak</text>
        <text x="0" y="115" text-anchor="middle" class="mono date">${stats.currentRange}</text>
      </g>
      
      <!-- Divider 2 -->
      <rect x="${cardWidth * 0.62}" y="10" width="1" height="90" fill="#1f2937" />
      
      <!-- Column 3: Longest Streak -->
      <g transform="translate(${cardWidth * 0.78}, 0)">
        <text x="0" y="40" text-anchor="middle" class="text bold title">${stats.longestStreak}</text>
        <text x="0" y="70" text-anchor="middle" class="text medium label">Longest Streak</text>
        <text x="0" y="95" text-anchor="middle" class="mono date">${stats.longestRange}</text>
      </g>
    </g>
    
    <!-- Horizontal Divider -->
    ${!hideLanguages ? `
    <rect x="${padding}" y="${padding + 150}" width="${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(${padding}, ${padding + 180})">
      <text x="${(cardWidth - padding*2) / 2}" y="0" text-anchor="middle" class="text medium label" font-size="16" fill="${primaryColor}">Most Used Languages</text>
      
      <!-- Progress Bar Background/Mask -->
      <g transform="translate(0, 20)">
        <g clip-path="url(#bar-clip-full)">
          <rect x="0" y="0" width="${cardWidth - padding*2}" height="12" fill="#1f2937" />
          ${langBarSvg}
        </g>
      </g>
      
      <!-- Legend Grid -->
      <g transform="translate(0, 50)">
        ${langGridSvg}
      </g>
    </g>
    ` : ''}

    <!-- Horizontal Divider -->
    <rect x="${padding}" y="${padding + statsHeight + innerPadding}" width="${cardWidth - (padding * 2)}" height="1" fill="#1f2937" />
    
    <!-- Heatmap -->
    <g transform="translate(${heatmapXOffset}, ${padding + statsHeight + innerPadding + dividerHeight + innerPadding})">
      <rect x="-8" y="-8" width="${heatmapWidth + 16}" height="${heatmapHeight + 16}" fill="#0A0A0A" rx="8" stroke="#162413" stroke-width="1" />
`;

  weeks.forEach((week: any, weekIndex: number) => {
    week.days.forEach((day: any, dayIndex: number) => {
      // SVG generator expects { date, count, level, weekday }
      // Our streaks utility gives us everything we need, but we need weekday for Y pos
      // Since it's a 7-day week array, we can just use the dayIndex (0 = Sunday, 6 = Saturday)
      // Note: The GraphQL API groups them from Sunday to Saturday.
      const color = theme.levels[day.level] || theme.levels[4];
      const x = weekIndex * (cellSize + gap);
      const y = day.weekday !== undefined ? day.weekday * (cellSize + gap) : weekIndex * 7; // fallback
      
      // We need proper Y calculation. In `api/graph.ts` previously it was `day.weekday`.
      // The `server.ts` data processing maps from `contributionDays` where `weekday` wasn't explicitly passed in `server.ts` mapping.
      // Wait, let's fix the GraphQL query to fetch `weekday` and map it, or just rely on `dayIndex`.
      // Actually `dayIndex` corresponds to the position in the week.
      const finalY = day.weekday !== undefined ? day.weekday * (cellSize + gap) : dayIndex * (cellSize + gap);

      svg += `<rect x="${x}" y="${finalY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2" />`;
    });
  });

  svg += `
    </g>
  </svg>`;

  return svg;
}

// -------------------------------------------

const NUM_WEEKS = 52;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = req.query.username as string;
  const themeName = (req.query.theme as string) || 'github';
  const fontName = (req.query.font as string) || 'inter';
  const hideBorder = req.query.hide_border === 'true';
  const hideLanguages = req.query.hide_languages === 'true';

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
        repositories(ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
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
    
    const languages: Record<string, { size: number, color: string }> = {};
    const repos = data.data.user.repositories?.nodes || [];
    let totalSize = 0;
    
    repos.forEach((repo: any) => {
      if (repo.languages && repo.languages.edges) {
        repo.languages.edges.forEach((edge: any) => {
           const size = edge.size;
           const { name, color } = edge.node;
           if (!languages[name]) languages[name] = { size: 0, color };
           languages[name].size += size;
           totalSize += size;
        });
      }
    });
    
    const topLanguages = Object.entries(languages)
      .map(([name, info]) => ({
         name,
         color: info.color,
         percent: totalSize > 0 ? (info.size / totalSize) * 100 : 0
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 6);

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

    if (weeks.length > NUM_WEEKS) {
      weeks = weeks.slice(-NUM_WEEKS);
    }

    const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguages, fontName, hideBorder, hideLanguages);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    res.status(200).send(svg);
  } catch (err: any) {
    res.status(500).send(err.message || "Internal Server Error");
  }
}
