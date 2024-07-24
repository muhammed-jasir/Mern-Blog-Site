import { Button, FileInput, Label, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast } from 'react-toastify';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const CreatePost = () => {
    const { theme } = useSelector(state => state.theme);
    const [loading, setLoading] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const [categories, setCategories] = useState(['javascript', 'reactjs', 'mern', 'nextjs']);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isOther, setIsOther] = useState(false);

    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleAddCategory = () => {
        const category = newCategory.trim().toLowerCase();
        if (category && !categories.includes(category)) {
            setCategories([...categories, category]);
            setSelectedCategory(category);
            setNewCategory('');
            setIsOther(false);
            setFormData({ ...formData, category: category }); 
            toast.success('Category added successfully!');
        } else {
            toast.error('Invalid or duplicate category.');
        }
    };
    
    const handleImageUpload = async () => {
        try {
            if (!imageFile || !imageFile.type.startsWith('image/')) {
                toast.error('Please select an image file.');
                return;
            }

            if (imageFile.size > 2 * 1024 * 1024) {
                return toast.error('Please select an image file smaller than 2MB.');
            }

            setImageUploading(true);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + imageFile.name;
            const storageRef = ref(storage, fileName);
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
                    setImageUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setImageUploadProgress(null);
                        setFormData({ ...formData, image: downloadUrl });
                        setImageUploading(false);
                    });
                },
            );
        } catch (error) {
            toast.error('Error uploading image. Please try again.');
            setImageUploadProgress(null);
            setImageFile(null);
            setImageUploading(false);
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.category) {
            toast.error('All Fields are Required');
            return;
        }

        if (formData.title.length < 5 || formData.title.length > 100) {
            toast.error('Title must be between 5 and 100 characters long');
            return;
        }

        if (formData.content.length < 10) {
            toast.error('Content must be at least 10 characters long');
            return;
        }

        try {
            setLoading(true);

            const res = await fetch('/api/post/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Error creating post. Please try again.');
                return;
            } else {
                toast.success('Post created successfully.');
                navigate(`/post/${data.slug}`);
            }

        } catch (error) {
            toast.error(error.message || 'Error creating post. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center flex-col mb-10  mt-5 min-h-screen px-4 sm:px-6 lg:px-8'>
            <h1 className='font-semibold text-3xl mb-8 mt-5'>Create post</h1>
            <div className='bg-slate-300 dark:bg-slate-800 px-8 py-8 max-w-3xl lg:max-w-4xl w-full rounded-lg shadow-lg'>
                <form className='flex flex-col gap-10 items-center justify-center' onSubmit={handleSubmit}>
                    <div className='w-full'>
                        <Label className='text-md font-semibold text-gray-700 dark:text-gray-300' htmlFor='title'>
                            Title
                        </Label>
                        <TextInput
                            type='text'
                            placeholder='Title'
                            className='mt-1 rounded-md text-lg w-full'
                            sizing='md'
                            id='title'
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className='w-full'>
                        <Label className='text-md font-semibold text-gray-700 dark:text-gray-300' htmlFor='category'>
                            Category
                        </Label>
                        <Select
                            id='category'
                            className=' text-lg mt-1 font-semibold text-gray-700 dark:text-gray-300 w-full'
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedCategory(value);
                                setIsOther(value === 'other');
                                setFormData({ ...formData, category: value });
                                if (value !== 'other') {
                                    setNewCategory('');
                                }
                            }} 
                            value={selectedCategory}
                        >
                            <option value="" className='text-md text-center' >Select a Category</option>
                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                    className='text-md text-center'
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                            <option value="other" className='text-md text-center'>Other</option>
                        </Select>
                    </div>

                    {isOther && (
                        <div className='flex gap-3 w-full'>
                        <TextInput
                            type='text'
                            placeholder='Add new category'
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className='flex-1 w-full'
                        />
                        <Button
                            type='button'
                            gradientMonochrome="info"
                            size='md'
                            outline
                            onClick={handleAddCategory}
                        >
                            Add Category
                        </Button>
                    </div>
                    )}

                    <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-3 w-full'>
                        <FileInput
                            type='file'
                            accept='image/*'
                            className='mt-1 text-lg font-semibold text-gray-700 dark:text-gray-300 w-full md:w-auto md:flex-1'
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        <Button
                            type='button'
                            className='mt-3 w-full md:w-auto flex items-center'
                            gradientMonochrome="info"
                            size='md'
                            outline
                            onClick={handleImageUpload}
                            disabled={imageUploading}
                        >
                            {
                                imageUploadProgress
                                    ? (
                                        <div className='h-12'>
                                            <CircularProgressbar
                                                value={imageUploadProgress}
                                                text={`${imageUploadProgress || 0}%`}
                                                styles={
                                                    {
                                                        root: {
                                                            width: '50px',
                                                            height: '50px',
                                                        },
                                                        path: {
                                                            stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                                                            strokeLinecap: 'butt',
                                                            transition: 'stroke-dashoffset 0.5s ease 0s',
                                                            strokeWidth: 6,
                                                        },
                                                        text: {
                                                            fill: '#4A90E2',
                                                            fontSize: '25px',
                                                            fontWeight: 'bold',
                                                            dominantBaseline: 'middle',
                                                            textAnchor: 'middle',
                                                        },
                                                        background: {
                                                            fill: '#3e98c7',
                                                        },
                                                    }
                                                }
                                            />
                                        </div>

                                    ) : (
                                        <span className='text-md font-semibold'>Upload Image</span>
                                    )
                            }
                        </Button>
                    </div>

                    {formData.image && (
                        <div className='w-full'>
                            <img
                                src={formData.image}
                                alt='Uploaded Image'
                                className='w-full h-72 object-cover'
                            />
                        </div>
                    )}

                    <div className='w-full'>
                        <ReactQuill
                            theme='snow'
                            className={`h-80 w-full ${theme === 'dark' ? 'dark' : 'light'}`}
                            onChange={(value) => setFormData({ ...formData, content: value })}

                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'size': [] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'script': 'sub' }, { 'script': 'super' }],
                                    [{ 'align': [] }],
                                    ['link', 'image', 'video'],
                                    ['clean'],
                                ],
                            }}

                            formats={[
                                'header', 'font', 'size',
                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                'list', 'bullet', 'indent',
                                'link', 'image', 'video',
                                'color', 'background', 'script', 'align'
                            ]}
                        />
                    </div>
                    <div className='w-full mt-16 max-sm:mt-28'>
                        <Button
                            type='submit'
                            gradientDuoTone='greenToBlue'
                            className='w-full sm:auto'
                            disabled={loading || imageUploading}
                        >
                            {
                                loading
                                    ? (
                                        <>
                                            <Spinner size='md' />
                                            <span className='pl-3 text-lg'>
                                                Loading ...
                                            </span>
                                        </>
                                    )
                                    : (
                                        <span className='text-lg font-semibold'>Publish Post</span>
                                    )
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost