import { Button, Label, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRef } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Profile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const imagePickerRef = useRef(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        } else {
            setImageUploadError('Please select a valid image file.');
            toast.error('Please select a valid image file.');
        }

    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageUploadError(null);
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
                setImageUploadError('Error uploading image: image size should be below 2MB.');
                toast.error('Error uploading image: image size should be below 2MB.');
                setImageUploadProgress(null);
                setImageFile(null);
                setImageUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setImageUrl(downloadURL);
                        setImageUploadProgress(null);
                    })
            }
        );

    }

    return (
        <div className='flex flex-col items-center mt-5 mb-8 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl mt-5 mb-8 font-semibold'>Profile</h1>
            <div className='bg-slate-200 dark:bg-slate-800 px-8 py-8 max-w-md w-full rounded-lg shadow-lg'>
                <form className='flex flex-col items-center justify-center gap-5 w-full'>
                    <div className='relative flex cursor-pointer w-full justify-center'>
                        <img
                            src={imageUrl || currentUser.profilePic}
                            alt='profile pic'
                            className={`rounded-full border-8 border-slate-300 dark:border-slate-300 object-cover h-32 w-32
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
                        />
                        <span
                            className='absolute right-3 top-10 cursor-pointer text-xl text-slate-800 dark:text-slate-300'
                            onClick={() => setShowPassword(prevState => !prevState)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <Button
                        gradientDuoTone="greenToBlue"
                        className='w-full mt-3'
                        type='submit'
                        outline
                    >
                        <span className='text-lg'>
                            Update Profile
                        </span>
                    </Button>
                </form>
                <div className='flex justify-between mt-5 text-red-500 text-md font-semibold'>
                    <span className='cursor-pointer hover:underline hover:underline-offset-4'>
                        Delete Account
                    </span>
                    <span className='cursor-pointer hover:underline hover:underline-offset-4'>
                        Sign Out
                    </span>
                </div>
            </div>

        </div>
    )
}
export default Profile