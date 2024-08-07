import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import { toast } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { HiOutlineExclamationCircle } from "react-icons/hi";

import { deleteFailure, deleteStart, deleteSuccess, logoutFailure, logoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const Profile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useSelector(state => state.theme);
    const { loading } = useSelector(state => state.user)

    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const imagePickerRef = useRef(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size <= 2 * 1024 * 1024) {
                setImageFile(file);
                setImageUrl(URL.createObjectURL(file));
            } else {
                toast.error(`Please select an image file smaller than 2MB.`);
            }
        } else {
            toast.error('Please select a valid image file.');
        }

    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        try {
            setImageUploading(true);
            const storage = getStorage(app);
            const imgName = new Date().getTime() + imageFile.name;
            const storageRef = ref(storage, imgName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    toast.error('Error uploading image. Please try again.');

                    setImageUploadProgress(null);
                    setImageFile(null);
                    setImageUrl(null);
                    setImageUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            setImageUrl(downloadURL);
                            setImageUploadProgress(null);
                            setFormData({ ...formData, profilePic: downloadURL });
                            setImageUploading(false);
                        })
                }
            );
        } catch (error) {
            toast.error('Error uploading image. Please try again.');

            setImageUploadProgress(null);
            setImageFile(null);
            setImageUrl(null);
            setImageUploading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(formData).length === 0) {
            toast.error('No changes detected. Please make some changes to update your profile.');
            return;
        }

        if (imageUploading) {
            toast.error('Please wait while the image is being uploaded.');
            return;
        }

        if (formData.username === '') {
            toast.error('Username is required.');
            return;
        }

        if (formData.email === '') {
            toast.error('Email is required.');
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to update profile.');
                dispatch(updateFailure(data.message || 'Failed to update profile.'));
                return;
            } else {
                toast.success('Profile updated successfully!');
                dispatch(updateSuccess(data));
            }

        } catch (error) {
            toast.error(error.message || 'Failed to update profile.');
            dispatch(updateFailure(error.message || 'Failed to update profile.'));
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to delete user.');
                dispatch(deleteFailure(data.message || 'Failed to delete user.'));
                return;
            } else {
                toast.success(data.message || 'User deleted successfully!');
                dispatch(deleteSuccess(data));
            }

        } catch (error) {
            toast.error(error.message || 'Failed to delete user.');
            dispatch(deleteFailure(error.message || 'Failed to delete user.'));
        }
    }

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to Signout')
                dispatch(logoutFailure(data.message || 'Failed to Signout.'));
                return;
            }

            if (res.ok) {
                toast.success(data.message || 'Signed out successfully!');
                dispatch(logoutSuccess());
            }
        } catch (error) {
            toast.error(error.message || 'Failed to Signout')
            dispatch(logoutFailure(error.message || 'Failed to Signout.'));
        }
    }

    return (
        <div className='flex flex-col items-center mt-5 mb-10 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl mt-5 mb-8 font-semibold'>Profile</h1>
            <div className='bg-slate-200 dark:bg-slate-800 px-4 sm:px-8 py-8 max-w-lg lg:max-w-xl w-full rounded-lg shadow-lg'>
                <form className='flex flex-col items-center justify-center gap-5 w-full' onSubmit={handleSubmit}>
                    <div className='relative flex cursor-pointer w-full justify-center'>
                        <img
                            src={imageUrl || currentUser.profilePic}
                            alt='profile pic'
                            className={`
                                        rounded-full border-8 border-slate-300 dark:border-slate-300 object-cover h-32 w-32
                                        ${imageUploadProgress && imageUploadProgress < 100 && 'opacity-60'}
                                    `}
                            onClick={() => imagePickerRef.current.click()}
                        />
                        {
                            imageUploadProgress && (
                                <CircularProgressbar
                                    value={imageUploadProgress || 0}
                                    text={`${imageUploadProgress}%`}
                                    strokeWidth={5}
                                    styles={
                                        {
                                            root: {
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                            },
                                            path: {
                                                stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                                                strokeLinecap: 'round',
                                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                            },
                                            text: {
                                                fill: '#ffff',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                            },
                                        }
                                    }
                                />
                            )
                        }
                    </div>
                    <div className='mt-3 w-full hidden'>
                        <input
                            type='file'
                            accept='image/*'
                            ref={imagePickerRef}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className='mt-3 w-full'>
                        <Label className='text-md' htmlFor='username'>Username</Label>
                        <TextInput
                            type='text'
                            placeholder='Username'
                            className='mt-1'
                            sizing='md'
                            id='username'
                            defaultValue={currentUser.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='w-full'>
                        <Label className='text-md' htmlFor='email'>Email</Label>
                        <TextInput
                            type='text'
                            placeholder='example@company.com'
                            className='mt-1'
                            sizing='md'
                            id='email'
                            defaultValue={currentUser.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='w-full relative'>
                        <Label className='text-md' htmlFor='password'>Password</Label>
                        <TextInput
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            className='mt-1'
                            sizing='md'
                            id='password'
                            onChange={handleChange}
                        />
                        <span
                            className='absolute right-3 top-10 cursor-pointer text-xl text-slate-800 dark:text-slate-300'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <Button
                        gradientDuoTone="greenToBlue"
                        className='w-full mt-3'
                        type='submit'
                        outline
                        disabled={loading || imageUploading}
                    >
                        {
                            loading
                                ? (
                                    <>
                                        <Spinner size='md' />
                                        <span className='pl-3 text-lg'>Loading ...</span>
                                    </>
                                )
                                : (
                                    <span className='text-lg'>
                                        Update Profile
                                    </span>
                                )
                        }
                    </Button>
                </form>
                <div className='flex justify-between mt-5 text-red-700 dark:text-slate-200 text-lg font-semibold'>
                    <span
                        className='cursor-pointer hover:underline hover:underline-offset-4'
                        onClick={() => setShowModal(true)}
                    >
                        Delete Account
                    </span>
                    <span
                        className='cursor-pointer hover:underline hover:underline-offset-4'
                        onClick={handleSignout}
                    >
                        Sign Out
                    </span>
                </div>
            </div>

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
                            Are you sure?
                        </h2>
                        <h3 className={`mb-5 text-lg font-semibold text-gray-800 ${theme === 'dark' && 'text-slate-200'}`}>
                            Do you want to delete this Account?
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
        </div>
    )
}
export default Profile