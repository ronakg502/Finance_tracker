export default function Button({ children, variant = 'primary', className = '', ...props }) {
    return (
        <button
            className={variant === 'primary' ? `btn-primary ${className}` : `btn-ghost ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}