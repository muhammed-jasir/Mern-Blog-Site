import { Button, Modal, Spinner, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from 'react-icons/fa';

const Users = () => {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { theme } = useSelector(state => state.theme)
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const FetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/user/get-users`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch users.');
                    return;
                }

                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }

            } catch (error) {
                toast.error(error.message || 'Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser.isAdmin) {
            FetchUsers();
        } else {
            toast.error('You do not have permission to view this page.');
            navigate('/login')
        }

    }, [currentUser._id, navigate]);

    const handleShowMore = async () => {
        setLoadingMore(true);
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/post/get-users?startIndex=${startIndex}`);
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to fetch more users.');
                return;
            }

            if (res.ok) {
                setUsers((prevUsers) => [...prevUsers, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }

        } catch (error) {
            toast.error(error.message || 'Failed to fetch more users.');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);

        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to delete user.');
                return;
            }

            if (res.ok) {
                toast.success(data.message || 'User deleted successfully!');
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToDelete));
            }
        } catch (error) {
            toast.error(error.message || 'Failed to delete user.');
        }
    };

    return (
        <div className='flex justify-center my-10 px-8'>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner size="xl" />
                </div>
            ) : currentUser.isAdmin ? (
                users.length > 0 ? (
                    <div className='overflow-x-auto scrollbar-hide'>
                        <Table hoverable className='shadow-md text-center bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-300 rounded-lg'>
                            <Table.Head>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Actions</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className='divide-y divide-gray-400'>
                                {users.map((user) => (
                                    <Table.Row key={user._id}>
                                        <Table.Cell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <img
                                                src={user.profilePic}
                                                alt='user'
                                                className='max-sm:h-10 h-16 w-16 object-cover rounded-full bg-gray-500'
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.username}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.isAdmin ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex gap-3'>
                                                <Button
                                                    color='failure'
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setUserIdToDelete(user._id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <div className='mt-5 flex justify-center'>
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
                    </div>
                ) : (
                    <div>
                        <h1>
                            No users found.
                        </h1>
                    </div>
                )) : (
                <div className='text-center'>
                    <h1>You do not have permission to view this page.</h1>
                </div>
            )
            }
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
                className=''
            >
                <Modal.Header className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300'}`} />
                <Modal.Body className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300'}`} >
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-2 h-14 w-14 text-red-700" />
                        <h2 className={`mb-2 text-lg font-bold text-gray-800 ${theme === 'dark' && 'text-slate-200'}`}>
                            Are you sure ?
                        </h2>
                        <h3 className={`mb-5 text-lg font-semibold text-gray-800 ${theme === 'dark' && 'text-slate-200'}`}>
                            Do you want to delete this User ?
                        </h3>
                        <div className="flex justify-around mb-5">
                            <Button color="failure" onClick={handleDeleteUser}>
                                <span className='text-md font-bold'>Yes, I'm sure</span>
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                <span className='text-md font-bold'>No, cancel</span>
                            </Button>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </div >
    )
}

export default Users