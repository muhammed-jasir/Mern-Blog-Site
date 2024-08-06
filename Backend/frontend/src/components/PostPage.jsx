import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import CallToAction from './CallToAction';
import CommentSection from './CommentSection';
import PostCard from './PostCard';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingRecentPosts, setLoadingRecentPosts] = useState(false);
    const [recentPosts, setRecentPosts] = useState();
    const elementRef = useRef(null);

    const shufflePosts = (posts) => {
        const shuffledPosts = [...posts];
        for (let i = shuffledPosts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]];
        }
        return shuffledPosts;
    };

    useEffect(() => {
        const FetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/get-posts?slug=${slug}`);
                const data = await res.json();
                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch post.');
                    return;
                }

                if (res.ok) {
                    setPost(data.posts[0]);
                }

            } catch (error) {
                toast.error(error.message || 'Failed to fetch post.');
            } finally {
                setLoading(false);
            }
        }

        FetchPost();
    }, [slug]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            setLoadingRecentPosts(true);
            try {
                const res = await fetch(`/api/post/get-posts?limit=7`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch recent posts.');
                    return;
                }

                if (res.ok) {
                    const posts = data.posts.filter(recentPost => recentPost.slug !== slug);
                    setRecentPosts(shufflePosts(posts));
                }

            } catch (error) {
                toast.error(error.message || 'Failed to fetch recent posts.');
            } finally {
                setLoadingRecentPosts(false);
            }
        }

        fetchRecentPosts();
    }, [slug]);

    const sliderLeft = (element) => {
        element.scrollLeft -= 500;
    };

    const sliderRight = (element) => {
        element.scrollLeft += 500;
    };

    return (
        <main className='flex flex-col min-h-screen items-center my-8 p-3 mx-auto max-w-6xl bg-slate-200 dark:bg-slate-800 rounded-md'>
            {loading ? (
                <div className='flex justify-center items-center min-h-screen'>
                    <Spinner size='xl' />
                </div>
            ) : post === null ? (
                <div className='flex justify-center items-center mt-5'>
                    <h1 className="text-2xl font-bold">Post Not Found</h1>
                </div>
            ) : (
                <>
                    <h1 className='font-bold text-3xl leading-normal mt-5 font-sans text-center max-w-2xl mx-auto lg:text-4xl lg:leading-relaxed'>
                        {post.title}
                    </h1>

                    <Link to={`/search?category=${post.category}`}>
                        <Button
                            pill
                            outline
                            color='gray'
                            className='mt-10'
                            size='md'
                        >
                            {post.category}
                        </Button>
                    </Link>

                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.title}
                            className='mt-10 w-full p-3 sm:object-cover h-[225px] sm:max-h-[600px] rounded-md'
                        />
                    )}

                    <div className='flex justify-between w-full mx-auto p-3 border-b border-b-slate-500'>
                        <span className='text-sm'>{new Date(post.updatedAt).toLocaleDateString()}</span>
                        <span className='text-sm'>{(post.content.length / 1000).toFixed(1)} mins read</span>
                    </div>

                    <div className='mt-10 w-full text-center mx-auto border-b border-b-slate-500'>
                        <p className='font-semibold text-lg mb-10 max-w-3xl mx-auto'>
                            {post.description}
                        </p>
                    </div>

                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className='mt-10 p-3 w-full mx-auto max-w-3xl post-content'
                    >
                    </div>

                    <div className='max-w-5xl mx-auto w-full'>
                        <CallToAction />
                    </div>

                    <CommentSection postId={post._id} />

                    <div className='relative flex flex-col mb-5 w-full mx-auto max-w-5xl'>
                        <h1 className='text-2xl sm:text-4xl font-semibold mb-5 text-center'>
                            Recent Posts
                        </h1>

                        <IoChevronBackOutline
                            className={`hidden md:flex text-gray-700 dark:text-white text-[30px] absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
                            onClick={() => sliderLeft(elementRef.current)}
                        />

                        <div className='flex overflow-x-auto gap-6 pb-4 mx-3 scrollbar-hide scroll-smooth' ref={elementRef}>
                            {loadingRecentPosts ? (
                                <div className="flex justify-center items-center min-h-screen">
                                    <Spinner size="xl" />
                                </div>
                            ) : recentPosts.length > 0 ? (
                                recentPosts.map((recentPost) => (
                                    <div key={recentPost._id} className='flex-shrink-0 w-80'>
                                        <PostCard post={recentPost} />
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center w-full py-4">
                                    <p>No recent posts available.</p>
                                </div>
                            )}
                        </div>

                        <IoChevronForwardOutline
                            className={`hidden md:flex text-gray-700 dark:text-white z-10 right-[-20px] top-1/2 transform -translate-y-1/2 text-[30px] absolute cursor-pointer `}
                            onClick={() => sliderRight(elementRef.current)}
                        />
                    </div>
                </>
            )}
        </main>
    )
}

export default PostPage