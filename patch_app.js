import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for font
appCode = appCode.replace(
  "const [theme, setTheme] = useState('github');",
  "const [theme, setTheme] = useState('github');\n  const [font, setFont] = useState('inter');"
);

// 2. Read font from URL params
appCode = appCode.replace(
  "const urlTheme = params.get('theme');",
  "const urlFont = params.get('font');\n    if (urlFont) setFont(urlFont);\n    const urlTheme = params.get('theme');"
);

// 3. Update URL logic in handleSubmit
appCode = appCode.replace(
  "window.history.pushState({}, '', `?username=${encodeURIComponent(username)}&mode=${viewMode}&theme=${theme}`);",
  "window.history.pushState({}, '', `?username=${encodeURIComponent(username)}&mode=${viewMode}&theme=${theme}&font=${font}`);"
);

// 4. Update Copy Embed markdown URL
appCode = appCode.replace(
  "const embedUrl = `${baseUrl}/api/graph?username=${encodeURIComponent(githubData.username)}&theme=${theme}`;",
  "const embedUrl = `${baseUrl}/api/graph?username=${encodeURIComponent(githubData.username)}&theme=${theme}&font=${font}`;"
);
appCode = appCode.replace(
  "const linkUrl = `${baseUrl}/?username=${encodeURIComponent(githubData.username)}&theme=${theme}`;",
  "const linkUrl = `${baseUrl}/?username=${encodeURIComponent(githubData.username)}&theme=${theme}&font=${font}`;"
);

// 5. Add Font Selector UI
const fontSelector = `
              <div>
                <label htmlFor="font" className="block text-sm font-medium text-gray-300">
                  Font Family
                </label>
                <select
                  id="font"
                  name="font"
                  className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-gray-800 text-white capitalize"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  <option value="inter">Inter (Default)</option>
                  <option value="mali">Mali</option>
                  <option value="roboto mono">Roboto Mono</option>
                  <option value="comic neue">Comic Neue</option>
                </select>
              </div>
`;

appCode = appCode.replace(
  "              <div>\n                <label htmlFor=\"strategy\"",
  fontSelector + "              <div>\n                <label htmlFor=\"strategy\""
);

// 6. Pass font to ContributionGraph
appCode = appCode.replace(
  "<ContributionGraph data={githubData} theme={theme} />",
  "<ContributionGraph data={githubData} theme={theme} font={font} />"
);

fs.writeFileSync('src/App.tsx', appCode);
