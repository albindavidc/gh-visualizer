import fetch from "node-fetch";
import fs from "fs";

async function getBase64Css() {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Inter:wght@400;500;700&family=Mali:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap`;
  const cssRes = await fetch(cssUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36" // Forces WOFF2
    }
  });
  let cssText = await cssRes.text();

  const urlRegex = /url\((https:\/\/[^)]+)\)/g;
  let match;
  const fetchPromises = [];
  const urls = [];

  while ((match = urlRegex.exec(cssText)) !== null) {
    const fontUrl = match[1];
    urls.push(fontUrl);
    fetchPromises.push(
      fetch(fontUrl)
        .then(res => res.arrayBuffer())
        .then(buffer => Buffer.from(buffer).toString("base64"))
    );
  }

  const base64Fonts = await Promise.all(fetchPromises);
  urls.forEach((url, i) => {
    cssText = cssText.replace(url, `data:font/woff2;charset=utf-8;base64,${base64Fonts[i]}`);
  });

  return cssText;
}

getBase64Css().then(css => {
  const fileContent = `export const FONTS_CSS = \`${css}\`;\n`;
  fs.writeFileSync('src/utils/fonts.ts', fileContent);
  console.log("Wrote fonts.ts");
}).catch(console.error);
