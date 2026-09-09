const heatmapTitleY = 100;
const textBaselineY = heatmapTitleY + 20;

const testHeights = [30, 36, 40, 44, 48];
testHeights.forEach(h => {
    const heatmapY = heatmapTitleY + h;
    const backgroundTopY = heatmapY - 8;
    const gapFromBaseline = backgroundTopY - textBaselineY;
    console.log(`Height: ${h} -> Gap from baseline: ${gapFromBaseline}px`);
});
