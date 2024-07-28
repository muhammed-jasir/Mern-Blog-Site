import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Posts = () => {
    const { currentUser } = useSelector(state => state.user);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const FetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
                const data = await res.json();
                console.log(data);

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
                console.log(error);
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

    return (
        <div className='flex justify-center my-10 px-8'>
            {currentUser.isAdmin ? (
                posts.length > 0 ? (
                    <div className='overflow-x-auto scrollbar-hide'>
                        <Table hoverable className='shadow-md text-center bg-slate-300 text-slate-900 dark:bg-slate-800 dark:text-slate-300 rounded-lg'>
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
                                                className='h-16 w-16 object-cover rounded-md'
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {post.title}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {post.category}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex gap-3'>
                                                <Link to={`/post/${post.slug}`}>
                                                    <Button color='blue'>
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link to={`/post/${post.slug}`}>
                                                    <Button color='success'>
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button color='failure'>
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
                        <Link to={'/dashboard?tab=create-post'}>
                            <Button>
                                Create a new post
                            </Button>
                        </Link>
                    </div>
                )) : (
                <div className='text-center'>
                    <h1>You do not have permission to view this page.</h1>
                </div>
            )
            }
        </div >
    )
}

export default Posts