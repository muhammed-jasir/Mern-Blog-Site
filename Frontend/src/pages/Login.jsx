import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { loginFailure, loginStart, loginSucccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { loading, error: errorMessage } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('All Fields are Required');
            return dispatch(loginFailure('All Fields are Required'));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(formData.email).toLowerCase())) {
            toast.error('Invalid Email format');
            return dispatch(loginFailure('Invalid Email format'));
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return dispatch(loginFailure('Password must be at least 6 characters long'));
        }



        try {
            dispatch(loginStart());

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Login failed. Please try again.');
                return dispatch(loginFailure(data.message || 'Login failed. Please try again.'));
            }

            if (res.ok) {
                toast.success('Login Successful!');
                dispatch(loginSucccess(data));
                navigate("/");
            }

        } catch (error) {
            toast.error('Something went wrong. Please try again.' || error.message);
            dispatch(loginFailure('Something went wrong. Please try again.' || error.message));
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
                            <h2 className='text-2xl font-semibold max-sm:text-2xl text-center'>Login</h2>
                        </div>
                        <div className='mt-5'>
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
                                onClick={() => setShowPassword(prevState => !prevState)}
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
                                            <span className='pl-3 text-lg'>Loading ...</span>
                                        </>
                                    )
                                    : (
                                        <span className='text-lg'>
                                            Login
                                        </span>
                                    )
                            }
                        </Button>

                        <OAuth />

                        <div className='text-center'>
                            <Link to='/sign-up' className='text-blue-600 dark:text-slate-300 hover:underline hover:underline-offset-4'>
                                Dont have an account?
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login