import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const imports = `import { get as gcGet, getAll as gcGetAll, parseConnectionString } from '@vercel/global-config';\n`;

content = content.replace('import express from "express";', imports + 'import express from "express";');

const cacheHelpers = `
async function getCachedGithubData(username: string) {
  const configStr = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
  if (configStr) {
    try {
      const cached = await gcGet(\`github_\${username}\`);
      if (cached) return cached as any;
    } catch (e) {
      console.warn("Failed to get from global config", e);
    }
  }
  return null;
}

async function setCachedGithubData(username: string, data: any) {
  const configStr = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
  const token = process.env.VERCEL_API_TOKEN;
  if (configStr && token) {
    try {
      const conn = parseConnectionString(configStr);
      if (!conn) return;
      await fetch(\`https://api.vercel.com/v1/edge-config/\${conn.id}/items\`, {
        method: 'PATCH',
        headers: {
          Authorization: \`Bearer \${token}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: \`github_\${username}\`,
              value: { ...data, fetchedAt: new Date().toISOString() }
            }
          ]
        })
      });
    } catch (e) {
      console.warn("Failed to set global config", e);
    }
  }
}

async function fetchAndCacheGithubData(username: string) {
  const data = await getGithubData(username);
  await setCachedGithubData(username, data);
  return data;
}
`;

content = content.replace('app.get("/api/github", async (req, res) => {', cacheHelpers + '\napp.get("/api/github", async (req, res) => {');

// Update /api/github
content = content.replace(
  'const { allTimeTotal, weeks, topLanguages, createdAt } = await getGithubData(username);',
  'let data = await getCachedGithubData(username);\n    if (!data) data = await fetchAndCacheGithubData(username);\n    const { allTimeTotal, weeks, topLanguages, createdAt } = data;'
);

// Update /api/graph
content = content.replace(
  'const { allTimeTotal, weeks, topLanguages, createdAt } = await getGithubData(username);',
  'let data = await getCachedGithubData(username);\n    if (!data) data = await fetchAndCacheGithubData(username);\n    const { allTimeTotal, weeks, topLanguages, createdAt } = data;'
);

// Add cron route
const cronRoute = `
app.get("/api/cron/refresh-github", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!process.env.CRON_SECRET || authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const configStr = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
    if (!configStr || !process.env.VERCEL_API_TOKEN) {
      return res.status(500).json({ error: "Global Config or Vercel API token not configured" });
    }
    const allItems = await gcGetAll();
    const usernames = Object.keys(allItems)
      .filter(key => key.startsWith("github_"))
      .map(key => key.replace("github_", ""));
    
    const results = [];
    for (const username of usernames) {
      try {
        await fetchAndCacheGithubData(username);
        results.push({ username, status: 'success' });
      } catch (err: any) {
        results.push({ username, status: 'error', error: err.message });
      }
    }
    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to run cron job" });
  }
});
`;

content = content.replace('app.get("/api/leetcode-data",', cronRoute + '\napp.get("/api/leetcode-data",');

fs.writeFileSync('server.ts', content);
console.log('Success');
