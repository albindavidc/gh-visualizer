import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

const replacement = `      const languages: Record<string, { count: number, color: string }> = {};
      const repos = data.data.user.repositories?.nodes || [];
      let totalLangRepos = 0;
      repos.forEach((repo: any) => {
        if (repo.primaryLanguage) {
          const { name, color } = repo.primaryLanguage;
          if (!languages[name]) languages[name] = { count: 0, color };
          languages[name].count++;
          totalLangRepos++;
        }
      });
      
      const topLanguages = Object.entries(languages)
        .map(([name, info]) => ({
           name,
           color: info.color,
           percent: totalLangRepos > 0 ? (info.count / totalLangRepos) * 100 : 0
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 6);

      let weeks = calendar.weeks.map((weekData: any) => {`;

// Replace in both API endpoints (/api/github and /api/graph)
serverCode = serverCode.replace(/      const languages: Record<string, \{ count: number, color: string \}> = \{\};\n      const repos = data\.data\.user\.repositories\?\.nodes \|\| \[\];\n      repos\.forEach\(\(repo: any\) => \{\n        if \(repo\.primaryLanguage\) \{\n          const \{ name, color \} = repo\.primaryLanguage;\n          if \(!languages\[name\]\) languages\[name\] = \{ count: 0, color \};\n          languages\[name\]\.count\+\+;\n        \}\n      \}\);\n      let topLanguage = null;\n      let maxCount = 0;\n      for \(const \[name, info\] of Object\.entries\(languages\)\) \{\n        if \(info\.count > maxCount\) \{\n          maxCount = info\.count;\n          topLanguage = \{ name, color: info\.color \};\n        \}\n      \}\n\n      let weeks = calendar\.weeks\.map\(\(weekData: any\) => \{/g, replacement);

serverCode = serverCode.replace('topLanguage,', 'topLanguages,');
serverCode = serverCode.replace('topLanguage)', 'topLanguages)');

fs.writeFileSync('server.ts', serverCode);
