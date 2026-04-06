import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent2)' }}>
                ₹{payload[0].value.toLocaleString('en-IN')}
            </div>
        </div>
    )
}

export default function WeeklyChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                    <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fill="url(#weekGrad)" dot={{ fill: '#38bdf8', r: 4 }} />
            </AreaChart>
        </ResponsiveContainer>
    )
}