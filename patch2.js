import fs from 'fs';
let content = fs.readFileSync('src/utils/leetcodeSvgGenerator.ts', 'utf8');

// 1. Shift the entire group to be perfectly centered with the new wider bars
content = content.replace(/\(cardWidth \/ 2 - 250\)/, "(cardWidth / 2 - 320)");

// 2. Increase widths from 340 to 420
content = content.replace(/width="340"/g, 'width="420"');
content = content.replace(/\* 340/g, '* 420');
content = content.replace(/<text x="340"/g, '<text x="420"');

// 3. Decrease font sizes for Labels (Easy, Medium, Hard)
content = content.replace(/font-size="20"/g, 'font-size="16"');
// 4. Decrease font sizes for Stats (solved count)
content = content.replace(/font-size="18"/g, 'font-size="16"');
// 5. Decrease font sizes for Stats (total count)
content = content.replace(/font-size="16" font-weight="500"/g, 'font-size="14" font-weight="500"');

fs.writeFileSync('src/utils/leetcodeSvgGenerator.ts', content);
console.log('Success');
