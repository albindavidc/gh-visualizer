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
    
    if (!heatmapText) return 'Heatmap text not found';

    const contentRef = heatmapText.parentElement;
    const containerRef = contentRef.parentElement;
    
    let current = containerRef;
    let trace = [];
    
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      trace.push({
        tag: current.tagName,
        className: current.className,
        id: current.id,
        height: style.height,
        minHeight: style.minHeight,
        maxHeight: style.maxHeight,
        display: style.display,
        flexDirection: style.flexDirection,
        alignItems: style.alignItems,
        flexShrink: style.flexShrink,
        overflow: style.overflow,
        overflowY: style.overflowY,
        rectHeight: rect.height,
      });
      current = current.parentElement;
    }
    
    return {
      trace,
      containerHeightInlineStyle: containerRef.style.height,
      containerRefMaxHeight: containerRef.style.maxHeight
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
