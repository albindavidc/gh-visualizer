import fs from 'fs';

let graphCode = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

// The best way to scale without getting cut is to use `transformOrigin: 'top left'` and wrap it in a container that itself is centered if needed, or simply `transformOrigin: 'top center'`.
// But also `containerHeight` might be a bit too tight if the content has bottom margins. Let's add a small buffer (e.g. + 10px) to containerHeight just in case.

graphCode = graphCode.replace(
  "setContainerHeight(contentRef.current.offsetHeight * newScale);",
  "setContainerHeight(contentRef.current.offsetHeight * newScale + 10);" // Add 10px padding to avoid clipping
);

graphCode = graphCode.replace(
  "<div className=\"w-full max-w-[800px] flex flex-col items-center overflow-hidden\" ref={containerRef} style={{ height: containerHeight }}>",
  "<div className=\"w-full max-w-[800px] flex justify-center overflow-hidden\" ref={containerRef} style={{ height: containerHeight }}>"
);

graphCode = graphCode.replace(
  "transformOrigin: 'top left'",
  "transformOrigin: 'top center'"
);

fs.writeFileSync('src/components/ContributionGraph.tsx', graphCode);
