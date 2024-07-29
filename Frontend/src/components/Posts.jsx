import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Posts = () => {
    const { currentUser } = useSelector(state => state.user);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { theme } = useSelector(state => state.theme)
    const [postIdToDelete, setPostIdToDelete] = useState('');

    useEffect(() => {
        const FetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch posts.');
                    return;
                }

                if (res.ok) {
                    setPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }

            } catch (error) {
                toast.error(error.message || 'Failed to fetch posts.');
            }
        };

        if (currentUser.isAdmin) {
            FetchPosts();
        } else {
            toast.error('You do not have permission to view this page.');
            navigate('/login')
        }

    }, [currentUser._id, navigate]);

    const handleShowMore = async () => {
        const startIndex = posts.length;
        try {
            const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to fetch more posts.');
                return;
            }

            if (res.ok) {
                setPosts((prevPosts) => [...prevPosts, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }

        } catch (error) {
            toast.error(error.message || 'Failed to fetch more posts.');
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/delete-post/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to delete post.');
                return;
            }

            if (res.ok) {
                toast.success(data.message || 'Post deleted successfully!');
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postIdToDelete));
            }
        } catch (error) {
            toast.error(error.message || 'Failed to delete post.');
        }
    };

    return (
        <div className='flex justify-center my-10 px-8'>
            {currentUser.isAdmin ? (
                posts.length > 0 ? (
                    <div className='overflow-x-auto scrollbar-hide'>
                        <Table hoverable className='shadow-md text-center bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-300 rounded-lg'>
                            <Table.Head>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Image</Table.HeadCell>
                                <Table.HeadCell>Title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Actions</Table.HeadCell>
                            </Table.Head>
                            {posts.map((post) => (
                                <Table.Body key={post._id} className='divide-y'>
                                    <Table.Row>
                                        <Table.Cell>
                                            {new Date(post.updatedAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt='post image'
                                                className='h-16 w-16 object-contain rounded-md'
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {post.title}
                                        </Table.Cell>
                                        <Table.Cell className='capitalize'>
                                            {post.category}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex gap-3'>
                                                <Link to={`/post/${post.slug}`}>
                                                    <Button color='blue'>
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link to={`/update-post/${post._id}`}>
                                                    <Button color='success'>
                                                        Update
                                                    </Button>
                                                </Link>
                                                <Button
                                                    color='failure'
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setPostIdToDelete(post._id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        <div className='mt-5 flex justify-center'>
                            {
                                showMore && (
                                    <Button
                                        className='px-5 font-bold'
                                        color='light'
                                        onClick={handleShowMore}
                                    >
                                        Show More
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>
                            You have no Posts to view. Please create a new post.
                        </h1>
                    </div>
                )) : (
                <div className='text-center'>
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
                            Do you want to delete this Post ?
                        </h3>
                        <div className="flex justify-around mb-5">
                            <Button color="failure" onClick={handleDeletePost}>
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

export default Posts