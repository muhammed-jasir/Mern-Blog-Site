import { Button, FileInput, Label, Select, Spinner, Textarea, TextInput } from 'flowbite-react'
import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    const quillRef = useRef(null);

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    const modules = {
        toolbar: toolbarOptions
    };

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

        if (isOther && !newCategory.trim()) {
            toast.error('Please add new category or select an existing category.');
            return;
        }

        if (!formData.title || !formData.description || !formData.content || !formData.category) {
            toast.error('All Fields are Required');
            return;
        }

        if (formData.title.length < 5 || formData.title.length > 100) {
            toast.error('Title must be between 5 and 100 characters long');
            return;
        }

        if (formData.description.length < 10 || formData.description.length > 300) {
            toast.error('Description must be between 10 and 300 characters long');
            return;
        }

        if (formData.content.length < 50) {
            toast.error('Content must be at least 50 characters long');
            return;
        }

        if (imageFile && !formData.image) {
            toast.error('Please upload the selected image.');
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
        <div className='flex items-center flex-col mb-10  mt-5 min-h-screen px-3 sm:px-6 lg:px-8'>
            <h1 className='font-semibold text-3xl mb-8 mt-5'>Create post</h1>
            <div className='bg-slate-200 dark:bg-slate-800 px-4 sm:px-8 py-8 max-w-3xl lg:max-w-4xl w-full rounded-lg shadow-lg'>
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
                        <div className='flex flex-col sm:flex-row gap-3 w-full'>
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

                    <div className='w-full'>
                        <Label className='text-md font-semibold text-gray-700 dark:text-gray-300' htmlFor='description'>
                            Description
                        </Label>
                        <Textarea
                            id='description'
                            placeholder='Short description of the post'
                            className='mt-1 rounded-md text-lg w-full'
                            rows={4}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

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
                                className='w-full h-[225px] sm:h-72 object-cover'
                            />
                        </div>
                    )}

                    <div className='w-full'>
                        <ReactQuill
                            placeholder='Write your content here...'
                            theme='snow'
                            className={`h-80 w-full ${theme === 'dark' ? 'dark' : 'light'}`}
                            onChange={(value) => setFormData({ ...formData, content: value })}
                            modules={modules}
                        />
                    </div>
                    <div className='w-full mt-32 sm:mt-20'>
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