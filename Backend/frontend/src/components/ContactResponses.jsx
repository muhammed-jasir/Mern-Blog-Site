import { Button, Modal, Spinner, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ContactResponses = () => {
    const { currentUser } = useSelector(state => state.user);

    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { theme } = useSelector(state => state.theme)
    const [responseIdToDelete, setResponseIdToDelete] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const FetchResponses = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/contact/get-responses`);
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    toast.error(data.message || 'Failed to fetch responses.');
                    return;
                }

                if (res.ok) {
                    setResponses(data)
                    if (data.length < 9) {
                        setShowMore(false);
                    }
                }

            } catch (error) {
                toast.error('Failed to fetch responses.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser.isAdmin) {
            FetchResponses();
        } else {
            toast.error('You do not have permission to view this page.');
            navigate('/login')
        }

    }, [currentUser._id, navigate]);

    const handleShowMore = async () => {
        setLoadingMore(true);
        const startIndex = responses.length;
        try {
            const res = await fetch(`/api/contact/get-responses?startIndex=${startIndex}`);
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to fetch more responses.');
                return;
            }

            if (res.ok) {
                setResponses((prevResponses) => [...prevResponses, ...data]);
                if (data.length < 9) {
                    setShowMore(false);
                }
            }

        } catch (error) {
            toast.error('Failed to fetch more responses.');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDeleteResponse = async () => {
        setShowModal(false);

        try {
            const res = await fetch(`/api/contact/delete-response/${responseIdToDelete}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to delete response.');
                return;
            }

            if (res.ok) {
                toast.success(data.message || 'Response deleted successfully!');
                setResponses((prevResponses) => prevResponses.filter((responses) => responses._id !== responseIdToDelete));
            }
        } catch (error) {
            toast.error('Failed to delete response.');
        }
    };

    return (
        <div className='flex justify-center px-8 md:px-3 my-10 max-w-6xl mx-auto'>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner size="xl" />
                </div>
            ) : currentUser.isAdmin ? (
                responses.length > 0 ? (
                    <div className='overflow-x-auto w-full md:max-w-lg lg:max-w-3xl xl:max-w-5xl scrollbar-hide'>
                        <Table hoverable className='shadow-md text-center bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-300 rounded-lg'>
                            <Table.Head>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Name</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Phone</Table.HeadCell>
                                <Table.HeadCell>Message</Table.HeadCell>
                                <Table.HeadCell>Actions</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className='divide-y divide-gray-400'>
                                {responses.map((response) => (
                                    <Table.Row key={response._id}>
                                        <Table.Cell>
                                            {new Date(response.createdAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {response.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {response.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {response.phone}
                                        </Table.Cell>
                                        <Table.Cell className='max-w-xs break-words'>
                                            {response.message}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex gap-3'>
                                                <Button
                                                    color='failure'
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setResponseIdToDelete(response._id);
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
                            No Responses found.
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
                            Do you want to delete this Response ?
                        </h3>
                        <div className="flex justify-around mb-5">
                            <Button color="failure" onClick={handleDeleteResponse}>
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

export default ContactResponses;