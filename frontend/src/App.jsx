import { NavLink, useNavigate, BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { QuickAddProvider, useQuickAdd } from './context/QuickAddContext'
import QuickAddModal from './components/transactions/QuickAddModal'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Settings from './pages/Settings'

const links = [
    { to: '/', label: 'Dashboard', icon: '⬡' },
    { to: '/history', label: 'History', icon: '◫' },
    { to: '/settings', label: 'Settings', icon: '◎' },
]

function Sidebar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const handleSignOut = async () => { await signOut(); navigate('/login') }

    return (
        <aside className="sidebar">
            <div style={{ paddingLeft: 14, marginBottom: 36 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', letterSpacing: '-0.02em' }}>
                    fin<span style={{ color: 'var(--text)' }}>track</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>personal finance</div>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {links.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    >
                        <span style={{ fontSize: '1rem' }}>{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Desktop quick-add in sidebar */}
            <SidebarQuickAdd />

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', paddingLeft: 14, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email}
                </div>
                <button onClick={handleSignOut} className="btn-ghost" style={{ width: '100%', fontSize: '0.82rem' }}>
                    Sign out
                </button>
            </div>
        </aside>
    )
}

function SidebarQuickAdd() {
    const { openModal } = useQuickAdd()
    return (
        <button
            onClick={openModal}
            style={{
                margin: '16px 0',
                padding: '11px 14px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--accent)',
                color: '#0f1117',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
            <span style={{ fontSize: '1rem' }}>＋</span> Add Expense
        </button>
    )
}

function FAB() {
    const { openModal } = useQuickAdd()
    return (
        <button
            id="fab-add-expense"
            onClick={openModal}
            aria-label="Add Expense"
            style={{
                position: 'fixed',
                bottom: 'calc(var(--bottom-bar-h) + 16px)',
                right: 20,
                zIndex: 300,
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: 'none',
                background: 'var(--accent)',
                color: '#0f1117',
                fontSize: '1.6rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(110,231,183,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(110,231,183,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(110,231,183,0.4)' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
        >
            +
        </button>
    )
}

function BottomNav() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const handleSignOut = async () => { await signOut(); navigate('/login') }

    return (
        <nav className="bottom-nav">
            {links.map(({ to, label, icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
                >
                    <span className="nav-icon">{icon}</span>
                    {label}
                </NavLink>
            ))}
            <button
                onClick={handleSignOut}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 12px', flex: 1, background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.68rem', fontWeight: 600, fontFamily: 'var(--sans)', cursor: 'pointer' }}
            >
                <span className="nav-icon">⏻</span>
                Sign out
            </button>
        </nav>
    )
}

function Layout() {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
            {/* FAB — visible on both mobile and desktop */}
            <FAB />
            {/* Bottom nav — mobile only via CSS */}
            <BottomNav />
            {/* Global quick-add modal */}
            <QuickAddModal />
        </div>
    )
}

function Protected() {
    const { user, loading } = useAuth()
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>
    return user ? <Layout /> : <Navigate to="/login" replace />
}

export default function App() {
    return (
        <AuthProvider>
            <QuickAddProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route element={<Protected />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QuickAddProvider>
        </AuthProvider>
    )
}
