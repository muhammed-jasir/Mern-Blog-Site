import React from 'react'
import { useSelector } from 'react-redux'

const Theme = ({ children }) => {
    const { theme } = useSelector(state => state.theme)
    return (
        <div className={theme}>
            <div className='bg-slate-100 text-gray-900 dark:bg-slate-900 dark:text-gray-50 min-h-screen'>
                {children}
            </div>
        </div>
    )
}

export default Theme