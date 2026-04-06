import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Login() {
    const [mode, setMode] = useState('login')   // 'login' | 'signup'
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const submit = async () => {
        setErr('')
        setLoading(true)
        try {
            if (mode === 'login') {
                const { error } = await signIn(email, pass)
                if (error) throw error
                navigate('/')
            } else {
                const { error } = await signUp(email, pass)
                if (error) throw error
                setDone(true)
            }
        } catch (e) {
            setErr(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg)',
            backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(110,231,183,0.07) 0%, transparent 70%)',
        }}>
            <div className="glass fade-up" style={{ width: '100%', maxWidth: 400, padding: '40px 36px' }}>
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: 'var(--accent)', letterSpacing: '-0.03em' }}>
                        fin<span style={{ color: 'var(--text)' }}>track</span>
                    </div>
                    <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: '0.9rem' }}>
                        {mode === 'login' ? 'Welcome back' : 'Create your account'}
                    </div>
                </div>

                {done ? (
                    <div style={{ textAlign: 'center', color: 'var(--accent)', padding: '20px 0' }}>
                        ✓ Check your email to confirm your account!
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            <Input label="Password" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
                        </div>

                        {err && <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: 12 }}>{err}</div>}

                        <Button onClick={submit} disabled={loading} style={{ width: '100%', marginTop: 20 }}>
                            {loading ? '…' : mode === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)' }}>
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr('') }}
                                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
