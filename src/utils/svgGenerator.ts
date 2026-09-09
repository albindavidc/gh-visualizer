import { THEMES } from '../themes';
import { FONTS_CSS } from './fonts';
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

// Heights and Margins
  const headerHeight = 40;
  const headerMb = 30;
  const row1Height = 120;
  const row1Mb = 40;
  const dividerHeight = 1;
  const dividerMb = 32;
  const row2Height = 100;
  const row2Mb = 40;
  const divider2Mb = 10;

  const headerY = padding;
  const row1Y = headerY + headerHeight + headerMb;
  
  const divider1Y = row1Y + row1Height + row1Mb;
  const row2Y = divider1Y + dividerHeight + dividerMb;
  const divider2Y = hideLanguages ? (row1Y + row1Height + row1Mb) : (row2Y + row2Height + row2Mb);
  const heatmapTitleHeight = 30;
  const heatmapTitleY = divider2Y + dividerHeight + divider2Mb;
  const heatmapY = heatmapTitleY + heatmapTitleHeight;
  
  const cardHeight = heatmapY + heatmapHeight + 60 + padding;
  
  const heatmapXOffset = Math.max(padding, (cardWidth - heatmapWidth) / 2);

  // Flame SVG Path
  const githubLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`;
  const flameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>`;

  const fontFamilies: Record<string, string> = {
    'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    'mali': '"Mali", cursive',
    'roboto mono': '"Roboto Mono", monospace',
    'comic neue': '"Comic Neue", cursive',
  };
  const fontFamily = fontFamilies[fontName.toLowerCase()] || fontFamilies.inter;
  const fontImport = FONTS_CSS;

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
      ${fontImport}
      .text, .title, .label, .date { font-family: ${fontFamily}; }
      .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
      .title { font-size: 32px; fill: #ffffff; }
      .label { font-size: 14px; fill: ${primaryColor}; }
      .date { font-size: 12px; fill: #9ca3af; }
    </style>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="${theme.bg}" rx="12" ${!hideBorder ? 'stroke="#1f2937" stroke-width="1"' : ''} />
    
    <!-- Header -->
    <g transform="translate(${padding + 16}, ${padding})">
      ${githubLogo}
      <text x="40" y="20" class="text bold" font-size="24" fill="#ffffff" dominant-baseline="middle">${username}</text>
    </g>
    <g transform="translate(${cardWidth - padding - 16}, ${padding})">
      <text x="0" y="20" class="text medium label" text-anchor="end" dominant-baseline="middle">GitHub Stats</text>
    </g>
    
    <!-- Top Stats Section - Row 1 -->
    <g transform="translate(0, ${row1Y})">
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
        <circle cx="0" cy="30" r="36" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round" stroke-dasharray="196.2 30" stroke-dashoffset="-15" transform="rotate(-90 0 30)" />
        <g transform="translate(-12, -18)">
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
    <rect x="${padding}" y="${divider1Y}" width="${cardWidth - (padding * 2)}" height="${dividerHeight}" fill="#1f2937" />
    
    <!-- Stats Row 2: Most Used Languages -->
    <g transform="translate(${padding}, ${row2Y})">
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
    <rect x="${padding}" y="${divider2Y}" width="${cardWidth - (padding * 2)}" height="${dividerHeight}" fill="#1f2937" />
    
    <!-- Heatmap Title -->
    <g transform="translate(${heatmapXOffset}, ${heatmapTitleY})">
      <text x="0" y="20" class="text medium" font-size="16" fill="${primaryColor}">Heatmap (Last 52 Weeks)</text>
    </g>

    <!-- Heatmap -->
    <g transform="translate(${heatmapXOffset}, ${heatmapY})">
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

  
  const firstDate = weeks[0]?.days[0]?.date?.replace(/-/g, '.') || '';
  const lastWeek = weeks[weeks.length - 1];
  const lastDate = lastWeek?.days[lastWeek.days.length - 1]?.date?.replace(/-/g, '.') || '';

  svg += `
    </g>
    <!-- Heatmap Dates -->
    <g transform="translate(${heatmapXOffset}, ${heatmapY + heatmapHeight + 30})">
      <text x="0" y="0" class="text" font-size="12" fill="${primaryColor}">${firstDate}</text>
      <text x="${heatmapWidth}" y="0" text-anchor="end" class="text" font-size="12" fill="${primaryColor}">${lastDate}</text>
    </g>
  </svg>`;
  
  return svg;
}

