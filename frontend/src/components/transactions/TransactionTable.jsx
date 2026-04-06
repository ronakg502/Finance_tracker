import { formatCurrency } from '../../utils/formatCurrency'

const CATEGORY_COLORS = {
    Food: '#6ee7b7',
    Transport: '#38bdf8',
    Shopping: '#fb923c',
    Bills: '#f87171',
    Health: '#a78bfa',
    Entertainment: '#fbbf24',
    Education: '#34d399',
    Other: '#6b7280',
}

export default function TransactionTable({ transactions, onDelete }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px 0', fontSize: '0.88rem' }}>
                No transactions yet
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {transactions.map(t => (
                <div
                    key={t.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        background: 'var(--surface2)',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                    }}
                >
                    {/* Category dot */}
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other,
                    }} />

                    {/* Item name */}
                    <div style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.item}
                    </div>

                    {/* Category tag */}
                    <div style={{
                        fontSize: '0.72rem',
                        color: CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other,
                        background: `${CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other}1a`,
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                    }}>
                        {t.category}
                    </div>

                    {/* Date */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>

                    {/* Amount */}
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--warn)', whiteSpace: 'nowrap' }}>
                        {formatCurrency(t.amount)}
                    </div>

                    {/* Delete button */}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(t.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--muted)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                lineHeight: 1,
                                padding: '0 2px',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
