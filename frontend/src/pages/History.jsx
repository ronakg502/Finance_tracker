import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import TransactionTable from '../components/transactions/TransactionTable'

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other']

export default function History() {
    const { transactions, loading, remove } = useTransactions()
    const [search, setSearch] = useState('')
    const [cat, setCat] = useState('All')

    const filtered = transactions.filter(t => {
        const matchCat = cat === 'All' || t.category === cat
        const matchSearch = t.item.toLowerCase().includes(search.toLowerCase()) || t.note?.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>All Transactions</h2>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    placeholder="Search item or note…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: 260 }}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCat(c)} style={{
                            padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', cursor: 'pointer',
                            fontFamily: 'Syne, sans-serif', fontWeight: 600, border: '1px solid',
                            borderColor: cat === c ? 'var(--accent)' : 'var(--border)',
                            background: cat === c ? 'rgba(110,231,183,0.12)' : 'transparent',
                            color: cat === c ? 'var(--accent)' : 'var(--muted)',
                            transition: 'all 0.15s',
                        }}>{c}</button>
                    ))}
                </div>
            </div>

            <div className="glass" style={{ padding: 8 }}>
                {loading
                    ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                    : <TransactionTable transactions={filtered} onDelete={remove} />
                }
            </div>
        </div>
    )
}