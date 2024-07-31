import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { toast } from 'react-toastify';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';

function Comments({ comment, onLike }) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch user information');
                    return;
                }
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                toast.error('Failed to fetch user information');
            }
        }

        getUser();
    }, [comment]);

    return (
        <div className='flex item-center gap-3 w-full p-5 border border-slate-500 rounded-md mb-3'>
            <div className='flex-shrink-0'>
                <img
                    src={user.profilePic}
                    alt='profile'
                    className='w-12 h-12 rounded-full object-cover'
                />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span
                        className='me-2 font-bold text-sm truncate'
                    >
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span
                        className='font-normal text-sm'
                    >
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <div className='mb-2'>
                    <p>{comment.content}</p>
                </div>
                <div className='flex items-center border-t border-t-slate-400 pt-3 gap-2'>
                    <button 
                        type='button' 
                        onClick={() => onLike(comment._id)}
                        className={`text-sm text-gray-400 hover:text-blue-600 ${
                            currentUser && comment.likes.includes(currentUser._id) && '!text-blue-600'  
                        }`}
                    >
                        <FaThumbsUp  className='text-sm'/>
                    </button>
                    <p className='text-gray-400 text-sm'>
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1? "like" : "likes")
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Comments