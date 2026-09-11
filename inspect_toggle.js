import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  await page.goto('http://127.0.0.1:3000/?platform=leetcode&username=albindavidc', { waitUntil: 'networkidle0' });
  
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => {
    return document.querySelectorAll('svg').length > 0;
  }, { timeout: 15000 });

  const result1 = await page.evaluate(() => {
    const el = document.querySelector('div.bg-black > div');
    return window.getComputedStyle(el).backgroundColor;
  });

  await page.evaluate(() => document.getElementById('hideBorder').click());
  await new Promise(r => setTimeout(r, 500));

  const result2 = await page.evaluate(() => {
    const el = document.querySelector('div.bg-black > div');
    return window.getComputedStyle(el).backgroundColor;
  });

  console.log({ before: result1, after: result2 });

  await browser.close();
})();
