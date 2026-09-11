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

  const result = await page.evaluate(() => {
    // find the graphRef container
    const graphContainers = Array.from(document.querySelectorAll('div.bg-black'));
    const container = graphContainers[0];
    
    // LeetCodeGraph is the only child of it
    const leetCodeGraph = container.children[0];
    
    return {
      leetCodeGraphClass: leetCodeGraph.className,
      children: Array.from(leetCodeGraph.children).map(c => ({
        tagName: c.tagName,
        className: c.className,
        innerText: c.innerText
      }))
    };
  });
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
})();
