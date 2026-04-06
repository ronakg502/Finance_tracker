const supabase = require('../config/supabase')

/**
 * Called after a user's JWT is verified.
 * Upserts a row in `profiles` so each user has a record.
 * Also seeds a default `settings` row if one doesn't exist.
 */
async function ensureProfile(req, res) {
    const { id: user_id, email } = req.user

    // Upsert profile
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ user_id, email }, { onConflict: 'user_id' })

    if (profileError) {
        return res.status(500).json({ message: profileError.message })
    }

    // Seed default settings only if missing
    const { data: existing } = await supabase
        .from('settings')
        .select('user_id')
        .eq('user_id', user_id)
        .maybeSingle()

    if (!existing) {
        const { error: settingsError } = await supabase
            .from('settings')
            .insert({ user_id, income: 0, savings_goal: 0 })

        if (settingsError && settingsError.code !== '23505') {
            // 23505 = unique_violation (race condition) — safe to ignore
            return res.status(500).json({ message: settingsError.message })
        }
    }

    res.json({ message: 'Profile ready', user_id, email })
}

// GET /api/settings
async function getSettings(req, res) {
    const { data, error } = await supabase
        .from('settings')
        .select('income, savings_goal')
        .eq('user_id', req.user.id)
        .maybeSingle()

    if (error) return res.status(500).json({ message: error.message })

    res.json(data || { income: 0, savings_goal: 0 })
}

// POST /api/settings
async function upsertSettings(req, res) {
    const { income, savings_goal } = req.body

    if (income === undefined && savings_goal === undefined) {
        return res.status(400).json({ message: 'Provide income and/or savings_goal' })
    }

    const patch = {}
    if (income !== undefined) patch.income = Number(income)
    if (savings_goal !== undefined) patch.savings_goal = Number(savings_goal)
    patch.user_id = req.user.id

    const { data, error } = await supabase
        .from('settings')
        .upsert(patch, { onConflict: 'user_id' })
        .select('income, savings_goal')
        .single()

    if (error) return res.status(500).json({ message: error.message })

    res.json(data)
}

module.exports = { ensureProfile, getSettings, upsertSettings }
