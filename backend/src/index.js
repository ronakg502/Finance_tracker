require('dotenv').config()

const express = require('express')
const cors = require('cors')
const transactionRoutes = require('./routes/transactionRoutes')
const statsRoutes = require('./routes/statsRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────────────
app.use(cors({
    origin: true,   // allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

app.use(express.json())

// ── Request logger (dev) ─────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.originalUrl}`)
        next()
    })
}

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/transactions', transactionRoutes)
app.use('/api/stats', statsRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).json({ message: err.message || 'Internal server error' })
})

// 404 fallback
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✓ fintrack API running on http://localhost:${PORT}`)
})
