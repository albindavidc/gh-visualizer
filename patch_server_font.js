import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

serverCode = serverCode.replace(
  "const themeName = (req.query.theme as string) || 'github';",
  "const themeName = (req.query.theme as string) || 'github';\n    const fontName = (req.query.font as string) || 'inter';"
);

serverCode = serverCode.replace(
  "const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguages);",
  "const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguages, fontName);"
);

fs.writeFileSync('server.ts', serverCode);
