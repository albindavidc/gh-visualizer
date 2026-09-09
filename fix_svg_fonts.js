import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

const brokenStyle = `    </defs>
    
      \${fontImport}
      .text, .title, .label, .date { font-family: \${fontFamily}; }
      .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
      .title { font-size: 32px; fill: #ffffff; }
      .label { font-size: 14px; fill: \${primaryColor}; }
      .date { font-size: 12px; fill: #9ca3af; }
    </style>`;

const fixedStyle = `    </defs>
    <style>
      \${fontImport}
      .text, .title, .label, .date { font-family: \${fontFamily}; }
      .mono { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
      .title { font-size: 32px; fill: #ffffff; }
      .label { font-size: 14px; fill: \${primaryColor}; }
      .date { font-size: 12px; fill: #9ca3af; }
    </style>`;

code = code.replace(brokenStyle, fixedStyle);
fs.writeFileSync('src/utils/svgGenerator.ts', code);
