import { generateSvg } from './src/utils/svgGenerator.js';

// We can just extract the math here manually to print it clearly
const padding = 24;
const headerHeight = 40;
const headerMb = 30;
const row1Height = 120;
const row1Mb = 40;
const dividerHeight = 1;
const dividerMb = 32;
const row2Height = 100;
const row2Mb = 40;
const divider2Mb = 12;

const headerY = padding;
const row1Y = headerY + headerHeight + headerMb;
const divider1Y = row1Y + row1Height + row1Mb;
const row2Y = divider1Y + dividerHeight + dividerMb;
// hideLanguages = false for default view
const divider2Y = row2Y + row2Height + row2Mb;
const heatmapTitleHeight = 26;
const heatmapTitleY = divider2Y + dividerHeight + divider2Mb;
const heatmapY = heatmapTitleY + heatmapTitleHeight;

console.log("=== Y COORDINATES ===");
console.log("Divider Line Y:         ", divider2Y);
console.log("Heatmap Title Group Y:  ", heatmapTitleY);
console.log("Heatmap Title Text Base:", heatmapTitleY + 20); // because <text y="20">
console.log("Heatmap Grid Top Y:     ", heatmapY);
console.log("Gap between Divider & Title Group:", heatmapTitleY - divider2Y);
console.log("Gap between Title Base & Grid Top:", heatmapY - (heatmapTitleY + 20));
