import { useState, useEffect } from 'react'
import { useQuickAdd } from '../../context/QuickAddContext'
import api from '../../services/api'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other']

const CAT_ICONS = {
    Food: '🍽', Transport: '🚗', Shopping: '🛍', Bills: '⚡',
    Health: '💊', Entertainment: '🎮', Education: '📚', Other: '📦',
}

const today = () => new Date().toISOString().slice(0, 10)

export default function QuickAddModal({ onAdded }) {
    const { open, closeModal } = useQuickAdd()
    const [form, setForm] = useState({ amount: '', item: '', category: 'Food', date: today(), note: '' })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState(false)

    // reset when opened
    useEffect(() => {
        if (open) {
            setForm({ amount: '', item: '', category: 'Food', date: today(), note: '' })
            setErr('')
            setSuccess(false)
        }
    }, [open])

    // close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') closeModal() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [closeModal])

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = async () => {
        if (!form.amount || !form.item) { setErr('Amount and item are required'); return }
        setErr('')
        setLoading(true)
        try {
            const { data } = await api.post('/api/transactions', {
                amount: Number(form.amount),
                item: form.item.trim(),
                category: form.category,
                date: form.date,
                note: form.note.trim(),
            })
            setSuccess(true)
            onAdded?.(data)
            setTimeout(() => closeModal(), 900)
        } catch (e) {
            setErr(e.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={closeModal}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 500,
                    animation: 'fadeIn 0.2s ease',
                }}
            />

            {/* Bottom sheet */}
            <div style={{
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                zIndex: 600,
                background: 'var(--surface)',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderTop: '1px solid var(--border)',
                padding: '0 0 env(safe-area-inset-bottom, 16px)',
                animation: 'slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1)',
                maxHeight: '92vh',
                overflowY: 'auto',
            }}>
                {/* Drag handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                    <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }} />
                </div>

                <div style={{ padding: '8px 24px 32px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)' }}>
                                Add Expense
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                                Track spending instantly
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', fontSize: '1.1rem', flexShrink: 0 }}
                        >×</button>
                    </div>

                    {/* Amount — big & prominent */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Amount (₹)
                        </label>
                        <div style={{ position: 'relative', marginTop: 8 }}>
                            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)', pointerEvents: 'none' }}>₹</span>
                            <input
                                type="number"
                                inputMode="decimal"
                                placeholder="0"
                                value={form.amount}
                                onChange={e => set('amount', e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    background: 'var(--surface2)',
                                    border: '2px solid var(--accent)',
                                    borderRadius: 12,
                                    color: 'var(--text)',
                                    padding: '14px 14px 14px 36px',
                                    fontSize: '1.5rem',
                                    fontFamily: 'Syne, sans-serif',
                                    fontWeight: 700,
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>

                    {/* Item description */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Item / Description
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Lunch, Uber, Groceries…"
                            value={form.item}
                            onChange={e => set('item', e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                            style={{ marginTop: 8, borderRadius: 10, padding: '11px 12px', fontSize: '0.95rem' }}
                        />
                    </div>

                    {/* Category pills */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Category
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => set('category', cat)}
                                    style={{
                                        padding: '7px 14px',
                                        borderRadius: 999,
                                        border: '1px solid',
                                        borderColor: form.category === cat ? 'var(--accent)' : 'var(--border)',
                                        background: form.category === cat ? 'rgba(110,231,183,0.1)' : 'var(--surface2)',
                                        color: form.category === cat ? 'var(--accent)' : 'var(--muted)',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}
                                >
                                    <span>{CAT_ICONS[cat]}</span> {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Date
                        </label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => set('date', e.target.value)}
                            style={{ marginTop: 8, borderRadius: 10, padding: '11px 12px' }}
                        />
                    </div>

                    {/* Note */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Note (optional)
                        </label>
                        <input
                            type="text"
                            placeholder="Any extra details…"
                            value={form.note}
                            onChange={e => set('note', e.target.value)}
                            style={{ marginTop: 8, borderRadius: 10, padding: '11px 12px' }}
                        />
                    </div>

                    {err && <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: 14 }}>{err}</div>}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || success}
                        style={{
                            width: '100%',
                            padding: '15px',
                            borderRadius: 14,
                            border: 'none',
                            background: success ? 'var(--accent2)' : 'var(--accent)',
                            color: '#0f1117',
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 800,
                            fontSize: '1rem',
                            cursor: loading || success ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        {success ? '✓ Added!' : loading ? 'Adding…' : '+ Add Expense'}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
            `}</style>
        </>
    )
}
