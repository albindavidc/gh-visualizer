import { parseSubmissionCalendar } from "./src/utils/leetcode";
const w = parseSubmissionCalendar('{"1767398400": 3, "1767484800": 2, "1769299200": 5}');
console.log(w[0].days[0]);
console.log(w[w.length-1].days[w[w.length-1].days.length-1]);
