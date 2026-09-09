import fs from "fs";
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');
code = code.replace("import { THEMES } from '../themes';", "import { THEMES } from '../themes';\nimport { FONTS_CSS } from './fonts';");
code = code.replace("const fontImport = \"@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Inter:wght@400;500;700&family=Mali:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap');\";", "const fontImport = FONTS_CSS;");
fs.writeFileSync('src/utils/svgGenerator.ts', code);
