import { THEMES } from '../themes';
import { calculateStreaks } from './streaks';

export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguages?: { name: string, color: string, percent: number }[], fontName: string = "inter", hideBorder: boolean = false, hideLanguages: boolean = false) {
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
        <circle cx="0" cy="30" r="40" fill="none" stroke="${primaryColor}" stroke-width="4" />
        <rect x="-18" y="-22" width="36" height="26" rx="13" fill="${theme.bg}" />
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
      <rect x="-8" y="-8" width="${heatmapWidth + 16}" height="${heatmapHeight + 16}" fill="#000000" fill-opacity="0.2" rx="8" stroke="#1f2937" stroke-opacity="0.3" stroke-width="1" />
`;

  weeks.forEach((week: any, weekIndex: number) => {
    week.days.forEach((day: any) => {
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
