import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [font, setFont] = useState('inter');",
  "const [font, setFont] = useState('inter');\n  const [hideBorder, setHideBorder] = useState(false);"
);

// 2. Parse URL params
code = code.replace(
  "if (urlFont) setFont(urlFont);",
  "if (urlFont) setFont(urlFont);\n    const urlHideBorder = params.get('hide_border') === 'true';\n    if (urlHideBorder) setHideBorder(true);"
);

// 3. Update window.history.pushState
code = code.replace(
  "&theme=${theme}&font=${font}`);",
  "&theme=${theme}&font=${font}&hide_border=${hideBorder}`);"
);

// 4. Update embedUrls
code = code.replace(
  "&theme=${theme}&font=${font}`;",
  "&theme=${theme}&font=${font}&hide_border=${hideBorder}`;"
);
code = code.replace(
  "&theme=${theme}&font=${font}`;",
  "&theme=${theme}&font=${font}&hide_border=${hideBorder}`;"
);

// 5. Add UI Toggle
const uiToggle = `              <div className="flex items-center justify-between mt-4">
                <label htmlFor="hideBorder" className="text-sm font-medium text-gray-300">
                  Hide Outer Border
                </label>
                <button
                  id="hideBorder"
                  type="button"
                  role="switch"
                  aria-checked={hideBorder}
                  onClick={() => setHideBorder(!hideBorder)}
                  className={\`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 \${hideBorder ? 'bg-emerald-500' : 'bg-gray-700'}\`}
                >
                  <span className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out \${hideBorder ? 'translate-x-5' : 'translate-x-0'}\`} />
                </button>
              </div>`;

// Insert after font selector
code = code.replace(
  /                  <option value="comic neue">Comic Neue<\/option>\n                <\/select>\n              <\/div>/,
  `                  <option value="comic neue">Comic Neue</option>
                </select>
              </div>
${uiToggle}`
);

// 6. Pass to ContributionGraph
code = code.replace(
  "<ContributionGraph data={githubData} theme={theme} font={font} />",
  "<ContributionGraph data={githubData} theme={theme} font={font} hideBorder={hideBorder} />"
);

fs.writeFileSync('src/App.tsx', code);
