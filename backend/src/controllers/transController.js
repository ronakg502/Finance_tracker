const supabase = require('../config/supabase')

const VALID_CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Bills',
    'Health', 'Entertainment', 'Education', 'Other',
]

// GET /api/transactions
async function getTransactions(req, res) {
    const { month, year, category, limit = 200, offset = 0 } = req.query

    let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', req.user.id)
        .order('date', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Optional filters
    if (category && category !== 'All') {
        query = query.eq('category', category)
    }

    if (month && year) {
        const m = String(month).padStart(2, '0')
        const start = `${year}-${m}-01`
        const end = `${year}-${m}-31`
        query = query.gte('date', start).lte('date', end)
    }

    const { data, error } = await query

    if (error) return res.status(500).json({ message: error.message })

    res.json(data)
}

// POST /api/transactions
async function addTransaction(req, res) {
    const { amount, item, category = 'Other', date, note = '' } = req.body

    if (!amount || !item || !date) {
        return res.status(400).json({ message: 'amount, item and date are required' })
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ message: 'amount must be a positive number' })
    }

    if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` })
    }

    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            user_id: req.user.id,
            amount: Number(amount),
            item: item.trim(),
            category,
            date,
            note: note.trim(),
        }])
        .select()
        .single()

    if (error) return res.status(500).json({ message: error.message })

    res.status(201).json(data)
}

// DELETE /api/transactions/:id
async function deleteTransaction(req, res) {
    const { id } = req.params

    // Verify ownership before deleting
    const { data: existing, error: fetchError } = await supabase
        .from('transactions')
        .select('id')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .maybeSingle()

    if (fetchError) return res.status(500).json({ message: fetchError.message })
    if (!existing) return res.status(404).json({ message: 'Transaction not found' })

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

    if (error) return res.status(500).json({ message: error.message })

    res.json({ success: true, id })
}

// PUT /api/transactions/:id  (optional edit endpoint)
async function updateTransaction(req, res) {
    const { id } = req.params
    const { amount, item, category, date, note } = req.body

    const { data: existing, error: fetchError } = await supabase
        .from('transactions')
        .select('id')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .maybeSingle()

    if (fetchError) return res.status(500).json({ message: fetchError.message })
    if (!existing) return res.status(404).json({ message: 'Transaction not found' })

    const patch = {}
    if (amount !== undefined) patch.amount = Number(amount)
    if (item !== undefined) patch.item = item.trim()
    if (category !== undefined) patch.category = category
    if (date !== undefined) patch.date = date
    if (note !== undefined) patch.note = note.trim()

    const { data, error } = await supabase
        .from('transactions')
        .update(patch)
        .eq('id', id)
        .select()
        .single()

    if (error) return res.status(500).json({ message: error.message })

    res.json(data)
}

module.exports = { getTransactions, addTransaction, deleteTransaction, updateTransaction }
