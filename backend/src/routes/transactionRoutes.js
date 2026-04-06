const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
} = require('../controllers/transController')
const { ensureProfile, getSettings, upsertSettings } = require('../controllers/authController')

// All routes require a valid Supabase JWT
router.use(auth)

// Profile bootstrap — call this once after login
router.post('/profile', ensureProfile)

// Settings
router.get('/settings', getSettings)
router.post('/settings', upsertSettings)

// Transactions CRUD
router.get('/', getTransactions)     // GET  /api/transactions
router.post('/', addTransaction)      // POST /api/transactions
router.put('/:id', updateTransaction)   // PUT  /api/transactions/:id
router.delete('/:id', deleteTransaction)   // DELETE /api/transactions/:id

module.exports = router
