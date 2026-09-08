import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const hideBorder = req.query.hide_border === 'true';",
  "const hideBorder = req.query.hide_border === 'true';\n    const hideLanguages = req.query.hide_languages === 'true';"
);

code = code.replace(
  "hideBorder);",
  "hideBorder, hideLanguages);"
);

fs.writeFileSync('server.ts', code);
