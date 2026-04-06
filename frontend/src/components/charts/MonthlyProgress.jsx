import { formatCurrency } from '../../utils/formatCurrency'

export default function MonthlyProgress({ spent, income, savingsGoal }) {
    const savings = Math.max(0, income - spent)
    const spentPct = income > 0 ? Math.min(100, (spent / income) * 100) : 0
    const savingsPct = savingsGoal > 0 ? Math.min(100, (savings / savingsGoal) * 100) : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Spent vs Income */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontFamily: 'Syne', fontWeight: 600 }}>SPENT</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                        {formatCurrency(spent)} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {formatCurrency(income)}</span>
                    </span>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${spentPct}%`,
                        borderRadius: 99,
                        background: spentPct > 85 ? 'var(--danger)' : spentPct > 65 ? 'var(--warn)' : 'var(--accent)',
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{spentPct.toFixed(1)}% of income used</div>
            </div>

            {/* Savings goal */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontFamily: 'Syne', fontWeight: 600 }}>SAVINGS</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                        {formatCurrency(savings)} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {formatCurrency(savingsGoal)}</span>
                    </span>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${savingsPct}%`,
                        borderRadius: 99,
                        background: 'var(--accent2)',
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{savingsPct.toFixed(1)}% of goal reached</div>
            </div>
        </div>
    )
}