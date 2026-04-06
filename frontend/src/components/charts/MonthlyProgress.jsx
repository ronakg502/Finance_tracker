import { formatCurrency } from '../../utils/formatCurrency'

export default function MonthlyProgress({ spent, income, savingsGoal }) {
    const spendPct = income > 0 ? Math.min((spent / income) * 100, 100) : 0
    const savedAmt = Math.max(0, income - spent)
    const savePct = savingsGoal > 0 ? Math.min((savedAmt / savingsGoal) * 100, 100) : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Spend bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Spent</span>
                    <span style={{ color: 'var(--warn)', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                        {formatCurrency(spent)}
                    </span>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${spendPct}%`,
                        background: spendPct > 90 ? 'var(--danger)' : 'var(--warn)',
                        borderRadius: 999,
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>
                    of {formatCurrency(income)} income
                </div>
            </div>

            {/* Savings bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Saved</span>
                    <span style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                        {formatCurrency(savedAmt)}
                    </span>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${savePct}%`,
                        background: 'var(--accent)',
                        borderRadius: 999,
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>
                    goal: {formatCurrency(savingsGoal)}
                </div>
            </div>
        </div>
    )
}
