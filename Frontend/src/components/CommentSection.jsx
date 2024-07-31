import { Button, Textarea, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Comments from './Comments';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment) {
            toast.error('Please enter a comment');
            return;
        }

        if (comment.length > 300) {
            toast.error('Comment must be less than or equal 300 characters');
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
                setComments([data, ...comments])
            }
        } catch (error) {
            toast.error('Failed to add comment. Please try again later');
        }

    }

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/comment/get-comments/${postId}`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch comments. Please try again later');
                    return;
                }

                if (res.ok) {
                    setComments(data);
                    if (data.length < 5) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                toast.error('Failed to fetch comments. Please try again later');
            } finally {
                setLoading(false);
            }
        }
        fetchComments();
    }, [postId]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/get-comments/${postId}?startIndex=${startIndex}`);
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to fetch more comments.');
                return;
            }

            if (res.ok) {
                setComments((prevComments) => [...prevComments, ...data]);
                if (data.length < 5) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch more comments.');
        }
    };

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/login');
                toast.error('Please sign in to like a comment.');
                return;
            }

            const res = await fetch(`/api/comment/like-comment/${commentId}`,
                {
                    method: 'PUT',
                }
            );
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to like comment. Please try again later.');
                return;
            }

            if (res.ok) {
                setComments(comments.map(comment =>
                    comment._id === commentId ? { ...comment, likes: data.likes, numberOfLikes: data.numberOfLikes } : comment
                ));
            }

        } catch (error) {
            toast.error('Failed to like comment. Please try again later.');
        }
    };

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((com) => 
                com._id === comment._id ? { ...com, content: editedContent } : com
            )
        );
    };

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
            )}
            <div className='my-10 w-full max-w-4xl mx-auto'>
                {loading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <Spinner size="xl" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className='flex items-center justify-center font-semibold text-lg'>
                        <p className='text-gray-500'>
                            No comments yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className='flex items-center gap-2 text-md mb-5 font-semibold'>
                            <p>Comments:</p>
                            <div className='border border-slate-600 py-1 px-2 rounded-sm'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {comments.map((comment, index) => (
                            <div className='w-full'>
                                <Comments
                                    key={index}
                                    comment={comment}
                                    onLike={handleLike}
                                    onEdit={handleEdit}
                                />
                            </div>
                        ))}
                        <div className='mt-5 flex justify-center'>
                            {showMore && (
                                <Button
                                    className='px-5 font-bold'
                                    color='light'
                                    onClick={handleShowMore}
                                >
                                    Show More
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CommentSection