const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const {
    getDailyStats,
    getWeeklyStats,
    getMonthlyStats,
    getMonthlySummary,
} = require('../controllers/statsController')

router.use(auth)

// GET /api/stats/daily    — last 7 days, per-day totals
// GET /api/stats/weekly   — last 4 weeks, per-week totals
// GET /api/stats/monthly  — current month, per-day totals  (?year=&month=)
// GET /api/stats/summary  — current month summary + category breakdown (?year=&month=)
router.get('/daily', getDailyStats)
router.get('/weekly', getWeeklyStats)
router.get('/monthly', getMonthlyStats)
router.get('/summary', getMonthlySummary)

module.exports = router
