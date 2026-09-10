import { Day, Week } from "./streaks.js";

export function parseSubmissionCalendar(calendarStr: string | undefined): Week[] {
  let cal: Record<string, number> = {};
  try {
    cal = JSON.parse(calendarStr || "{}");
  } catch (e) { }

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
    const dateStr = d.toISOString().split("T")[0];
    const timestamp = Math.floor(d.getTime() / 1000).toString();

    const count = cal[timestamp] || 0;
    
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
