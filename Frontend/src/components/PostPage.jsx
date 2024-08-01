import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import CallToAction from './CallToAction';
import CommentSection from './CommentSection';
import PostCard from './PostCard';

function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentPosts, setRecentPosts] = useState();

    const shufflePosts = (post) => {
        for (let i = post.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [post[i], post[j]] = [post[j], post[i]];
        }
        return post;
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
            try {
                const res = await fetch(`/api/post/get-posts?limit=5`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch recent posts.');
                    return;
                }

                if (res.ok) {
                    const posts = data.posts.filter(recentPost => recentPost.slug !== slug);
                    setRecentPosts(shufflePosts(posts));                }

            } catch (error) {
                toast.error(error.message || 'Failed to fetch recent posts.');
            }
        }

        fetchRecentPosts();
    }, [slug]);

    if (loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>
    )

    if (!post) return (
        <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-bold">Post Not Found</h1>
        </div>
    )

    return (
        <main className='flex flex-col min-h-screen items-center my-8 p-3 mx-auto max-w-6xl bg-slate-200 dark:bg-slate-800 rounded-md'>
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
                    className='mt-10 w-full p-3 object-cover max-h-[600px]'
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

            <div className='flex flex-col justify-center items-center mb-5 w-full max-w-5xl overflow-hidden'>
                <h1 className='text-xl font-semibold mb-5'>
                    Recent Articles
                </h1>

                <div className='flex flex-wrap overflow-x-auto gap-5 mt-5 items-center justify-center max-w-5xl'>
                    {
                        recentPosts && recentPosts.map((recentPost) => (
                            <PostCard key={recentPost._id} post={recentPost} />
                        ))
                    }
                </div>
            </div>

        </main>
    )
}

export default PostPage

