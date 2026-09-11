import { Day, Week } from "./streaks.js";

export function parseSubmissionCalendar(calendarStr: string | undefined): Week[] {
  let rawCal: Record<string, number> = {};
  try {
    rawCal = JSON.parse(calendarStr || "{}");
  } catch (e) { }

  // Map exact UNIX timestamps to YYYY-MM-DD
  const cal: Record<string, number> = {};
  for (const [ts, count] of Object.entries(rawCal)) {
    // LeetCode's timestamps are usually UTC midnights
    const dateStr = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
    cal[dateStr] = count;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 365 days ago
  const startDate = new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000);
  
  // Align start date to Sunday
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);

  const numDays = Math.floor((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  const weeks: Week[] = [];
  let currentWeek: Week = { days: [] };

  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Format local date as YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const count = cal[dateStr] || 0;
    
    // Determine level (0-4) based on count
    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 4) level = 3;
    if (count > 6) level = 4;

    currentWeek.days.push({
      date: dateStr,
      count,
      level,
      weekday: d.getDay()
    });

    if (currentWeek.days.length === 7) {
      weeks.push(currentWeek);
      currentWeek = { days: [] };
    }
  }
  
  if (currentWeek.days.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}
