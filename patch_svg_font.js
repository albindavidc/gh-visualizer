import fs from 'fs';

let svgCode = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// Update signature
svgCode = svgCode.replace(
  'export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguages?: { name: string, color: string, percent: number }[]) {',
  'export function generateSvg(username: string, totalContributions: number, weeks: any[], themeName: string, topLanguages?: { name: string, color: string, percent: number }[], fontName: string = "inter") {'
);

const fontLogic = `
  const fontFamilies: Record<string, string> = {
    'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    'mali': '"Mali", cursive',
    'roboto mono': '"Roboto Mono", monospace',
    'comic neue': '"Comic Neue", cursive',
  };
  const fontFamily = fontFamilies[fontName.toLowerCase()] || fontFamilies.inter;
  
  // Create Google Font import based on font choice to keep SVG light and only load what's needed
  let fontImport = '';
  if (fontName.toLowerCase() === 'mali') fontImport = '@import url("https://fonts.googleapis.com/css2?family=Mali:wght@400;500;600;700&display=swap");';
  else if (fontName.toLowerCase() === 'roboto mono') fontImport = '@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap");';
  else if (fontName.toLowerCase() === 'comic neue') fontImport = '@import url("https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap");';
  else fontImport = '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");';
`;

svgCode = svgCode.replace(
  "  const THEMES: Record<string, { bg: string, levels: string[] }> = {",
  fontLogic + "\n  const THEMES: Record<string, { bg: string, levels: string[] }> = {"
);

// Add the font import inside the <style> and update .text class to use the chosen font.
svgCode = svgCode.replace(
  /      <style>\n        \.text \{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; \}/,
  `      <style>\n        \${fontImport}\n        .text { font-family: \${fontFamily}; }`
);

// Apply font to .mono class too, or keep it monospace? The user said "all the fonts". 
// But "mono" usually needs to stay mono. If they choose Mali, maybe everything becomes Mali. 
// Let's replace the .mono font with the selected font too, to satisfy "all the fonts".
svgCode = svgCode.replace(
  /        \.mono \{ font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; \}/,
  `        .mono { font-family: \${fontFamily}; }`
);


fs.writeFileSync('src/utils/svgGenerator.ts', svgCode);
