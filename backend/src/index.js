const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

const { createClient } = require('@supabase/supabase-js')
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// ── Auth middleware ──────────────────────────────────────────────
async function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data.user) return res.status(401).json({ message: 'Unauthorized' })
    req.user = data.user
    next()
}

// ── Transactions ─────────────────────────────────────────────────
app.get('/api/transactions', auth, async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('user_id', req.user.id)
        .order('date', { ascending: false })
    if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})

app.post('/api/transactions', auth, async (req, res) => {
    const { amount, item, category, date, note } = req.body
    if (!amount || !item) return res.status(400).json({ message: 'amount and item required' })
    const { data, error } = await supabaseAdmin
        .from('transactions')
        .insert([{ user_id: req.user.id, amount: Number(amount), item, category, date, note }])
        .select()
        .single()
    if (error) return res.status(500).json({ message: error.message })
    res.status(201).json(data)
})

app.delete('/api/transactions/:id', auth, async (req, res) => {
    const { error } = await supabaseAdmin
        .from('transactions')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ success: true })
})

// ── Settings ─────────────────────────────────────────────────────
app.get('/api/settings', auth, async (req, res) => {
    const { data } = await supabaseAdmin
        .from('settings')
        .select('*')
        .eq('user_id', req.user.id)
        .single()
    res.json(data || { income: 0, savings_goal: 0 })
})

app.post('/api/settings', auth, async (req, res) => {
    const { income, savings_goal } = req.body
    const { data, error } = await supabaseAdmin
        .from('settings')
        .upsert({ user_id: req.user.id, income: Number(income), savings_goal: Number(savings_goal) }, { onConflict: 'user_id' })
        .select()
        .single()
    if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})

app.listen(process.env.PORT || 5000, () => console.log('Server running on port', process.env.PORT || 5000))