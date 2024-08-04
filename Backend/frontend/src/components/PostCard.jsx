import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
    return (
        <div className='group relative w-full h-[400px] overflow-hidden border rounded-lg border-teal-500 hover:border-2 transition-all duration-300'>
            <Link to={`/post/${post.slug}`}>
                <img 
                    src={post.image} 
                    alt='post cover' 
                    className='w-full h-[260px] object-cover rounded-md group-hover:h-[200px] transition-all duration-300 z-20' 
                />
            </Link>
            <div className='flex flex-col gap-2 p-3'>
                <h2 className='text-xl font-semibold text-center line-clamp-2'>
                    {post.title}
                </h2>
                <p className='text-center text-md'>
                    {post.category}
                </p>
                <Link 
                    to={`/post/${post.slug}`} 
                    className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 
                        border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all
                        duration-300 text-center py-2 rounded-md m-2 text-lg font-semibold'
                >
                    Read Article
                </Link>

            </div>
        </div>
    )
}

export default PostCard
