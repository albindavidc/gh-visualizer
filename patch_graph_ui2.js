import fs from 'fs';

let graphCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

const updatedResizeObserverCode = `
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [containerHeight, setContainerHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 800) {
          const newScale = width / 800;
          setScale(newScale);
          if (contentRef.current) {
            setContainerHeight(contentRef.current.offsetHeight * newScale);
          }
        } else {
          setScale(1);
          setContainerHeight(undefined);
        }
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);
`;

// Replace old observer
graphCode = graphCode.replace(/  const containerRef = React\.useRef<HTMLDivElement>\(null\);[\s\S]*?\}, \[\]\);/, updatedResizeObserverCode.trim());

// Update container div
graphCode = graphCode.replace(
  '<div className="w-full max-w-[800px] flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>',
  '<div className="w-full max-w-[800px] flex flex-col items-center overflow-hidden" ref={containerRef} style={{ height: containerHeight }}>'
);

// Update content div to attach contentRef
graphCode = graphCode.replace(
  "<div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '800px' }}>",
  "<div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '800px' }}>"
);

fs.writeFileSync('src/components/ContributionGraph.tsx', graphCode);
