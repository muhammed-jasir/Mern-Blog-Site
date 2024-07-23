import React from 'react'
import { useSelector } from 'react-redux'

const Theme = ({ children }) => {
    const { theme } = useSelector(state => state.theme)
    return (
        <div className={theme}>
            <div className={`${theme === 'dark' ? 'bg-slate-900 text-gray-50' : 'bg-slate-100 text-gray-900'} min-h-screen`}>
                {children}
            </div>
        </div>
    )
}

export default Theme