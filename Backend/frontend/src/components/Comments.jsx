import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { toast } from 'react-toastify';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

function Comments({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

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

    const handleEdit = async () => {
        setIsEditing(true);
    }

    const handleSave = async () => {
        if (editedContent.length > 300) {
            toast.error('Content must be less than or equal to 300 characters');
            return
        }

        try {
            const res = await fetch(`/api/comment/edit-comment/${comment._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editedContent,
                    }),
                }
            );
            const data = await res.json();

            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
                toast.success('Comment edited successfully!');
            } else {
                toast.error(data.message || 'Failed to edit comment');
            }
        } catch (error) {
            toast.error('Failed to edit comment');
        }
    }

    return (
        <div className='flex item-center gap-2 sm:gap-5 w-full p-3 sm:p-5 border border-slate-500 rounded-xl mb-3 overflow-hidden bg-slate-200 dark:bg-slate-800'>
            <div className='flex-shrink-0'>
                <img
                    src={user.profilePic}
                    alt='profile'
                    className='w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover'
                />
            </div>
            <div className='flex-1 w-full'>
                <div className='flex items-center mb-2'>
                    <span
                        className='me-2 font-bold text-sm sm:text-md truncate'
                    >
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span
                        className='font-normal text-xs sm:text-sm'
                    >
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                            value={editedContent}
                            placeholder='Edit your comment...'
                            onChange={(e) => setEditedContent(e.target.value)}
                            className='mb-3 h-20 sm:h-24'
                        />
                        <div className='flex justify-between'>
                            <p className='text-xs sm:text-md text-gray-500'>
                                {300 - editedContent.length} characters remaining...
                            </p>
                            <div className='flex justify-end gap-3 mb-3'>
                                <Button
                                    gradientDuoTone='greenToBlue'
                                    size='sm'
                                    type='button'
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    gradientDuoTone='greenToBlue'
                                    size='sm'
                                    type='button'
                                    outline
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='mb-3 break-words'>
                        <p className=''>{comment.content}</p>
                    </div>
                )}
                <div className='flex items-center border-t border-t-slate-400 pt-3 gap-3'>
                    <button
                        type='button'
                        onClick={() => onLike(comment._id)}
                        className={`text-sm text-gray-500 hover:text-blue-600 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-600'
                            }`}
                    >
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <p className='text-gray-500 text-sm font-semibold'>
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                        }
                    </p>
                    {
                        currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                            !isEditing && (
                                <button
                                    type='button'
                                    onClick={handleEdit}
                                    className='text-sm font-semibold text-green-500 hover:text-green-700'
                                >
                                    Edit
                                </button>
                            )
                        )
                    }

                    <button
                        type='button'
                        onClick={() => onDelete(comment._id)}
                        className='text-sm font-semibold text-red-500 hover:text-red-700'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Comments