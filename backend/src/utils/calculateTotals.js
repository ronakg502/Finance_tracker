/**
 * Groups an array of transactions by a key derived from each transaction's date.
 * Returns an array of { label, total } objects.
 *
 * @param {Array}    transactions  - Array of transaction rows from Supabase
 * @param {Function} getKey        - fn(date: Date) => string label
 * @param {Array}    orderedLabels - All expected labels in display order
 */
function groupByKey(transactions, getKey, orderedLabels) {
    const map = {}

    for (const label of orderedLabels) {
        map[label] = 0
    }

    for (const t of transactions) {
        const key = getKey(new Date(t.date))
        if (key in map) {
            map[key] += Number(t.amount)
        }
    }

    return orderedLabels.map((label) => ({ label, total: map[label] }))
}

/**
 * Returns labels for the last N days (e.g. "Mon", "Tue" …)
 */
function getLast7DayLabels() {
    const labels = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        labels.push(
            d.toLocaleDateString('en-IN', { weekday: 'short' }) +
            ' ' +
            d.getDate()
        )
    }
    return labels
}

/**
 * Returns labels for the last 4 ISO weeks (e.g. "W1", "W2" …)
 */
function getLast4WeekLabels() {
    return ['W1', 'W2', 'W3', 'W4']
}

/**
 * Returns day-of-month labels for the current month (1 … 31)
 */
function getCurrentMonthDayLabels() {
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1))
}

/**
 * Key function: "Weekday Day" matching getLast7DayLabels format
 */
function dailyKey(date) {
    return (
        date.toLocaleDateString('en-IN', { weekday: 'short' }) + ' ' + date.getDate()
    )
}

/**
 * Key function: which of the last-4 weeks bucket does this date fall into?
 * W4 = current week, W3 = last week, etc.
 */
function weeklyKey(date) {
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    const weekIndex = Math.floor(diffDays / 7) // 0 = current week
    if (weekIndex > 3) return null
    return `W${4 - weekIndex}`
}

/**
 * Key function: day-of-month as string
 */
function monthlyKey(date) {
    return String(date.getDate())
}

/**
 * Summarises transactions into { total, byCategory }
 */
function summarise(transactions) {
    const byCategory = {}
    let total = 0

    for (const t of transactions) {
        total += Number(t.amount)
        byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount)
    }

    return {
        total,
        byCategory: Object.entries(byCategory)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount),
    }
}

module.exports = {
    groupByKey,
    getLast7DayLabels,
    getLast4WeekLabels,
    getCurrentMonthDayLabels,
    dailyKey,
    weeklyKey,
    monthlyKey,
    summarise,
}
