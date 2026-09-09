const font_size = 16;
const dividerHeight = 1;

// Before any fixes:
const old_divider2Mb = 24;
const old_heatmapTitleHeight = 30;
let old_heatmapTitleY = old_divider2Mb + dividerHeight;
let old_baseline = old_heatmapTitleY + 20;
let old_heatmapGridTop = old_heatmapTitleY + old_heatmapTitleHeight - 8;
console.log("BEFORE FIX 1:");
console.log("Baseline gap from divider: ", old_baseline, "(", (old_baseline / font_size).toFixed(1), "x font size)");
console.log("Grid top gap from baseline:", old_heatmapGridTop - old_baseline, "(should be > 0)");

// Fix 1 (overlapping):
const f1_divider2Mb = 12;
const f1_heatmapTitleHeight = 26;
let f1_heatmapTitleY = f1_divider2Mb + dividerHeight;
let f1_baseline = f1_heatmapTitleY + 20;
let f1_heatmapGridTop = f1_heatmapTitleY + f1_heatmapTitleHeight - 8;
console.log("\nFIX 1 (OVERLAP):");
console.log("Baseline gap from divider: ", f1_baseline, "(", (f1_baseline / font_size).toFixed(1), "x font size)");
console.log("Grid top gap from baseline:", f1_heatmapGridTop - f1_baseline, "(should be > 0, NEGATIVE MEANS OVERLAP!)");

// Fix 2:
const f2_divider2Mb = 12; // or 10
const f2_heatmapTitleHeight = 30;
let f2_heatmapTitleY = f2_divider2Mb + dividerHeight;
let f2_baseline = f2_heatmapTitleY + 20;
let f2_heatmapGridTop = f2_heatmapTitleY + f2_heatmapTitleHeight - 8;
console.log("\nFIX 2:");
console.log("Baseline gap from divider: ", f2_baseline, "(", (f2_baseline / font_size).toFixed(1), "x font size)");
console.log("Grid top gap from baseline:", f2_heatmapGridTop - f2_baseline, "(should be > 0)");
