import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

const oldRepoQuery = `repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              primaryLanguage {
                name
                color
              }
            }
          }`;

const newRepoQuery = `repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }`;

serverCode = serverCode.replace(new RegExp(oldRepoQuery.replace(/[.*+?^$\{\}\(\)|\[\]\\]/g, '\\$&'), 'g'), newRepoQuery);

const oldProcess = `      const languages: Record<string, { count: number, color: string }> = {};
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
        }))`;

const newProcess = `      const languages: Record<string, { size: number, color: string }> = {};
      const repos = data.data.user.repositories?.nodes || [];
      let totalSize = 0;
      repos.forEach((repo: any) => {
        if (repo.languages && repo.languages.edges) {
          repo.languages.edges.forEach((edge: any) => {
             const size = edge.size;
             const { name, color } = edge.node;
             if (!languages[name]) languages[name] = { size: 0, color };
             languages[name].size += size;
             totalSize += size;
          });
        }
      });
      
      const topLanguages = Object.entries(languages)
        .map(([name, info]) => ({
           name,
           color: info.color,
           percent: totalSize > 0 ? (info.size / totalSize) * 100 : 0
        }))`;

serverCode = serverCode.replace(new RegExp(oldProcess.replace(/[.*+?^$\{\}\(\)|\[\]\\]/g, '\\$&'), 'g'), newProcess);

fs.writeFileSync('server.ts', serverCode);
