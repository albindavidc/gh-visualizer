import fs from "fs";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
    const match = envFile.match(/^GH_TOKEN=(.*)$/m);
    if (match && match[1]) {
      process.env.GH_TOKEN = match[1].trim();
    }
  } catch(e) {}
}

import express from "express";
import app from "./src/app.js";

const PORT = Number(process.env.PORT) || 3000;

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

  if (!process.env.VERCEL && process.env.SERVER_MODE !== "vercel") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default app;
