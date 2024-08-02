import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoLogoXbox, IoSearchOutline } from "react-icons/io5";
import { BsMoonFill, BsSun } from "react-icons/bs";
import { HiLogout, HiUser, HiViewGrid } from "react-icons/hi";

import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './../redux/theme/themeSlice';
import { logoutFailure, logoutSuccess } from '../redux/user/userSlice';

import { toast } from 'react-toastify';

const Header = () => {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
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
                dispatch(logoutFailure(data.message || 'Failed to Signout.'));
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString(); 
        navigate(`/search?${searchQuery}`);  
    }

    return (
        <header>
            <Navbar className='bg-slate-200 dark:bg-slate-800 flex items-center justify-between w-full sm:px-10 px-2 py-2 z-10'>
                <Link to='/'>
                    <h2 className='flex items-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
                        <span className='bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-3xl px-2 py-1 pb-2 text-white'>The Blog </span> Spot
                    </h2>
                </Link>

                <form className='hidden lg:flex' onSubmit={handleSubmit}>
                    <TextInput
                        type='text'
                        placeholder='Search...'
                        rightIcon={IoSearchOutline}
                        className='w-full'
                        sizing='md'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>

                <div className='flex gap-4 items-center md:order-2'>

                    <Button
                        className='w-10 h-10 lg:hidden'
                        color='gray'
                        pill
                    >
                        <IoSearchOutline size='20' />
                    </Button>

                    <Button
                        className='w-10 h-10 max-sm:hidden'
                        color='gray'
                        pill
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {
                            theme === 'light' ? <BsMoonFill size='20' /> : <BsSun size='20' />
                        }

                    </Button>

                    {
                        currentUser
                            ? (
                                <Dropdown
                                    arrowIcon={false}
                                    inline
                                    label={
                                        <Avatar
                                            img={currentUser.profilePic}
                                            alt='user'
                                            rounded
                                        />
                                    }
                                >
                                    <Dropdown.Header>
                                        <span className='block text-md font-bold mb-1'>{currentUser.username}</span>
                                        <span className='block text-sm font-semibold truncate'>{currentUser.email}</span>
                                    </Dropdown.Header>

                                    {currentUser && currentUser.isAdmin &&
                                        <Link to='/dashboard?tab=dash'>
                                            <Dropdown.Item icon={HiViewGrid}>
                                                <span className='font-semibold'>Dashboard</span>
                                            </Dropdown.Item>
                                        </Link>
                                    }

                                    <Link to={currentUser.isAdmin ? '/dashboard?tab=profile' : '/profile'}>
                                        <Dropdown.Item icon={HiUser}>
                                            <span className='font-semibold'>Profile</span>
                                        </Dropdown.Item>
                                    </Link>

                                    <Dropdown.Divider />
                                    <Dropdown.Item icon={HiLogout} onClick={handleSignout}>
                                        <span className='font-semibold'>Sign Out</span>
                                    </Dropdown.Item>
                                </Dropdown>
                            )
                            : (
                                <Link to='/login' className='flex'>
                                    <Button
                                        gradientDuoTone="greenToBlue"
                                    >
                                        Login
                                    </Button>
                                </Link>
                            )
                    }


                    <NavbarToggle />
                </div>

                <NavbarCollapse>
                    <NavbarLink as={Link} to="/" active={path === '/'}>
                        Home
                    </NavbarLink>
                    <NavbarLink as={Link} to="/about" active={path === '/about'}>
                        About
                    </NavbarLink>
                    <NavbarLink as={Link} to="/projects" active={path === '/projects'}>
                        Projects
                    </NavbarLink>
                    <NavbarLink as={Link} to="/contact" active={path === '/contact'}>
                        Contact
                    </NavbarLink>
                </NavbarCollapse>
            </Navbar>
        </header>
    )
}

export default Header