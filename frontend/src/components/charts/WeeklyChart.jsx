import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function WeeklyChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>No data</div>
    }

    const max = Math.max(...data.map(d => d.value), 1)

    return (
        <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data} barCategoryGap="30%">
                <XAxis
                    dataKey="label"
                    tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                    cursor={{ fill: 'rgba(56,189,248,0.06)' }}
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--accent2)' }}
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spent']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={entry.value === max ? 'var(--accent2)' : 'var(--surface2)'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
