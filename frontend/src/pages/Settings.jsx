import { useState, useEffect } from 'react'
import api from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Settings() {
    const [form, setForm] = useState({ income: '', savings_goal: '' })
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get('/api/settings').then(r => {
            setForm({ income: r.data.income || '', savings_goal: r.data.savings_goal || '' })
        }).catch(() => { })
    }, [])

    const save = async () => {
        setLoading(true)
        await api.post('/api/settings', form)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        setLoading(false)
    }

    return (
        <div className="fade-up" style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Settings</h2>
            <div className="glass" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Input
                    label="Monthly Income (₹)"
                    type="number"
                    placeholder="50000"
                    value={form.income}
                    onChange={e => setForm(f => ({ ...f, income: e.target.value }))}
                />
                <Input
                    label="Savings Goal (₹)"
                    type="number"
                    placeholder="15000"
                    value={form.savings_goal}
                    onChange={e => setForm(f => ({ ...f, savings_goal: e.target.value }))}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Button onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save'}</Button>
                    {saved && <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>✓ Saved!</span>}
                </div>
            </div>
        </div>
    )
}