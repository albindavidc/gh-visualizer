import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  await page.goto('http://127.0.0.1:3000/?platform=github&username=albindavidc', { waitUntil: 'networkidle0' });
  
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    return divs.some(d => d.textContent === 'Heatmap (Last 52 Weeks)' && d.children.length === 0) ||
           divs.some(d => d.innerText && d.innerText.includes('Heatmap (Last 52 Weeks)') && d.className && d.className.includes('text-lg'));
  }, { timeout: 15000 });

  const result = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    let heatmapText = divs.find(d => d.textContent === 'Heatmap (Last 52 Weeks)' && d.children.length === 0);
    if (!heatmapText) {
      heatmapText = divs.find(d => d.innerText && d.innerText.includes('Heatmap (Last 52 Weeks)') && d.className && d.className.includes('text-lg'));
    }
    
    const contentRef = heatmapText.parentElement;
    const containerRef = contentRef.parentElement;
    
    const contentRect = contentRef.getBoundingClientRect();
    const containerRect = containerRef.getBoundingClientRect();

    return {
      contentBounds: { height: contentRect.height, top: contentRect.top, bottom: contentRect.bottom },
      containerBounds: { height: containerRect.height, top: containerRect.top, bottom: containerRect.bottom },
      scale: window.getComputedStyle(contentRef).transform,
      containerOverflow: window.getComputedStyle(containerRef).overflow,
      containerHeightStyle: containerRef.style.height
    };
  });
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
})();
