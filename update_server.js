import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const fontName = (req.query.font as string) || 'inter';",
  "const fontName = (req.query.font as string) || 'inter';\n    const hideBorder = req.query.hide_border === 'true';"
);

code = code.replace(
  "const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguages, fontName);",
  "const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguages, fontName, hideBorder);"
);

fs.writeFileSync('server.ts', code);
