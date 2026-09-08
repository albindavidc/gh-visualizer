import type { VercelRequest, VercelResponse } from '@vercel/node';

const NUM_WEEKS = 52;
const THEME = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    // SVG dimensions
    const cellSize = 12;
    const gap = 3;
    const padding = 16;
    
    const width = padding * 2 + (weeks.length * cellSize) + ((weeks.length - 1) * gap);
    const height = padding * 2 + (7 * cellSize) + (6 * gap);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0A0A0A" rx="8" />
  <g transform="translate(${padding}, ${padding})">`;

    weeks.forEach((week: any, weekIndex: number) => {
      week.contributionDays.forEach((day: any) => {
        const levelMap: any = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
        const level = levelMap[day.contributionLevel] || 0;
        const color = THEME[level];
        const x = weekIndex * (cellSize + gap);
        const y = day.weekday * (cellSize + gap); // 0 = Sunday, 6 = Saturday
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2" />`;
      });
    });

    svg += `</g></svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=7200'); // Cache for 2 hours
    res.status(200).send(svg);
  } catch (err: any) {
    res.status(500).send(err.message || "Internal Server Error");
  }
}
