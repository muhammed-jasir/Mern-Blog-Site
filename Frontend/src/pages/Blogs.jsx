import React, { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import { Spinner, Button } from 'flowbite-react';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';

const Blogs = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/post/get-posts`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch posts.');
                    return;
                }

                if (res.ok) {
                    setPosts(data.posts);
                    if (data.posts.length === 9) {
                        setShowMore(true);
                    } else {
                        setShowMore(false);
                    }
                }

            } catch (error) {
                toast.error('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    const handleShowMore = async () => {
        setLoadingMore(true);
        const startIndex = posts.length;
        try {
            const res = await fetch(`/api/post/get-posts?startIndex=${startIndex}`);
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to fetch more posts.');
                return;
            }

            if (res.ok) {
                setPosts((prevPosts) => [...prevPosts, ...data.posts]);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }

        } catch (error) {
            toast.error(error.message || 'Failed to fetch more posts.');
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className='max-w-6xl mx-auto my-8 flex flex-col'>
            <h1 className='text-center text-3xl font-bold'>
                Blogs
            </h1>

            <div className='my-5'>
                <CallToAction />
            </div>

            {loading ? (
                <div className='flex justify-center items-center min-h-screen p-4'>
                    <Spinner size='xl' />
                </div>
            ) : (
                <div className='max-w-6xl mx-auto px-4 my-8'>
                    {posts && posts.length > 0 && (
                        <div className='flex flex-col'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                                {
                                    posts && posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className='flex justify-center my-5'>
                {
                    showMore && (
                        <Button
                            className='px-5 font-bold'
                            color='light'
                            onClick={handleShowMore}
                            disabled={loadingMore}
                        >
                            {
                                loadingMore
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
                                        </span>)
                            }
                        </Button>
                    )
                }
            </div>
            <div className='my-5'>
                <CallToAction />
            </div>
        </div>
    )
}

export default Blogs