import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <section className='flex justify-center items-center m-6 sm:m-12'>
            <div className='bg-slate-100 rounded-xl px-6 py-6 sm:px-12 sm:py-8 flex flex-col w-full max-w-md'>
                <div className='flex justify-center'>
                    <Link to='/' >
                        <h2 className="text-2xl sm:text-3xl font-bold dark:text-white text-center">
                            <span className='bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-3xl px-2 py-1 text-white'>The Blog </span> Spot
                        </h2>
                    </Link>
                </div>
                <div className='mt-6 sm:mt-10'>
                    <form className='flex flex-col gap-4 sm:gap-5'>
                        <div>
                            <h2 className='text-2xl font-semibold max-sm:text-2xl text-center'>Create a new account</h2>
                            <p className='text-center text-md  sm:text-lg'>It's quick and easy.</p>
                        </div>
                        <div className='mt-5'>
                            <Label className='text-md'>Username</Label>
                            <TextInput
                                type='text'
                                placeholder='Username'
                                className='w-full mt-1'
                                sizing='md'

                            />
                        </div>
                        <div>
                            <Label className='text-md'>Email</Label>
                            <TextInput
                                type='email'
                                placeholder='example@company.com'
                                className='w-full mt-1'
                                sizing='md'
                                id='email'
                            />
                        </div>
                        <div>
                            <Label className='text-md'>Password</Label>
                            <TextInput
                                type='password'
                                placeholder='Password'
                                className='w-full mt-1'
                                sizing='md'
                            />
                        </div>

                        <Link to='/login' className='flex'>
                            <Button
                                gradientDuoTone="greenToBlue"
                                className='w-full mt-3'
                            >
                                Sign Up
                            </Button>'
                        </Link>

                        <div className='text-center'>
                            <Link to='/login' className='text-blue-600 hover:underline hover:underline-offset-4'>
                                Already have an account ?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Signup