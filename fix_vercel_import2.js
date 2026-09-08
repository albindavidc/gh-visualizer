import fs from 'fs';

// Let's do the exact same strict inlining for api/github.ts to prevent any similar 500 crashes
const streaksLogic = fs.readFileSync('src/utils/streaks.ts', 'utf8');
const themesLogic = fs.readFileSync('src/themes.ts', 'utf8');

let code = fs.readFileSync('api/github.ts', 'utf8');

// The github api doesn't currently use svg generator, so it's safe. Just in case, let's verify it compiles.
