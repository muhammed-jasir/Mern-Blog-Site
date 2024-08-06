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
        <div className='px-4 md:px-8 lg:px-16'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center py-10 gap-8'>
                <div className='flex flex-col gap-6'>
                    <h1 className='text-4xl font-bold text-center md:text-left leading-normal'>
                        Welcome to My Blog Website
                    </h1>
                    <p className='text-lg font-medium text-gray-500 text-center md:text-left'>
                        Here you will find the latest posts, articles, and tutorials on wide variety of topics. Feel free to explore and share your
                        thoughts and opinions. Remember, we are always here to help.
                    </p>
                    <Link to='/search' className='flex justify-center md:justify-start mt-3'>
                        <Button
                            outline
                            gradientDuoTone='greenToBlue'
                            className=''
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
                <div className='flex justify-center w-full'>
                    <img
                        src="https://careforlifecharitabletrust.org/wp-content/uploads/2020/02/blog2-1.png"
                        alt="Welcome"
                        className="rounded-lg sm:shadow-lg sm:bg-slate-400 object-cover max-w-sm max-sm:p-3"
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
                <div className='max-w-6xl mx-auto px-2 sm:px-4 my-8'>
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