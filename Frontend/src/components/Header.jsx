import { Button, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IoSearchOutline } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";

const Header = () => {
    const path = useLocation().pathname;

    return (
        <header>
            <Navbar className='bg-slate-100 flex items-center justify-between w-full sm:px-10 px-2 py-2 z-10'>
                <Link to='/'>
                    <h2 className='flex items-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
                        <span className='bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-3xl px-2 py-1 pb-2 text-white'>The Blog </span> Spot
                    </h2>
                </Link>

                <div className='hidden lg:flex'>
                    <TextInput
                        type='text'
                        placeholder='Search...'
                        rightIcon={IoSearchOutline}
                        className='w-full'
                    />
                </div>

                <div className='flex gap-4 items-center md:order-2'>

                    <Button
                        className='w-12 h-12 lg:hidden'
                        color='gray'
                        pill
                    >
                        <IoSearchOutline size='23' color="black" />
                    </Button>

                    <Button
                        className='w-12 h-12 hidden sm:inline'
                        color='gray'
                        pill
                    >
                        <FaMoon />
                    </Button>

                    <Link to='/login' className='flex'>
                        <Button
                            gradientDuoTone="greenToBlue"
                        >
                            Login
                        </Button>
                    </Link>
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