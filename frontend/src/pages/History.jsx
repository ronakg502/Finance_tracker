import { useState, useEffect } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import TransactionTable from '../components/transactions/TransactionTable'

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other']

export default function History() {
    const { transactions, loading, remove } = useTransactions()
    const [filter, setFilter] = useState('All')

    const filtered = filter === 'All' ? transactions : transactions.filter(t => t.category === filter)

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div className="spinner" /></div>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="fade-up">
            <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.02em' }}>History</h1>
                <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>{filtered.length} transactions</div>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: filter === cat ? 'var(--accent)' : 'var(--border)',
                            background: filter === cat ? 'rgba(110,231,183,0.1)' : 'transparent',
                            color: filter === cat ? 'var(--accent)' : 'var(--muted)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: 'Syne, sans-serif',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="glass" style={{ padding: 22 }}>
                <TransactionTable transactions={filtered} onDelete={remove} />
            </div>
        </div>
    )
}
