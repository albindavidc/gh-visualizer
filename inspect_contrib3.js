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
    const grid = contentRef.querySelector('.gap-\\[3px\\].p-4');
    
    const gridRect = grid.getBoundingClientRect();
    
    const trace = [];
    let current = grid;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      if (style.overflow === 'hidden' || style.overflowY === 'hidden') {
         trace.push({
           class: current.className,
           top: current.getBoundingClientRect().top,
           bottom: current.getBoundingClientRect().bottom,
           height: current.getBoundingClientRect().height
         });
      }
      current = current.parentElement;
    }
    
    return {
      gridBounds: { height: gridRect.height, top: gridRect.top, bottom: gridRect.bottom },
      clippingAncestors: trace
    };
  });
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
})();
