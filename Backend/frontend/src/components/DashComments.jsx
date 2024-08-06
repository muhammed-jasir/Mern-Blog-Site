import { Button, Modal, Spinner, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComments = () => {
    const { currentUser } = useSelector(state => state.user);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { theme } = useSelector(state => state.theme)
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const FetchComments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/comment/get-comments`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch comments.');
                    return;
                }

                if (res.ok) {
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }

            } catch (error) {
                toast.error(error.message || 'Failed to fetch comments.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser.isAdmin) {
            FetchComments();
        } else {
            toast.error('You do not have permission to view this page.');
            navigate('/login')
        }

    }, [currentUser._id, navigate]);

    const handleShowMore = async () => {
        setLoadingMore(true);
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/get-comments?startIndex=${startIndex}`);
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to fetch more comments.');
                return;
            }

            if (res.ok) {
                setComments((prevComments) => [...prevComments, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }

        } catch (error) {
            toast.error(error.message || 'Failed to fetch more comments.');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);

        try {
            const res = await fetch(`/api/comment/delete-comment/${commentIdToDelete}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to delete comment.');
                return;
            }

            if (res.ok) {
                toast.success(data.message || 'Comment deleted successfully!');
                setComments((prevComments) => prevComments.filter((comments) => comments._id !== commentIdToDelete));
            }
        } catch (error) {
            toast.error('Failed to delete comment.');
        }
    };

    return (
        <div className='flex justify-center my-10 px-8 md:px-3 max-w-6xl mx-auto'>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner size="xl" />
                </div>
            ) : currentUser.isAdmin ? (
                comments.length > 0 ? (
                    <div className='overflow-hidden'>
                        <div className='overflow-x-auto w-full md:max-w-lg lg:max-w-3xl xl:max-w-5xl scrollbar-hide'>
                        <Table hoverable className='shadow-md text-center bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-300 rounded-lg'>
                            <Table.Head>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Content</Table.HeadCell>
                                <Table.HeadCell>Likes</Table.HeadCell>
                                <Table.HeadCell>PostId</Table.HeadCell>
                                <Table.HeadCell>UserId</Table.HeadCell>
                                <Table.HeadCell>Actions</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className='divide-y divide-gray-400'>
                                {comments.map((comment) => (
                                    <Table.Row key={comment._id}>
                                        <Table.Cell>
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.content}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.postId}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.userId}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex gap-3'>
                                                <Button
                                                    color='failure'
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setCommentIdToDelete(comment._id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    <div className='mt-5 flex justify-center'>
                            {showMore && (
                                <Button
                                    className='px-5 font-bold'
                                    color='light'
                                    onClick={handleShowMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore
                                        ? (
                                            <>
                                                <Spinner size='md' />
                                                <span className='pl-3 text-md'>
                                                    Loading ...
                                                </span>
                                            </>
                                        )
                                        : (
                                            <span className='text-md'>
                                                Show More
                                            </span>)}
                                </Button>
                            )}
                        </div>
                        </div>
                ) : (
                    <div>
                        <h1 className='text-center text-lg font-semibold'>
                            No Comments found.
                        </h1>
                    </div>
                )) : (
                <div className='text-center text-lg font-semibold'>
                    <h1>You do not have permission to view this page.</h1>
                </div>
            )
            }
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
                className=''
            >
                <Modal.Header className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300'}`} />
                <Modal.Body className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300'}`} >
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-2 h-14 w-14 text-red-700" />
                        <h2 className={`mb-2 text-lg font-bold text-gray-800 ${theme === 'dark' && 'text-slate-200'}`}>
                            Are you sure ?
                        </h2>
                        <h3 className={`mb-5 text-lg font-semibold text-gray-800 ${theme === 'dark' && 'text-slate-200'}`}>
                            Do you want to delete this Comment ?
                        </h3>
                        <div className="flex justify-around mb-5">
                            <Button color="failure" onClick={handleDeleteComment}>
                                <span className='text-md font-bold'>Yes, I'm sure</span>
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                <span className='text-md font-bold'>No, cancel</span>
                            </Button>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </div >
    )
}

export default DashComments