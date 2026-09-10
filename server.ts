import express from "express";
import path from "path";

import { generateSvg } from "./src/utils/svgGenerator.js";

const NUM_WEEKS = 52;

const app = express();
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
const PORT = Number(process.env.PORT) || 3000;

const getGithubData = async (username: string) => {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error("GitHub token not configured");

  const query = `
    query($username: String!) {
      user(login: $username) {
        createdAt
        contributionsCollection {
          contributionYears
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
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  const data = await response.json();
  if (data.errors || !data.data?.user) throw new Error(data.errors?.[0]?.message || `User '${username}' not found`);

  const calendar = data.data.user.contributionsCollection.contributionCalendar;
  const years = data.data.user.contributionsCollection.contributionYears || [];
  let allTimeTotal = calendar.totalContributions;

  if (years.length > 0) {
    const yearQueries = years.map((year: number) => `
      year${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
        contributionCalendar { totalContributions }
      }
    `).join('\n');

    const query2 = `
      query($username: String!) {
        user(login: $username) {
          ${yearQueries}
        }
      }
    `;

    try {
      const response2 = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: query2, variables: { username } }),
      });
      if (response2.ok) {
        const data2 = await response2.json();
        if (data2.data?.user) {
          allTimeTotal = 0;
          for (const year of years) {
            allTimeTotal += data2.data.user[`year${year}`]?.contributionCalendar?.totalContributions || 0;
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch all-time contributions", e);
    }
  }

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

  let weeks = calendar.weeks.map((weekData: any) => ({
    days: weekData.contributionDays.map((dayData: any) => ({
      date: dayData.date,
      weekday: dayData.weekday,
      count: dayData.contributionCount,
      level: ({
        NONE: 0,
        FIRST_QUARTILE: 1,
        SECOND_QUARTILE: 2,
        THIRD_QUARTILE: 3,
        FOURTH_QUARTILE: 4,
      } as Record<string, number>)[dayData.contributionLevel] || 0,
    })),
  }));

  if (weeks.length > NUM_WEEKS) {
    weeks = weeks.slice(-NUM_WEEKS);
  }

  const createdAt = data.data.user.createdAt;

  return { username, allTimeTotal, weeks, topLanguages, createdAt };
};

app.get("/api/github", async (req, res) => {
  try {
    const username = req.query.username as string;
    if (!username) return res.status(400).json({ error: "Username is required" });
    const { allTimeTotal, weeks, topLanguages, createdAt } = await getGithubData(username);
    res.json({ username, total_contributions: allTimeTotal, weeks, topLanguages, createdAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to fetch data from GitHub" });
  }
});

app.get("/api/graph", async (req, res) => {
  try {
    const username = req.query.username as string;
    if (!username) return res.status(400).send("Username is required");
    
    const themeName = (req.query.theme as string) || 'github';
    const fontName = (req.query.font as string) || 'inter';
    const hideBorder = req.query.hide_border === 'true';
    const hideLanguages = req.query.hide_languages === 'true';

    const { allTimeTotal, weeks, topLanguages, createdAt } = await getGithubData(username);
    
    const svg = generateSvg(username, allTimeTotal, weeks, themeName, topLanguages, fontName, hideBorder, hideLanguages, createdAt);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    res.status(200).send(svg);
  } catch (err: any) {
    res.status(500).send(err.message || "Internal Server Error");
  }
});

import Query from "./src/leetcode/query.js";
import { generateLeetcodeSvg } from "./src/utils/leetcodeSvgGenerator.js";

app.get("/api/leetcode-data", async (req, res) => {
  try {
    const username = req.query.username as string;
    if (!username) return res.status(400).send("Username is required");
    
    const data = await Query.us(username);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch data from LeetCode" });
  }
});

app.get("/api/leetcode", async (req, res) => {
  try {
    const username = req.query.username as string;
    if (!username) return res.status(400).send("Username is required");
    const themeName = (req.query.theme as string) || 'github';
    const fontName = (req.query.font as string) || 'inter';
    const site = req.query.site as string; // 'us' or 'cn'
    const hideBorder = req.query.hide_border === 'true';

    // Fetch data using the same query as the frontend
    const data = site === 'cn' ? await Query.cn(username) : await Query.us(username);
    
    // Generate the SVG using the imported function
    const svg = generateLeetcodeSvg(username, data, themeName, fontName, hideBorder);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    res.status(200).send(svg);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.message || "Internal Server Error");
  }
});

if (process.env.NODE_ENV !== "production") {
  const viteMod = "vite";
  import(viteMod).then(async ({ createServer: createViteServer }) => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }).catch(err => console.error("Vite failed to load:", err));
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  // On Cloud Run / standalone node, we want to listen. On Vercel, it might export.
  if (!process.env.VERCEL && process.env.SERVER_MODE !== "vercel") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default app;
