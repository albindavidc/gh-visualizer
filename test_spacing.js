const weeks = new Array(52).fill({days: new Array(7).fill({})});
const padding = 48;
const cellSize = 12;
const gap = 3;
const heatmapWidth = (weeks.length * cellSize) + ((weeks.length - 1) * gap);
const cardWidth = heatmapWidth + (padding * 2);
const barsAreaWidth = cardWidth - padding - 225 - padding;
console.log("Card Width:", cardWidth);
console.log("Bars Area Width:", barsAreaWidth);
