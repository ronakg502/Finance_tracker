import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/dateHelpers'

const CAT_COLORS = {
    Food: '#6ee7b7', Transport: '#38bdf8', Shopping: '#f472b6',
    Bills: '#fb923c', Health: '#a78bfa', Entertainment: '#fbbf24',
    Education: '#34d399', Other: '#94a3b8',
}

export default function TransactionTable({ transactions, onDelete }) {
    if (!transactions.length) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
                No transactions yet
            </div>
        )
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Date', 'Item', 'Category', 'Amount', ''].map(h => (
                            <th key={h} style={{
                                textAlign: 'left', padding: '10px 14px',
                                fontSize: '0.75rem', color: 'var(--muted)',
                                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                                letterSpacing: '0.06em', textTransform: 'uppercase'
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t, i) => (
                        <tr key={t.id || i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: 'var(--muted)' }}>{formatDate(t.date)}</td>
                            <td style={{ padding: '12px 14px', fontSize: '0.9rem' }}>
                                <div>{t.item}</div>
                                {t.note && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.note}</div>}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                                <span className="tag" style={{ background: `${CAT_COLORS[t.category] || '#94a3b8'}18`, color: CAT_COLORS[t.category] || '#94a3b8' }}>
                                    {t.category}
                                </span>
                            </td>
                            <td style={{ padding: '12px 14px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--warn)' }}>
                                {formatCurrency(t.amount)}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                                {onDelete && (
                                    <button onClick={() => onDelete(t.id)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.15s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                                    >✕</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}