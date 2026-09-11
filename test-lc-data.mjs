import { parseSubmissionCalendar } from "./src/utils/leetcode.ts";
fetch("http://localhost:3000/api/leetcode-data?username=albindavidc")
  .then(r=>r.json())
  .then(d=> { 
    const weeks = parseSubmissionCalendar(d.submissionCalendar);
    console.log("Total weeks:", weeks.length);
    console.log("Week 0 days:", weeks[0].days.length);
  })
  .catch(console.error);
