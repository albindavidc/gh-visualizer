import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const NUM_WEEKS = 52;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/github", async (req, res) => {
    const username = req.query.username as string;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "GitHub token not configured" });
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors.map((e: any) => e.message).join(", "));
      }

      if (!data.data?.user) {
        return res.status(404).json({ error: `User '${username}' not found` });
      }

      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      let weeks = calendar.weeks.map((weekData: any) => {
        return {
          days: weekData.contributionDays.map((dayData: any) => ({
            date: dayData.date,
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

      res.json({
        username,
        total_contributions: calendar.totalContributions,
        weeks,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Failed to fetch data from GitHub" });
    }
  });

  app.get("/api/graph", async (req, res) => {
    const username = req.query.username as string;
    if (!username) {
      return res.status(400).send("Username is required");
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).send("GitHub token not configured on Vercel");
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  weekday
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
      });

      if (!response.ok) {
        return res.status(response.status).send(`GitHub API returned ${response.status}`);
      }

      const data = await response.json();
      if (data.errors || !data.data?.user) {
        return res.status(404).send(`User '${username}' not found or API error`);
      }

      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      let weeks = calendar.weeks;
      if (weeks.length > NUM_WEEKS) {
        weeks = weeks.slice(-NUM_WEEKS);
      }

      const cellSize = 12;
      const gap = 3;
      const padding = 16;
      
      const width = padding * 2 + (weeks.length * cellSize) + ((weeks.length - 1) * gap);
      const height = padding * 2 + (7 * cellSize) + (6 * gap);
      const THEME = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#0A0A0A" rx="8" />
    <g transform="translate(${padding}, ${padding})">`;

      weeks.forEach((week: any, weekIndex: number) => {
        week.contributionDays.forEach((day: any) => {
          const levelMap: any = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
          const level = levelMap[day.contributionLevel] || 0;
          const color = THEME[level];
          const x = weekIndex * (cellSize + gap);
          const y = day.weekday * (cellSize + gap);
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2" />`;
        });
      });

      svg += `</g></svg>`;

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=7200');
      res.status(200).send(svg);
    } catch (err: any) {
      res.status(500).send(err.message || "Internal Server Error");
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
