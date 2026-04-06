import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Settings from './pages/Settings'

function Layout() {
    return (
        <div style={{ display: 'flex' }}>
            <Navbar />
            <main style={{ marginLeft: 220, flex: 1, padding: '32px 36px', minHeight: '100vh' }}>
                <Outlet />
            </main>
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
        </AuthProvider>
    )
}
