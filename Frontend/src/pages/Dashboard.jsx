import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Profile from '../components/Profile';
import DashSidebar from '../components/DashSidebar';
import CreatePost from './CreatePost';
import DashPosts from '../components/DashPosts';

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
        <div className='flex flex-col md:flex-row'>
            <div className='md:min-w-60'>
                <DashSidebar />
            </div>
            <main className='flex-grow flex-1'>
                {tab === 'profile' && <Profile />}
                {tab === 'create-post' && <CreatePost />}
                {tab === 'posts' && <DashPosts />}
            </main>
        </div>
    )
}

export default Dashboard