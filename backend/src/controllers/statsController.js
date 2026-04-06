const supabase = require('../config/supabase')
const {
    groupByKey,
    getLast7DayLabels,
    getLast4WeekLabels,
    getCurrentMonthDayLabels,
    dailyKey,
    weeklyKey,
    monthlyKey,
    summarise,
} = require('../utils/calculateTotals')

/**
 * Helper: fetch transactions for a user within a date range
 */
async function fetchRange(userId, startDate, endDate) {
    const { data, error } = await supabase
        .from('transactions')
        .select('amount, category, date')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })

    if (error) throw error
    return data
}

// ── GET /api/stats/daily  ────────────────────────────────────────
// Returns spend totals for each of the last 7 days
async function getDailyStats(req, res) {
    try {
        const now = new Date()
        const start = new Date(now)
        start.setDate(now.getDate() - 6)

        const startDate = start.toISOString().slice(0, 10)
        const endDate = now.toISOString().slice(0, 10)

        const transactions = await fetchRange(req.user.id, startDate, endDate)

        const labels = getLast7DayLabels()
        const result = groupByKey(transactions, dailyKey, labels)

        res.json({ data: result, startDate, endDate })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// ── GET /api/stats/weekly  ───────────────────────────────────────
// Returns spend totals for each of the last 4 weeks
async function getWeeklyStats(req, res) {
    try {
        const now = new Date()
        const start = new Date(now)
        start.setDate(now.getDate() - 27) // 4 weeks back

        const startDate = start.toISOString().slice(0, 10)
        const endDate = now.toISOString().slice(0, 10)

        const transactions = await fetchRange(req.user.id, startDate, endDate)

        const labels = getLast4WeekLabels()
        const result = groupByKey(transactions, weeklyKey, labels)

        res.json({ data: result, startDate, endDate })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// ── GET /api/stats/monthly  ──────────────────────────────────────
// Returns day-by-day spend totals for the current (or requested) month
async function getMonthlyStats(req, res) {
    try {
        const now = new Date()
        const year = Number(req.query.year || now.getFullYear())
        const month = Number(req.query.month || now.getMonth() + 1) // 1-based

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const lastDay = new Date(year, month, 0).getDate()
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

        const transactions = await fetchRange(req.user.id, startDate, endDate)

        const labels = getCurrentMonthDayLabels()
        const result = groupByKey(transactions, monthlyKey, labels)

        res.json({ data: result, year, month, startDate, endDate })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// ── GET /api/stats/summary  ──────────────────────────────────────
// Returns total spent + category breakdown for the current month
async function getMonthlySummary(req, res) {
    try {
        const now = new Date()
        const year = Number(req.query.year || now.getFullYear())
        const month = Number(req.query.month || now.getMonth() + 1)

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const lastDay = new Date(year, month, 0).getDate()
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

        const transactions = await fetchRange(req.user.id, startDate, endDate)

        const { total, byCategory } = summarise(transactions)

        // Also pull settings so frontend can show savings progress in one call
        const { data: settings } = await supabase
            .from('settings')
            .select('income, savings_goal')
            .eq('user_id', req.user.id)
            .maybeSingle()

        const income = settings?.income || 0
        const savingsGoal = settings?.savings_goal || 0
        const saved = Math.max(0, income - total)

        res.json({
            year, month,
            totalSpent: total,
            income,
            saved,
            savingsGoal,
            byCategory,
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = { getDailyStats, getWeeklyStats, getMonthlyStats, getMonthlySummary }
