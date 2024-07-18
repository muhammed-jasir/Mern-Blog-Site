import React from 'react'
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
    const { theme } = useSelector(state => state.theme);
    return (
        <ToastContainer
            autoClose={5000}
            newestOnTop={true}
            draggable
            pauseOnHover={false}
            theme={theme === 'dark' ? 'dark' : 'light'}
        />
    )
}

export default Toast