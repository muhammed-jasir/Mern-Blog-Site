import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const shufflePosts = (posts) => {
        const shuffledPosts = [...posts];
        for (let i = shuffledPosts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]];
        }
        return shuffledPosts;
    };

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
                    setPosts(shufflePosts(data.posts));
                }

            } catch (error) {
                toast.error('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <div className=''>
            <div className='flex flex-col md:flex-row py-10'>
                <div className='w-full md:w-1/2 gap-6 p-10 sm:p-20'>
                    <h1 className='text-4xl font-bold max-sm:text-center md:whitespace-nowrap leading-normal'>
                        Welcome to My Blog Website
                    </h1>
                    <p className='text-md sm:text-lg my-8 font-medium text-gray-500 text-center md:text-left'>
                        Here you will find the latest posts, articles, and tutorials on wide variety of topics. Feel free to explore and share your
                        thoughts and opinions. Remember, we are always here to help.
                    </p>
                    <Link to='/search'>
                        <Button
                            outline
                            gradientDuoTone='greenToBlue'
                            className='max-sm:mx-auto md:text-left'
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
                <div className='w-full md:w-1/2 mt-8 md:mt-0 p-3 md:p-10 md:me-5'>
                    <img
                        src="https://careforlifecharitabletrust.org/wp-content/uploads/2020/02/blog2-1.png"
                        alt="Welcome"
                        className="rounded shadow-lg bg-slate-400"
                    />
                </div>
            </div>

            <div className='max-w-6xl mx-auto'>
                <CallToAction />
            </div>

            {loading ? (
                <div className='flex justify-center items-center min-h-screen'>
                    <Spinner size='xl' />
                </div>
            ) : (
                <div className='max-w-6xl mx-auto px-4 my-8'>
                    {posts && posts.length > 0 && (
                        <div className='flex flex-col'>
                            <h1 className='text-2xl sm:text-4xl text-center font-semibold mb-8'>
                                Recent Articles
                            </h1>
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

            <Link
                to='/blogs'
                className='flex justify-center mb-8'
            >
                <Button
                    color='light'
                >
                    View All
                </Button>
            </Link>

            <div className='max-w-6xl mx-auto'>
                <CallToAction />
            </div>
        </div>
    )
}

export default Home