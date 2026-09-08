import fs from 'fs';

let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

// 1. Update signature
code = code.replace(
  "fontName: string = \"inter\") {",
  "fontName: string = \"inter\", hideBorder: boolean = false) {"
);

// 2. Hide background block if hideBorder is true
// Background block looks like:
/*
    <!-- Background -->
    <rect width="100%" height="100%" fill="${theme.bg}" rx="12" />
*/
// Actually in the svg code it might be:
// <rect width="100%" height="100%" fill="${theme.bg}" rx="12" />
// We can just conditionally render it.
code = code.replace(
  "    <!-- Background -->\n    <rect width=\"100%\" height=\"100%\" fill=\"${theme.bg}\" rx=\"12\" />",
  "    <!-- Background -->\n    ${!hideBorder ? `<rect width=\"100%\" height=\"100%\" fill=\"${theme.bg}\" rx=\"12\" stroke=\"#1f2937\" stroke-width=\"1\" />` : ''}"
);

// Wait, looking at the previous log, the original bg didn't have a stroke, it just had fill. If I want to match "disable the border of the entire box model" it usually means remove the card background. I will conditionally output it.

fs.writeFileSync('src/utils/svgGenerator.ts', code);
