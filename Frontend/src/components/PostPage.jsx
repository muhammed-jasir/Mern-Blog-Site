import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import CallToAction from './CallToAction';

function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);

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
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        FetchPost();
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
        <main className='flex flex-col min-h-screen items-center my-8 p-3 mx-auto max-w-6xl bg-slate-200 dark:bg-slate-800'>
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

            <CallToAction />

        </main>
    )
}

export default PostPage