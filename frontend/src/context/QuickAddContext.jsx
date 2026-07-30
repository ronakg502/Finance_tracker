import { createContext, useContext, useState } from 'react'

const QuickAddContext = createContext(null)

export function QuickAddProvider({ children }) {
    const [open, setOpen] = useState(false)
    return (
        <QuickAddContext.Provider value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}>
            {children}
        </QuickAddContext.Provider>
    )
}

export const useQuickAdd = () => useContext(QuickAddContext)
