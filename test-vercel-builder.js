import { build } from '@vercel/node';
import path from 'path';

async function run() {
  try {
    const result = await build({
      files: {},
      entrypoint: 'api/github.ts',
      workPath: process.cwd(),
      config: {},
      meta: {}
    });
    console.log("Build success");
  } catch (err) {
    console.error("Build failed:", err);
  }
}
run();
