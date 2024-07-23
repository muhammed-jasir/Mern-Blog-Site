import { Button, FileInput, Label, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';

const CreatePost = () => {
    const { theme } = useSelector(state => state.theme);

    return (
        <div className='flex items-center flex-col mb-10  mt-5 min-h-screen px-4 sm:px-6 lg:px-8'>
            <h1 className='font-semibold text-3xl mb-8 mt-5'>Create post</h1>
            <div className='bg-slate-300 dark:bg-slate-800 px-8 py-8 max-w-3xl lg:max-w-4xl w-full rounded-lg shadow-lg'>
                <form className='flex flex-col gap-10 items-center justify-center'>
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
                        />
                    </div>
                    <div className='w-full mb-2'>
                        <Label className='text-md font-semibold text-gray-700 dark:text-gray-300' htmlFor='category'>
                            Category
                        </Label>
                        <Select id='category' className='mt-1 text-lg font-semibold text-gray-700 dark:text-gray-300 w-full'>
                            <option value="">Select a Category</option>
                            <option value="jacascript">Javascript</option>
                            <option value="reactjs">React js</option>
                            <option value="mern">MERN Stack</option>
                            <option value="nextjs">Next js</option>
                        </Select>
                    </div>
                    <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 w-full border-4 border-dotted p-3 dark:border-slate-300 border-gray-700'>
                        <FileInput
                            type='file'
                            accept='image/*'
                            className='mt-1 text-lg font-semibold text-gray-700 dark:text-gray-300 w-full md:w-auto md:flex-1'
                            sizing='md'
                        />
                        <Button
                            type='button'
                            className='mt-3 w-full md:w-auto flex items-center'
                            gradientMonochrome="info"
                            size='md'
                            outline
                        >
                            <span className='text-md font-semibold'>Upload Image</span>
                        </Button>
                    </div>


                    <div className='w-full'>
                        <ReactQuill
                            theme='snow'
                            className={`h-80 w-full ${theme === 'dark' ? 'dark' : 'light'}`}
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
                        >
                            <span className='text-lg font-semibold'>Publish Post</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost