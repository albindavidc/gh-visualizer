import { generateSvg } from '../src/utils/svgGenerator.js';

async function runSmokeTest() {
  console.log("Running SVG smoke test...");
  const weeks = Array(52).fill({
    days: Array(7).fill({ date: '2023-01-01', level: 2, weekday: 0 })
  });
  try {
    const svg = generateSvg('smoke-test-user', 1000, weeks, 'github', undefined, 'inter', false, false);
    if (!svg || !svg.startsWith('<svg')) throw new Error("Invalid output format");
    console.log("✅ Smoke test passed! SVG generated successfully.");
  } catch (err) {
    console.error("❌ Smoke test failed!");
    console.error(err);
    process.exit(1);
  }
}
runSmokeTest();
