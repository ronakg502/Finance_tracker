export const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
export const startOfWeek = (d) => { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); x.setHours(0, 0, 0, 0); return x }
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)

export const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

export const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

export const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days.push(d)
    }
    return days
}

export const getMonthDays = (year, month) => {
    const count = getDaysInMonth(year, month)
    return Array.from({ length: count }, (_, i) => new Date(year, month, i + 1))
}