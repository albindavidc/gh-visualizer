import { generateSvg } from './src/utils/svgGenerator.js';

const weeks = Array(52).fill({
  days: Array(7).fill({ date: '2023-01-01', level: 2, weekday: 0 })
});

try {
  generateSvg('albindavidc', 1000, weeks, 'github', undefined, 'inter', false, true);
  console.log("No languages SVG: OK");
} catch(e) {
  console.error("No languages SVG: CRASH", e);
}

try {
  generateSvg('albindavidc', 1000, weeks, 'github', [{name: 'TS', color: 'blue', percent: 100}], 'inter', false, false);
  console.log("With languages SVG: OK");
} catch(e) {
  console.error("With languages SVG: CRASH", e);
}
