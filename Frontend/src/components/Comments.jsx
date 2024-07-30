import { Button, Textarea } from 'flowbite-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Comments = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment) {
            toast.error('Please enter a comment');
            return;
        }

        if (comment.length > 300) {
            toast.error('Comment must be less than 300 characters');
            return;
        }

        try {
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId,
                    content: comment,
                    userId: currentUser._id,
                }),
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to add comment. Please try again later');
                return;
            }

            if (res.ok) {
                toast.success('Comment added successfully');
                setComment('');
            }
        } catch (error) {
            toast.error('Failed to add comment. Please try again later');
        }

    }

    return (
        <div className='max-w-4xl mx-auto w-full'>
            {currentUser ? (
                <div className='flex items-center gap-3 w-full p-5 border border-slate-500 rounded-xl'>
                    <img
                        src={currentUser.profilePic}
                        alt='avatar'
                        className='w-12 h-12 rounded-full object-cover'
                    />
                    <div className='w-full'>
                        <div className='mb-2 font-medium text-md'>
                            <Link to={`/profile/${currentUser._id}`} className='hover:underline hover:underline-offset-2' >
                                @{currentUser.username}
                            </Link>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <Textarea
                                placeholder='Write a comment...'
                                rows={3}
                                className='w-full'
                                maxLength='300'
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                            />
                            <div className='flex justify-between items-center mt-5'>
                                <p className='max-sm:text-xs text-md text-gray-500'>
                                    {300 - comment.length} characters remaining...
                                </p>
                                <Button
                                    size='sm'
                                    type='submit'
                                    gradientDuoTone='greenToBlue'
                                >
                                    Comment
                                </Button>
                            </div>
                        </form>
                    </div>



                </div>
            ) : (
                <div className='flex text-md gap-3 font-medium p-3'>
                    <p className=''>You must login to leave a comment.</p>
                    <Link to={'/login'} className='hover:underline hover:underline-offset-2 text-blue-500'>
                        Login
                    </Link>
                </div>
            )

            }
        </div>
    )
}

export default Comments