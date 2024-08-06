import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiChartPie, HiDocumentText, HiLogout, HiOutlineMailOpen, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logoutFailure, logoutSuccess } from '../redux/user/userSlice'
import { Link, useLocation } from 'react-router-dom'
import { IoIosCreate } from "react-icons/io";

const DashSidebar = () => {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const [tab, setTab] = useState('');
    const { theme } = useSelector(state => state.theme);

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
        <Sidebar className={`w-full md:h-full md:min-w-60 md:min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-gray-100' : 'bg-slate-200 text-gray-900'}`}>
            <Sidebar.Items className='flex gap-1 md:gap-2 flex-col pt-3 px-1'>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {
                        currentUser && currentUser.isAdmin && (
                            <Sidebar.Item as={Link} to={`/dashboard?tab=dash`} active={tab === 'dash' || !tab} icon={HiChartPie} >
                                Dashboard
                            </Sidebar.Item>
                        )
                    }

                    <Sidebar.Item as={Link} to={`/dashboard?tab=profile`} active={tab === 'profile'} icon={HiUser} label={'Admin'} labelColor="dark">
                        Profile
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to={`/dashboard?tab=create-post`} active={tab === 'create-post'} icon={IoIosCreate}>
                        Create post
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to={`/dashboard?tab=posts`} active={tab === 'posts'} icon={HiDocumentText}>
                        Posts
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to={`/dashboard?tab=users`} active={tab === 'users'} icon={HiOutlineUserGroup}>
                        Users
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to={`/dashboard?tab=comments`} active={tab === 'comments'} icon={HiAnnotation}>
                        Comments
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to={`/dashboard?tab=responses`} active={tab === 'responses'} icon={HiOutlineMailOpen}>
                        Responses
                    </Sidebar.Item>

                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiLogout} onClick={handleSignout}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar
