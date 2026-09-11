import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  await page.goto('http://127.0.0.1:3000/?platform=leetcode&username=albindavidc', { waitUntil: 'networkidle0' });
  
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => {
    return document.querySelectorAll('svg').length > 0;
  }, { timeout: 15000 });
  
  await page.screenshot({ path: 'border_on.png' });

  // Click hideBorder switch
  await page.evaluate(() => {
    document.getElementById('hideBorder').click();
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'border_off.png' });

  console.log("Screenshots taken");

  await browser.close();
})();
