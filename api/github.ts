import type { VercelRequest, VercelResponse } from '@vercel/node';

const NUM_WEEKS = 52;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = req.query.username as string;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const token = process.env.GH_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "GitHub token not configured on Vercel" });
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
}
