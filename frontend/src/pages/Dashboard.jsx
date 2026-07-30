import { useState, useEffect } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useStats } from '../hooks/useStats'
import { formatCurrency } from '../utils/formatCurrency'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionTable from '../components/transactions/TransactionTable'
import DailyChart from '../components/charts/DailyChart'
import WeeklyChart from '../components/charts/WeeklyChart'
import MonthlyProgress from '../components/charts/MonthlyProgress'
import api from '../services/api'

function StatCard({ label, value, sub, accent }) {
    return (
        <div className="glass" style={{ padding: 22 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: accent || 'var(--text)', letterSpacing: '-0.02em' }}>{value}</div>
            {sub && <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
        </div>
    )
}

export default function Dashboard() {
    const { transactions, loading, add, remove } = useTransactions()
    const [settings, setSettings] = useState({ income: 0, savings_goal: 0 })
    const stats = useStats(transactions)

    useEffect(() => {
        api.get('/api/transactions/settings').then(r => setSettings(r.data)).catch(() => { })
    }, [])

    const recentFive = transactions.slice(0, 5)

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div className="spinner" /></div>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

            {/* Stat cards — 3 cols desktop, 1 col mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="grid-3-col">
                <StatCard label="Income" value={formatCurrency(settings.income)} sub="This month" accent="var(--accent)" />
                <StatCard label="Spent" value={formatCurrency(stats.totalThisMonth)} sub="This month" accent="var(--warn)" />
                <StatCard label="Saved" value={formatCurrency(Math.max(0, settings.income - stats.totalThisMonth))} sub={`Goal: ${formatCurrency(settings.savings_goal)}`} accent="var(--accent2)" />
            </div>

            {/* Charts row — 2 cols desktop, 1 col mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-2-col">
                <div className="glass" style={{ padding: 22 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Daily — Last 7 Days</div>
                    <DailyChart data={stats.dailyData} />
                </div>
                <div className="glass" style={{ padding: 22 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Weekly — Last 4 Weeks</div>
                    <WeeklyChart data={stats.weeklyData} />
                </div>
            </div>

            {/* Monthly progress + Add form — 2 cols desktop, 1 col mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14 }} className="grid-monthly-col">
                <div className="glass" style={{ padding: 22 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20, fontSize: '0.9rem' }}>Monthly Overview</div>
                    <MonthlyProgress spent={stats.totalThisMonth} income={settings.income} savingsGoal={settings.savings_goal} />

                    {stats.categoryBreakdown.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Top Categories</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {stats.categoryBreakdown.slice(0, 4).map(({ category, value }) => (
                                    <div key={category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--muted)' }}>{category}</span>
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{formatCurrency(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <TransactionForm onAdd={add} />
            </div>

            {/* Recent transactions */}
            <div className="glass" style={{ padding: 22 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Recent Transactions</div>
                <TransactionTable transactions={recentFive} onDelete={remove} />
            </div>
        </div>
    )
}
