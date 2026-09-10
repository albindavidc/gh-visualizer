import { THEMES } from '../themes.js';
import { FONTS_CSS } from './fonts.js';

export function generateLeetcodeSvg(
  username: string, 
  data: any,
  themeName: string, 
  fontName: string = "inter", 
  hideBorder: boolean = false
) {
  const theme = THEMES[themeName] || THEMES.github;
  const primaryColor = theme.levels[4] || '#39d353';
  const titleColor = theme.text?.[0] || '#fff';
  const subtitleColor = theme.text?.[1] || '#8b949e';
  const borderColor = theme.levels[1] || '#2d333b';

  // Stats
  const totalSolved = (data.problem?.easy?.solved || 0) + (data.problem?.medium?.solved || 0) + (data.problem?.hard?.solved || 0);
  const totalQuestions = (data.problem?.easy?.total || 0) + (data.problem?.medium?.total || 0) + (data.problem?.hard?.total || 0);
  const percentSolved = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  const circleCircumference = 2 * Math.PI * 70;
  const strokeDashoffset = circleCircumference - (percentSolved / 100) * circleCircumference;

  const easySolved = data.problem?.easy?.solved || 0;
  const easyTotal = data.problem?.easy?.total || 1;
  const mediumSolved = data.problem?.medium?.solved || 0;
  const mediumTotal = data.problem?.medium?.total || 1;
  const hardSolved = data.problem?.hard?.solved || 0;
  const hardTotal = data.problem?.hard?.total || 1;

  const easyColor = theme.levels[2] || '#00b8a3';
  const mediumColor = theme.levels[3] || '#ffc01e';
  const hardColor = theme.levels[4] || '#ef4743';

  // Weeks parsing
  let weeks: any[] = [];
  if (data.weeks) {
    weeks = data.weeks;
  } else if (data.calendar?.submissionCalendar) {
     // fallback parsing if needed, but data.weeks should be populated by the frontend API endpoint
  }
  
  if (!weeks || !Array.isArray(weeks)) {
      weeks = [];
  }

  // Dimensions
  const padding = 48;
  const cardWidth = 850;
  
  const cellSize = 12;
  const gap = 3;
  const heatmapWidth = (weeks.length * cellSize) + ((weeks.length - 1) * gap);
  const heatmapHeight = (7 * cellSize) + (6 * gap);

  const cardHeight = 650; // Approximating HTML layout height

  const fontFamilies: Record<string, string> = {
    'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    'roboto': '"Roboto", sans-serif',
    'noto sans coptic': '"Noto Sans Coptic", sans-serif',
    'milonga': '"Milonga", cursive',
    'mali': '"Mali", cursive',
    'patrick_hand': '"Patrick Hand", cursive',
    'ruthie': '"Ruthie", cursive',
    'source_code_pro': '"Source Code Pro", monospace',
    'baloo_2': '"Baloo 2", cursive',
  };
  const fontFamily = fontFamilies[fontName.toLowerCase()] || fontFamilies.inter;
  const fontImport = FONTS_CSS;

  let heatmapSvg = '';
  weeks.forEach((week, weekIndex) => {
    const x = weekIndex * (cellSize + gap);
    week.days.forEach((day: any, dayIndex: number) => {
      const y = dayIndex * (cellSize + gap);
      const fill = day.count > 0 ? (theme.levels[day.level] || primaryColor) : (theme.levels[0] || '#161b22');
      heatmapSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" ry="2" fill="${fill}" />`;
    });
  });

  const startDate = weeks[0]?.days[0]?.date?.replace(/-/g, '.') || '';
  const endDate = weeks[weeks.length - 1]?.days[weeks[weeks.length - 1]?.days.length - 1]?.date?.replace(/-/g, '.') || '';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <style>
      ${fontImport}
      * { font-family: ${fontFamily}; }
      @keyframes fade_in { from { opacity: 0; } to { opacity: 1; } }
      .fade-in { opacity: 0; animation: fade_in 0.3s ease forwards; }
      .delay-1 { animation-delay: 0.1s; }
      .delay-2 { animation-delay: 0.2s; }
      .delay-3 { animation-delay: 0.3s; }
      .delay-4 { animation-delay: 0.4s; }
      .delay-5 { animation-delay: 0.5s; }
      
      @keyframes draw_ring {
        0% { stroke-dasharray: 0 ${circleCircumference}; }
        100% { stroke-dasharray: ${circleCircumference - strokeDashoffset} ${circleCircumference}; }
      }
      .ring-anim {
        animation: draw_ring 1.2s ease 0.3s 1 forwards;
        stroke-dasharray: 0 ${circleCircumference};
      }
    </style>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" rx="12" ry="12" fill="${theme.bg}" 
        stroke="${!hideBorder ? borderColor : 'none'}" stroke-width="1" />

  <!-- Header -->
  <g transform="translate(${padding}, ${padding})" class="fade-in">
    <!-- LeetCode Icon -->
    <path d="M22,14.355c0-0.742-0.564-1.346-1.26-1.346H10.676c-0.696,0-1.26,0.604-1.26,1.346s0.563,1.346,1.26,1.346H20.74C21.436,15.702,22,15.098,22,14.355z" fill="${titleColor}" />
    <path d="M3.482,18.187l4.313,4.361C8.768,23.527,10.113,24,11.598,24c1.485,0,2.83-0.512,3.805-1.494l2.588-2.637c0.51-0.514,0.492-1.365-0.039-1.9c-0.531-0.535-1.375-0.553-1.884-0.039l-2.676,2.607c-0.462,0.467-1.102,0.662-1.809,0.662s-1.346-0.195-1.81-0.662l-4.298-4.363c-0.463-0.467-0.696-1.15-0.696-1.863c0-0.713,0.233-1.357,0.696-1.824l4.285-4.38c0.463-0.467,1.116-0.645,1.822-0.645s1.346,0.195,1.809,0.662l2.676,2.606c0.51,0.515,1.354,0.497,1.885-0.038c0.531-0.536,0.549-1.387,0.039-1.901l-2.588-2.636c-0.649-0.646-1.471-1.116-2.392-1.33l-0.034-0.007l2.447-2.503c0.512-0.514,0.494-1.366-0.037-1.901c-0.531-0.535-1.376-0.552-1.887-0.038L3.482,10.476C2.509,11.458,2,12.813,2,14.311C2,15.809,2.509,17.207,3.482,18.187z" fill="${titleColor}" />
    
    <text x="36" y="18" fill="${titleColor}" font-size="24" font-weight="600" letter-spacing="1">${username.toLowerCase()}</text>
    
    <text x="${cardWidth - padding * 2}" y="16" fill="${primaryColor}" font-size="14" text-anchor="end">LeetCode Stats</text>
  </g>

  <!-- Top Stats Section -->
  <g transform="translate(${cardWidth / 2 - 250}, 120)" class="fade-in delay-1">
    <!-- Ring -->
    <g transform="translate(0, 0)">
      <circle cx="80" cy="80" r="70" fill="none" stroke="${borderColor}" stroke-width="8" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="${primaryColor}" stroke-width="8" stroke-linecap="round" class="ring-anim" transform="rotate(-90 80 80)" />
      <text x="80" y="95" fill="${titleColor}" font-size="48" font-weight="bold" text-anchor="middle" letter-spacing="-1">${totalSolved}</text>
    </g>

    <!-- Difficulty Bars -->
    <g transform="translate(240, 20)">
      <!-- Easy -->
      <g transform="translate(0, 0)">
        <text x="0" y="0" fill="${easyColor}" font-size="20" font-weight="bold">Easy</text>
        <text x="260" y="0" fill="${subtitleColor}" font-size="18" font-weight="bold" text-anchor="end">${easySolved} <tspan fill="${easyColor}" font-size="16" font-weight="500" opacity="0.6">/ ${data.problem?.easy?.total || 0}</tspan></text>
        <rect x="0" y="12" width="260" height="8" rx="4" ry="4" fill="${borderColor}" />
        <rect x="0" y="12" width="${Math.max((easySolved / easyTotal) * 260, 0)}" height="8" rx="4" ry="4" fill="${easyColor}" />
      </g>
      
      <!-- Medium -->
      <g transform="translate(0, 48)">
        <text x="0" y="0" fill="${mediumColor}" font-size="20" font-weight="bold">Medium</text>
        <text x="260" y="0" fill="${subtitleColor}" font-size="18" font-weight="bold" text-anchor="end">${mediumSolved} <tspan fill="${mediumColor}" font-size="16" font-weight="500" opacity="0.6">/ ${data.problem?.medium?.total || 0}</tspan></text>
        <rect x="0" y="12" width="260" height="8" rx="4" ry="4" fill="${borderColor}" />
        <rect x="0" y="12" width="${Math.max((mediumSolved / mediumTotal) * 260, 0)}" height="8" rx="4" ry="4" fill="${mediumColor}" />
      </g>

      <!-- Hard -->
      <g transform="translate(0, 96)">
        <text x="0" y="0" fill="${hardColor}" font-size="20" font-weight="bold">Hard</text>
        <text x="260" y="0" fill="${subtitleColor}" font-size="18" font-weight="bold" text-anchor="end">${hardSolved} <tspan fill="${hardColor}" font-size="16" font-weight="500" opacity="0.6">/ ${data.problem?.hard?.total || 0}</tspan></text>
        <rect x="0" y="12" width="260" height="8" rx="4" ry="4" fill="${borderColor}" />
        <rect x="0" y="12" width="${Math.max((hardSolved / hardTotal) * 260, 0)}" height="8" rx="4" ry="4" fill="${hardColor}" />
      </g>
    </g>
  </g>

  <!-- Divider -->
  <rect x="25" y="340" width="800" height="1" fill="${borderColor}" class="fade-in delay-2" />

  <!-- Heatmap -->
  <g transform="translate(${cardWidth / 2 - heatmapWidth / 2}, 380)" class="fade-in delay-3">
    <text x="0" y="-16" fill="${primaryColor}" font-size="18">Heatmap (Last 52 Weeks)</text>
    
    <rect x="-16" y="-4" width="${heatmapWidth + 32}" height="${heatmapHeight + 32}" rx="12" ry="12" fill="${theme.bg}" stroke="${borderColor}" stroke-width="1" />
    
    <g transform="translate(0, 12)">
      ${heatmapSvg}
    </g>

    <text x="0" y="${heatmapHeight + 48}" fill="${primaryColor}" font-size="14">${startDate}</text>
    <text x="${heatmapWidth}" y="${heatmapHeight + 48}" fill="${primaryColor}" font-size="14" text-anchor="end">${endDate}</text>
  </g>
</svg>
  `;

  return svg;
}
