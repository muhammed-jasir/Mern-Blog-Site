import { Button, Table, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashBoardComp = () => {
    const { currentUser } = useSelector(state => state.user);

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await fetch(`/api/user/get-users?limit=5`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch users.');
                    return;
                }

                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }

            } catch (error) {
                toast.error('Failed to fetch users.');
            } finally {
                setLoadingUsers(false);
            }
        };

        const fetchPosts = async () => {
            setLoadingPosts(true)
            try {
                const res = await fetch(`/api/post/get-posts?limit=5`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch posts.');
                    return;
                }

                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }

            } catch (error) {
                toast.error('Failed to fetch posts.');
            } finally {
                setLoadingPosts(false);
            }
        };

        const fetchComments = async () => {
            setLoadingComments(true);
            try {
                const res = await fetch(`/api/comment/get-comments?limit=5`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch comments.');
                    return;
                }

                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }

            } catch (error) {
                toast.error('Failed to fetch comments.');
            } finally {
                setLoadingComments(false);
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        } else {
            toast.error('You do not have permission to view this page.');
            navigate('/login')
        }
    }, [currentUser, navigate]);

    return (
        <div className='p-3 mx-auto'>
            <div className='flex-wrap flex gap-4 justify-center'>
                <div className='flex flex-col p-3 gap-4 w-full bg-slate-200 dark:bg-slate-800 md:w-72 rounded-md shadow-md font-semibold'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h2 className='text-gray-500 text-md uppercase'>
                                Total Users
                            </h2>
                            <p className='text-2xl'>
                                {totalUsers}
                            </p>

                        </div>

                        <HiOutlineUserGroup
                            className='bg-lime-600 text-white rounded-full  shadow-lg text-5xl p-3'
                        />
                    </div>
                    <div className='flex gap-2 text-md'>
                        <span className='flex items-center text-green-500'>
                            <HiArrowUp />
                            {lastMonthUsers}
                        </span>
                        <p className='text-gray-500'>
                            Last Month
                        </p>
                    </div>
                </div>
                <div className='flex flex-col p-3 gap-4 w-full bg-slate-200 dark:bg-slate-800 md:w-72 rounded-md shadow-md font-semibold'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h2 className='text-gray-500 text-md uppercase'>
                                Total Posts
                            </h2>
                            <p className='text-2xl'>
                                {totalPosts}
                            </p>

                        </div>

                        <HiDocumentText
                            className='bg-teal-700 text-white rounded-full  shadow-lg text-5xl p-3'
                        />
                    </div>
                    <div className='flex gap-2 text-md'>
                        <span className='flex items-center text-green-500'>
                            <HiArrowUp />
                            {lastMonthPosts}
                        </span>
                        <p className='text-gray-500'>
                            Last Month
                        </p>
                    </div>
                </div>
                <div className='flex flex-col p-3 gap-4 w-full bg-slate-200 dark:bg-slate-800 md:w-72 rounded-md shadow-md font-semibold'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h2 className='text-gray-500 text-md uppercase'>
                                Total Comments
                            </h2>
                            <p className='text-2xl'>
                                {totalComments}
                            </p>
                        </div>

                        <HiAnnotation
                            className='bg-indigo-600 text-white rounded-full  shadow-lg text-5xl p-3'
                        />
                    </div>
                    <div className='flex gap-2 text-md'>
                        <span className='flex items-center text-green-500'>
                            <HiArrowUp />
                            {lastMonthComments}
                        </span>
                        <p className='text-gray-500'>
                            Last Month
                        </p>
                    </div>
                </div>
            </div>
            <div className='mt-5 flex flex-wrap gap-5 py-5 mx-auto justify-center'>
                <div className='flex flex-col w-full md:w-auto shadow-md rounded-md bg-slate-200 dark:bg-slate-800 overflow-x-auto scrollbar-hide'>
                    <div className='flex justify-between p-3 font-semibold text-md'>
                        <h1 className='text-center p-2'>
                            Recent Users
                        </h1>
                        <Link to={`/dashboard?tab=users`}>
                            <Button
                                className=''
                                gradientDuoTone='greenToBlue'
                                outline
                            >
                                View All
                            </Button>
                        </Link>
                    </div>

                    <Table hoverable className='text-center'>
                        <Table.Head >
                            <Table.HeadCell>Profile</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y divide-gray-400'>
                            {loadingUsers ? (
                                <Table.Row>
                                    <Table.Cell colSpan="3" className='text-center py-10'>
                                        <Spinner size='lg' />
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                users.map((user) => (
                                    <Table.Row key={user._id}>
                                        <Table.Cell>
                                            <img
                                                src={user.profilePic}
                                                alt='avatar'
                                                className='w-10 h-10 object-cover rounded-full bg-gray-500'
                                            />
                                        </Table.Cell>
                                        <Table.Cell className=''>
                                            <p>
                                                {user.username}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell className=''>
                                            <p>
                                                {user.email}
                                            </p>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md rounded-md bg-slate-200 dark:bg-slate-800 overflow-x-auto scrollbar-hide'>
                    <div className='flex justify-between p-3 font-semibold text-md'>
                        <h1 className='text-center p-2'>
                            Recent Comments
                        </h1>
                        <Link to={`/dashboard?tab=comments`}>
                            <Button
                                className=''
                                gradientDuoTone='greenToBlue'
                                outline
                            >
                                View All
                            </Button>
                        </Link>
                    </div>

                    <Table hoverable className='text-center'>
                        <Table.Head>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y divide-gray-400'>
                            {loadingComments ? (
                                <Table.Row>
                                    <Table.Cell colSpan="2" className='text-center py-10'>
                                        <Spinner size='lg' />
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                comments.map((comment) => (
                                    <Table.Row key={comment._id}>
                                        <Table.Cell className='w-96'>
                                            <p className='line-clamp-2'>{comment.content}</p>
                                        </Table.Cell>
                                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md rounded-md bg-slate-200 dark:bg-slate-800 overflow-x-auto scrollbar-hide'>
                    <div className='flex justify-between p-3 font-semibold text-md'>
                        <h1 className='text-center p-2'>
                            Recent Posts
                        </h1>
                        <Link to={`/dashboard?tab=posts`}>
                            <Button
                                className=''
                                gradientDuoTone='greenToBlue'
                                outline
                            >
                                View All
                            </Button>
                        </Link>
                    </div>
                    <Table hoverable className='text-center'>
                        <Table.Head>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y divide-gray-400'>
                            {loadingPosts ? (
                                <Table.Row>
                                    <Table.Cell colSpan="3" className='text-center py-10'>
                                        <Spinner size='lg' />
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                posts.map((post) => (
                                    <Table.Row key={post._id}>
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt='post'
                                                className='w-16 h-14 object-cover rounded-sm bg-gray-500'
                                            />
                                        </Table.Cell>
                                        <Table.Cell className='w-96'>
                                            <p className='line-clamp-2'>
                                                {post.title}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell className='w-5'>
                                            <p className='line-clamp-2'>
                                                {post.category}
                                            </p>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>

        </div>
    )
}

export default DashBoardComp