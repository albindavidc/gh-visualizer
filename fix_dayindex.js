import fs from 'fs';
let code = fs.readFileSync('api/graph.ts', 'utf8');

code = code.replace(
  'week.days.forEach((day: any) => {',
  'week.days.forEach((day: any, dayIndex: number) => {'
);

fs.writeFileSync('api/graph.ts', code);
