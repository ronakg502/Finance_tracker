export default function Input({ label, className = '', ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className={className}>
            {label && (
                <label style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <input {...props} />
        </div>
    )
}
