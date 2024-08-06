import { Button, Label, Spinner, Textarea, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Contact = () => {
    const { currentUser } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            return toast.error('You must be logged in to submit the form');
        }

        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            return toast.error('All Fields are Required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(formData.email).toLowerCase())) {
            return toast.error('Invalid Email format');
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(String(formData.phone))) {
            return toast.error('Phone number must be 10 digits long');
        }

        if (message.length > 300) {
            return toast.error('Message should not exceed 300 characters');
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/contact/contact-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to submit the form.');
            } else {
                toast.success('Form submitted successfully');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                });
            }

        } catch (error) {
            toast.error('Failed to submit the form. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='max-w-4xl mx-auto my-16 px-3'>
            <h1 className='text-center text-3xl font-bold mb-10'>Contact Us</h1>
            <form className='flex flex-col max-w-3xl mx-auto gap-5 bg-slate-200 dark:bg-slate-800 p-3 max-sm:py-5 sm:p-10 rounded-lg shadow-lg' onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <TextInput
                        type='text'
                        id='name'
                        placeholder='Enter your name'
                        className='mt-1'
                        onChange={handleChange}
                        value={formData.name}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <TextInput
                        type='text'
                        id='email'
                        placeholder='example@company.com'
                        className='mt-1'
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <TextInput
                        type='text'
                        id='phone'
                        placeholder='Enter your phone number'
                        className='mt-1'
                        onChange={handleChange}
                        value={formData.phone}
                    />
                </div>
                <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id='message'
                        placeholder='Type your message here'
                        className='mt-1 h-32'
                        onChange={handleChange}
                        value={formData.message}
                    />
                    <p className='max-sm:text-xs text-md text-gray-500 mt-3'>
                        {300 - formData.message.length} characters remaining...
                    </p>
                </div>
                <div className='flex justify-center'>
                    <Button
                        className='px-5'
                        type='submit'
                        gradientMonochrome='cyan'
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
                                        Submit
                                    </span>)
                        }
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Contact