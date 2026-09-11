fetch("http://localhost:3000/api/leetcode-data?username=albindavidc")
  .then(r=>r.json())
  .then(d=> { 
    const { parseSubmissionCalendar } = require("./dist/server.cjs"); 
    // we need to get the parsed weeks
  })
  .catch(console.error);
