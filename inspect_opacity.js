import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  await page.goto('http://127.0.0.1:3000/?platform=leetcode&username=albindavidc', { waitUntil: 'networkidle0' });
  
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('div')).some(d => d.textContent === 'LeetCode Stats');
  }, { timeout: 15000 });

  const getStyle = async () => {
    return page.evaluate(() => {
      const el = document.querySelector('div#root > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1)');
      const style = window.getComputedStyle(el);
      return {
        opacity: style.opacity,
        color: style.color,
        backgroundColor: style.backgroundColor,
        filter: style.filter
      };
    });
  };

  const result1 = await getStyle();

  await page.evaluate(() => document.getElementById('hideBorder').click());
  await new Promise(r => setTimeout(r, 500));

  const result2 = await getStyle();

  console.log({ before: result1, after: result2 });

  await browser.close();
})();
