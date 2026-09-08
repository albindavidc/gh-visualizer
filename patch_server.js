import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

const newQuery = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  weekday
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
          repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }`;

// Replace queries
serverCode = serverCode.replace(/query\(\$username: String!\) \{[\s\S]*?\}\n      \}/g, newQuery.trim());

// Add language processing logic to /api/github route
const ghDataProcess = `      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      
      const languages: Record<string, { count: number, color: string }> = {};
      const repos = data.data.user.repositories?.nodes || [];
      repos.forEach((repo: any) => {
        if (repo.primaryLanguage) {
          const { name, color } = repo.primaryLanguage;
          if (!languages[name]) languages[name] = { count: 0, color };
          languages[name].count++;
        }
      });
      let topLanguage = null;
      let maxCount = 0;
      for (const [name, info] of Object.entries(languages)) {
        if (info.count > maxCount) {
          maxCount = info.count;
          topLanguage = { name, color: info.color };
        }
      }

      let weeks = calendar.weeks.map((weekData: any) => {`;

serverCode = serverCode.replace(`      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      let weeks = calendar.weeks.map((weekData: any) => {`, ghDataProcess);
serverCode = serverCode.replace(`      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      let weeks = calendar.weeks.map((weekData: any) => {`, ghDataProcess);

// Ensure /api/github response includes topLanguage
serverCode = serverCode.replace(`      res.json({
        username,
        total_contributions: calendar.totalContributions,
        weeks,
      });`, `      res.json({
        username,
        total_contributions: calendar.totalContributions,
        weeks,
        topLanguage,
      });`);

serverCode = serverCode.replace(`const svg = generateSvg(username, calendar.totalContributions, weeks, themeName);`, `const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguage);`);

fs.writeFileSync('server.ts', serverCode);
