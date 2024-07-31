import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { toast } from 'react-toastify';

function Comments({ comment }) {
    const [user, setUser] = useState({});
    console.log(user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (!res.ok || data.success === false) {
                    console.error(data.message);
                    return;
                }
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.error(error.message);
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
                <div>
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
                <div className='m-2'>
                    <p>{comment.content}</p>
                </div>
            </div>
        </div>
    )
}

export default Comments