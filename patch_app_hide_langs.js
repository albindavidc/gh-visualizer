import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [hideBorder, setHideBorder] = useState(false);",
  "const [hideBorder, setHideBorder] = useState(false);\n  const [hideLanguages, setHideLanguages] = useState(false);"
);

// 2. Parse URL params
code = code.replace(
  "const urlHideBorder = params.get('hide_border') === 'true';\n    if (urlHideBorder) setHideBorder(true);",
  "const urlHideBorder = params.get('hide_border') === 'true';\n    if (urlHideBorder) setHideBorder(true);\n    const urlHideLanguages = params.get('hide_languages') === 'true';\n    if (urlHideLanguages) setHideLanguages(true);"
);

// 3. Update window.history.pushState
code = code.replace(
  "&hide_border=${hideBorder}`);",
  "&hide_border=${hideBorder}&hide_languages=${hideLanguages}`);"
);

// 4. Update embedUrls
code = code.replace(
  "&hide_border=${hideBorder}`;",
  "&hide_border=${hideBorder}&hide_languages=${hideLanguages}`;"
);
code = code.replace(
  "&hide_border=${hideBorder}`;",
  "&hide_border=${hideBorder}&hide_languages=${hideLanguages}`;"
);

// 5. Add UI Toggle
const uiToggle = `              <div className="flex items-center justify-between mt-4">
                <label htmlFor="hideLanguages" className="text-sm font-medium text-gray-300">
                  Hide Languages
                </label>
                <button
                  id="hideLanguages"
                  type="button"
                  role="switch"
                  aria-checked={hideLanguages}
                  onClick={() => setHideLanguages(!hideLanguages)}
                  className={\`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 \${hideLanguages ? 'bg-emerald-500' : 'bg-gray-700'}\`}
                >
                  <span className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out \${hideLanguages ? 'translate-x-5' : 'translate-x-0'}\`} />
                </button>
              </div>`;

code = code.replace(
  /                  <span className=\{`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out \$\{hideBorder \? 'translate-x-5' : 'translate-x-0'\}`\} \/>\n                <\/button>\n              <\/div>/,
  `                  <span className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out \${hideBorder ? 'translate-x-5' : 'translate-x-0'}\`} />
                </button>
              </div>
${uiToggle}`
);

// 6. Pass to ContributionGraph
code = code.replace(
  "hideBorder={hideBorder} />",
  "hideBorder={hideBorder} hideLanguages={hideLanguages} />"
);

fs.writeFileSync('src/App.tsx', code);
