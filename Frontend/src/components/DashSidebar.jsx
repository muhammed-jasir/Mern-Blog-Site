import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiChartPie, HiLogout, HiUser } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logoutFailure, logoutSuccess } from '../redux/user/userSlice'
import { Link, useLocation } from 'react-router-dom'
import { IoIosCreate } from "react-icons/io";

const DashSidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [tab, setTab] = useState('');
    const theme = useSelector(state => state.theme);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }

    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to Signout')
                dispatch(logoutFailure(error.message || 'Failed to Signout.'));
                return;
            }

            if (res.ok) {
                toast.success(data.message || 'Signed out successfully!');
                dispatch(logoutSuccess());
            }
        } catch (error) {
            toast.error(error.message || 'Failed to Signout')
            dispatch(logoutFailure(error.message || 'Failed to Signout.'));
        }
    }
    return (
        <div className={`w-full md:h-full md:min-w-56 md:min-h-screen ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <Sidebar className={`w-full md:h-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} `}>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item as={Link} to={`/dashboard`} icon={HiChartPie} >
                            Dashboard
                        </Sidebar.Item>

                        <Sidebar.Item as={Link} to={`/dashboard?tab=profile`} active={tab === 'profile'} icon={HiUser} label={'Admin'} labelColor="dark">
                            Profile
                        </Sidebar.Item>

                        <Sidebar.Item as={Link} to={`/dashboard?tab=create-post`} icon={IoIosCreate}>
                            Create Post
                        </Sidebar.Item>

                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item icon={HiLogout} onClick={handleSignout}>
                            Sign Out
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
}

export default DashSidebar