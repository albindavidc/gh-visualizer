export function calculateStreaks(weeks) {
    const days = [];
    weeks.forEach(w => w.days.forEach(d => days.push(d)));
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakStart = "";
    let currentStreakEnd = "";
    let longestStreakStart = "";
    let longestStreakEnd = "";
    let tempStreak = 0;
    let tempStart = "";
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        if (day.count > 0) {
            if (tempStreak === 0)
                tempStart = day.date;
            tempStreak++;
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
                longestStreakStart = tempStart;
                longestStreakEnd = day.date;
            }
        }
        else {
            tempStreak = 0;
            tempStart = "";
        }
    }
    // Current streak (counting backwards from today)
    for (let i = days.length - 1; i >= 0; i--) {
        const day = days[i];
        if (day.count > 0) {
            if (currentStreak === 0)
                currentStreakEnd = day.date;
            currentStreak++;
            currentStreakStart = day.date;
        }
        else {
            // If it's the very last day (today) and count is 0, we forgive it and keep looking at yesterday.
            // If it's NOT the last day, the streak is broken.
            if (i !== days.length - 1) {
                break;
            }
        }
    }
    // formatting helper
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const formatShortDate = (dateStr) => {
        if (!dateStr)
            return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    const currentRange = currentStreak > 0
        ? (currentStreakStart === currentStreakEnd ? formatShortDate(currentStreakStart) : `${formatShortDate(currentStreakStart)} - ${formatShortDate(currentStreakEnd)}`)
        : '-';
    const longestRange = longestStreak > 0
        ? (longestStreakStart === longestStreakEnd ? formatShortDate(longestStreakStart) : `${formatShortDate(longestStreakStart)} - ${formatShortDate(longestStreakEnd)}`)
        : '-';
    const totalRange = "All Time";
    return {
        currentStreak,
        longestStreak,
        currentRange,
        longestRange,
        totalRange
    };
}
