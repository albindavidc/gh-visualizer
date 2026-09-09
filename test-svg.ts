import { generateSvg } from './src/utils/svgGenerator.js';
import fs from 'fs';

const weeks = Array(52).fill({
  days: Array(7).fill({ date: '2023-01-01', level: 2, weekday: 0 })
});

const svg = generateSvg('albindavidc', 1000, weeks, 'github', undefined, 'inter', false, true);
fs.writeFileSync('test.svg', svg);
