import { useState, useEffect } from 'react'
import api from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Settings() {
    const [form, setForm] = useState({ income: '', savings_goal: '' })
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [err, setErr] = useState('')

    useEffect(() => {
        api.get('/api/transactions/settings').then(r => {
            setForm({ income: r.data.income ?? '', savings_goal: r.data.savings_goal ?? '' })
        }).catch(() => { })
    }, [])

    const handleSave = async () => {
        setErr('')
        setSaved(false)
        setLoading(true)
        try {
            await api.post('/api/transactions/settings', {
                income: Number(form.income),
                savings_goal: Number(form.savings_goal),
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (e) {
            setErr(e.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }} className="fade-up">
            <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.02em' }}>Settings</h1>
                <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>Monthly budget & savings goal</div>
            </div>

            <div className="glass" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Input
                    label="Monthly Income (₹)"
                    type="number"
                    placeholder="e.g. 50000"
                    value={form.income}
                    onChange={e => setForm(f => ({ ...f, income: e.target.value }))}
                />
                <Input
                    label="Savings Goal (₹)"
                    type="number"
                    placeholder="e.g. 10000"
                    value={form.savings_goal}
                    onChange={e => setForm(f => ({ ...f, savings_goal: e.target.value }))}
                />

                {err && <div style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{err}</div>}
                {saved && <div style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>✓ Settings saved!</div>}

                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving…' : 'Save Settings'}
                </Button>
            </div>
        </div>
    )
}
