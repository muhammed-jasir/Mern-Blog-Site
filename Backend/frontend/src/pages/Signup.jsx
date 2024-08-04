import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            return toast.error('All Fields are Required');
        }

        if (formData.username.length < 3 || formData.username.length > 20) {
            return toast.error('Username must be between 3 and 20 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(formData.email).toLowerCase())) {
            return toast.error('Invalid Email format');
        }

        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters long');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]?)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            return toast.error('Password must contain at least one uppercase letter, one lowercase letter, one digit.');
        };


        try {
            setLoading(true);

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            const data = await res.json();

            if (!res.ok || data.success == false) {
                setLoading(false);
                return toast.error(data.message || 'Signup failed. Please try again.');
            }

            if (res.ok) {
                toast.success('Signup Successful!');
                navigate("/login");
            }

        } catch (error) {
            toast.error('Something went wrong. Please try again.' || error.message);
        }  finally {
            setLoading(false);
        }
    };

    return (
        <section className='flex justify-center items-center m-6 sm:m-12'>
            <div className='bg-slate-200 dark:bg-slate-800 rounded-xl px-6 py-6 sm:px-12 sm:py-8 flex flex-col w-full max-w-md'>
                <div className='flex justify-center'>
                    <Link to='/' >
                        <h2 className="text-2xl sm:text-3xl font-bold dark:text-white text-center">
                            <span className='bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-3xl px-2 py-1 text-white'>The Blog </span> Spot
                        </h2>
                    </Link>
                </div>
                <div className='mt-6 sm:mt-10'>
                    <form className='flex flex-col gap-4 sm:gap-5' onSubmit={handleSubmit}>
                        <div>
                            <h2 className='text-2xl font-semibold max-sm:text-2xl text-center'>Create a new account</h2>
                            <p className='text-center text-md  sm:text-lg'>It's quick and easy.</p>
                        </div>
                        <div className='mt-5'>
                            <Label className='text-md' htmlFor='username'>Username</Label>
                            <TextInput
                                type='text'
                                placeholder='Username'
                                className='w-full mt-1'
                                sizing='md'
                                id='username'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label className='text-md' htmlFor='email'>Email</Label>
                            <TextInput
                                type='text'
                                placeholder='example@company.com'
                                className='w-full mt-1'
                                sizing='md'
                                id='email'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='relative'>
                            <Label className='text-md' htmlFor='password'>Password</Label>
                            <TextInput
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                className='w-full mt-1'
                                sizing='md'
                                id='password'
                                onChange={handleChange}
                            />
                            <span
                                className='absolute right-3 top-10 cursor-pointer text-xl text-slate-800 dark:text-slate-300'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <Button
                            gradientDuoTone="greenToBlue"
                            className='w-full mt-3'
                            type='submit'
                            disabled={loading}
                        >
                            {
                                loading
                                    ? (
                                        <>
                                            <Spinner size='md' />
                                            <span className='pl-3 text-lg'>
                                                Loading ...
                                            </span>
                                        </>
                                    )
                                    : (
                                        <span className='text-lg'>
                                            Sign Up
                                        </span>)
                            }
                        </Button>

                        <OAuth />

                        <div className='text-center'>
                            <Link to='/login' className='text-blue-600 dark:text-slate-300 hover:underline hover:underline-offset-4'>
                                Already have an account?
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </section>
    )
}

export default Signup