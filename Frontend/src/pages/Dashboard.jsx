import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Profile from '../components/Profile';

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
        
    }, [location.search])

    return (
        <div className=''>
            {tab === 'profile' && <Profile />}
        </div>
    )
}

export default Dashboard