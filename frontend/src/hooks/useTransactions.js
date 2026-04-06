import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetch = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/transactions')
            setTransactions(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    const add = async (payload) => {
        const { data } = await api.post('/api/transactions', payload)
        setTransactions(prev => [data, ...prev])
        return data
    }

    const remove = async (id) => {
        await api.delete(`/api/transactions/${id}`)
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    return { transactions, loading, error, refetch: fetch, add, remove }
}
