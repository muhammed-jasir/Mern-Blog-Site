import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className='flex flex-col item-center justify-center max-w-6xl mx-auto my-8'>
            <h1 className='text-center text-3xl my-5 font-bold'>
                About Us
            </h1>
            <div className='max-w-4xl mx-auto flex flex-col gap-5 max-sm:p-4  p-6 bg-white dark:bg-slate-800 rounded-lg mt-5 shadow-lg mb-5'>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-2xl font-semibold'>
                        Welcome to The Blog Spot!
                    </h2>
                    <p className='text-gray-700 dark:text-slate-400 text-lg'>
                        Here, you'll find the latest posts, articles, and tutorials on a wide variety of topics. This blog is a labor of love, created and maintained by one passionate individual dedicated to sharing knowledge, insights, and experiences with you.
                    </p>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-2xl font-semibold'>
                        Our Mission
                    </h2>
                    <p className='text-gray-700 dark:text-slate-400 text-lg'>
                        Our mission is to inform, inspire, and engage our audience through high-quality content. We strive to cover a wide range of topics, from technology and lifestyle to health and wellness, ensuring there's something for everyone. We believe in the power of words and aim to create a community where ideas can flourish and discussions can thrive.
                    </p>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-2xl font-semibold'>
                        What You'll Find Here
                    </h2>
                    <ul className='list-disc list-inside text-gray-700 dark:text-slate-400 text-lg'>
                        <li>
                            <span className='font-semibold text-slate-800 dark:text-slate-300'>Latest Posts:</span> Stay updated with the most recent blog entries covering diverse topics.
                        </li>
                        <li>
                            <span className='font-semibold text-slate-800 dark:text-slate-300'>In-Depth Articles:</span> Explore well-researched and thoughtfully written articles.
                        </li>
                        <li>
                            <span className='font-semibold text-slate-800 dark:text-slate-300'>Tutorials:</span> Get practical advice and step-by-step instructions to help you navigate various subjects.
                        </li>
                        <li>
                            <span className='font-semibold text-slate-800 dark:text-slate-300'>Personal Insights:</span> Read about my personal experiences and perspectives.
                        </li>
                    </ul>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-2xl font-semibold'>
                        Join the Discussion
                    </h2>
                    <p className='text-gray-700 dark:text-slate-400 text-lg'>
                        Engage with our community by leaving comments, liking others' contributions, and participating in discussions. We believe in the power of collaboration and learning from one another, fostering an environment where everyone can grow and improve together.
                    </p>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-2xl font-semibold'>
                        Stay Connected
                    </h2>
                    <p className='text-gray-700 dark:text-slate-400 text-lg'>
                        Follow us on social media platform for updates and additional content between blog posts. Stay informed and inspired as we navigate the world of technology and development together.
                    </p>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-2xl font-semibold'>
                        Contact Us
                    </h2>
                    <p className='text-gray-700 dark:text-slate-400 text-lg'>
                        Remember, I'm always here to help. If you have any questions, suggestions, or just want to connect, don't hesitate to reach out. Your engagement makes this blogging journey worthwhile.
                        <br />
                        You can contact us via <Link to='/contact-us' className='text-blue-500 hover:underline hover:underline-offset-4'>contact us</Link>.
                    </p>
                </div>
                <div className='flex flex-col gap-2 text-center text-gray-700 dark:text-slate-400 text-lg mt-2'>
                    <p>
                        Thank you for visiting The Blog Spot. I hope you enjoy your time here and find the content valuable and engaging.
                    </p>
                    <p>
                        Happy reading!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;