import { useMemo } from 'react'
import { getLast7Days, getMonthDays, isSameDay } from '../utils/dateHelpers'

export function useStats(transactions) {
    const now = new Date()

    const dailyData = useMemo(() => {
        const days = getLast7Days()
        return days.map(day => {
            const total = transactions
                .filter(t => isSameDay(new Date(t.date), day))
                .reduce((sum, t) => sum + Number(t.amount), 0)
            return {
                label: day.toLocaleDateString('en-IN', { weekday: 'short' }),
                value: total,
                date: day,
            }
        })
    }, [transactions])

    const weeklyData = useMemo(() => {
        // Last 4 weeks
        const weeks = []
        for (let i = 3; i >= 0; i--) {
            const start = new Date(now)
            start.setDate(now.getDate() - (i + 1) * 7)
            start.setHours(0, 0, 0, 0)
            const end = new Date(now)
            end.setDate(now.getDate() - i * 7)
            end.setHours(23, 59, 59, 999)
            const total = transactions
                .filter(t => { const d = new Date(t.date); return d >= start && d <= end })
                .reduce((sum, t) => sum + Number(t.amount), 0)
            weeks.push({ label: `W${4 - i}`, value: total })
        }
        return weeks
    }, [transactions])

    const monthlyData = useMemo(() => {
        const days = getMonthDays(now.getFullYear(), now.getMonth())
        return days.map(day => {
            const total = transactions
                .filter(t => isSameDay(new Date(t.date), day))
                .reduce((sum, t) => sum + Number(t.amount), 0)
            return { label: day.getDate().toString(), value: total }
        })
    }, [transactions])

    const totalThisMonth = useMemo(() => {
        return transactions
            .filter(t => {
                const d = new Date(t.date)
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            })
            .reduce((sum, t) => sum + Number(t.amount), 0)
    }, [transactions])

    const categoryBreakdown = useMemo(() => {
        const map = {}
        transactions
            .filter(t => {
                const d = new Date(t.date)
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            })
            .forEach(t => {
                map[t.category] = (map[t.category] || 0) + Number(t.amount)
            })
        return Object.entries(map)
            .map(([cat, val]) => ({ category: cat, value: val }))
            .sort((a, b) => b.value - a.value)
    }, [transactions])

    return { dailyData, weeklyData, monthlyData, totalThisMonth, categoryBreakdown }
}
