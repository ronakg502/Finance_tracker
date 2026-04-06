import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other']

export default function TransactionForm({ onAdd }) {
    const [form, setForm] = useState({ amount: '', item: '', category: 'Food', date: new Date().toISOString().slice(0, 10), note: '' })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = async () => {
        if (!form.amount || !form.item) { setErr('Amount and item are required'); return }
        setErr('')
        setLoading(true)
        try {
            await onAdd(form)
            setForm({ amount: '', item: '', category: 'Food', date: new Date().toISOString().slice(0, 10), note: '' })
        } catch (e) {
            setErr(e.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Add Expense</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Amount (₹)" type="number" placeholder="0" value={form.amount} onChange={e => set('amount', e.target.value)} />
                <Input label="Item / Description" type="text" placeholder="e.g. Lunch" value={form.item} onChange={e => set('item', e.target.value)} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Category</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>

                <Input label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>

            <div style={{ marginTop: 14 }}>
                <Input label="Note (optional)" type="text" placeholder="Any extra details..." value={form.note} onChange={e => set('note', e.target.value)} />
            </div>

            {err && <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: 10 }}>{err}</div>}

            <div style={{ marginTop: 18 }}>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Adding…' : '+ Add Expense'}
                </Button>
            </div>
        </div>
    )
}