export default function Input({ label, className = '', ...props }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <input {...props} />
        </div>
    )
}