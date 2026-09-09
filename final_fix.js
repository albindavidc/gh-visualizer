import fs from 'fs';
let code = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');

code = code.replace(
  'week.days.forEach((day: any) => {',
  'week.days.forEach((day: any, dayIndex: number) => {'
);

fs.writeFileSync('src/utils/svgGenerator.ts', code);

// Now re-inline it!
const svgLogic = fs.readFileSync('src/utils/svgGenerator.ts', 'utf8');
const streaksLogic = fs.readFileSync('src/utils/streaks.ts', 'utf8');
const themesLogic = fs.readFileSync('src/themes.ts', 'utf8');

let apiCode = fs.readFileSync('api/graph.ts', 'utf8');

// I will just use sed or string replace for the whole block
let newApiCode = `
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- INLINED LOGIC FOR VERCEL SERVERLESS ---
${themesLogic.replace('export const THEMES', 'const THEMES')}

${streaksLogic.replace('export function calculateStreaks', 'function calculateStreaks')}

${svgLogic.replace(/import .*\n/g, '').replace('export function generateSvg', 'function generateSvg')}
// -------------------------------------------

const NUM_WEEKS = 52;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = req.query.username as string;
  const themeName = (req.query.theme as string) || 'github';
  const fontName = (req.query.font as string) || 'inter';
  const hideBorder = req.query.hide_border === 'true';
  const hideLanguages = req.query.hide_languages === 'true';

  if (!username) {
    return res.status(400).send("Username is required");
  }

  const token = process.env.GH_TOKEN;
  if (!token) {
    return res.status(500).send("GitHub token not configured on Vercel");
  }

  const query = \`
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
        repositories(ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
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
        }
      }
    }
  \`;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      return res.status(response.status).send(\`GitHub API returned \${response.status}\`);
    }

    const data = await response.json();

    if (data.errors || !data.data?.user) {
      return res.status(404).send(\`User '\${username}' not found or API error\`);
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    
    const languages: Record<string, { size: number, color: string }> = {};
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
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 6);

    let weeks = calendar.weeks.map((weekData: any) => {
      return {
        days: weekData.contributionDays.map((dayData: any) => ({
          date: dayData.date,
          weekday: dayData.weekday,
          count: dayData.contributionCount,
          level: {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          }[dayData.contributionLevel] || 0,
        })),
      };
    });

    if (weeks.length > NUM_WEEKS) {
      weeks = weeks.slice(-NUM_WEEKS);
    }

    const svg = generateSvg(username, calendar.totalContributions, weeks, themeName, topLanguages, fontName, hideBorder, hideLanguages);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    res.status(200).send(svg);
  } catch (err: any) {
    res.status(500).send(err.message || "Internal Server Error");
  }
}
`;

fs.writeFileSync('api/graph.ts', newApiCode);
