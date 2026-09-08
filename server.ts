import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const NUM_WEEKS = 52;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/github/:username", async (req, res) => {
    const { username } = req.params;
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
