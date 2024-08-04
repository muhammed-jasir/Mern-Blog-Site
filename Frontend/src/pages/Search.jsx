import { Label, TextInput, Select, Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);

    const [categories, setCategories] = useState(['uncategorized', 'javascript', 'reactjs', 'mern', 'nextjs']);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData((sidebarData) => ({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            }));
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/get-posts?${searchQuery}`);

            if (!res.ok) {
                setLoading(false);
                toast.error('Failed to fetch posts.');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };

        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }

        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }

        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            if (category === 'other') {
                setIsAddingCategory(true);
            } else {
                setIsAddingCategory(false);
                setSidebarData({ ...sidebarData, category });
            }
        }
    };

    const handleNewCategoryChange = (e) => {
        setNewCategory(e.target.value);
    };

    const handleAddCategory = () => {
        if (newCategory.trim() === '') {
            toast.error('Category name cannot be empty.');
            return;
        }

        if (categories.includes(newCategory.trim().toLowerCase())) {
            toast.error('Category already exists.');
            return;
        }

        const updatedCategories = [...categories, newCategory.trim().toLowerCase()];
        setCategories(updatedCategories);
        setSidebarData({ ...sidebarData, category: newCategory.trim().toLowerCase() });
        setNewCategory('');
        setIsAddingCategory(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        navigate(`/search?${urlParams.toString()}`, { replace: true });
    }

    const handleShowMore = async () => {
        setLoading(true);
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);

        if (!res.ok) {
            setLoading(false);
            toast.error('Failed to fetch more posts.');
            return;
        }

        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            setLoading(false);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 md:py-10 md:px-4 border-b md:border-r md:min-h-screen border-gray-500 md:w-1/4'>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-2'>
                        <Label className='text-md whitespace-nowrap font-semibold' htmlFor='searchTerm'>Search</Label>
                        <TextInput
                            id='searchTerm'
                            placeholder='Search...'
                            type='text'
                            className='w-full'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className='text-md font-semibold' htmlFor='sort'>Sort</Label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.sort}
                            id='sort'
                            className='w-full'
                        >
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className='text-md font-semibold' htmlFor='category'>Category</Label>
                        <Select
                            id='category'
                            onChange={handleChange}
                            value={sidebarData.category}
                            className='w-full'
                        >
                            {categories.map((category) => (
                                <option key={category} value={category} className='capitalize'>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                            <option value='other'>Other</option>
                        </Select>
                    </div>
                    {isAddingCategory && (
                        <div className='flex flex-col gap-2'>
                            <TextInput
                                id='newCategory'
                                placeholder='Enter new category...'
                                type='text'
                                className='w-full'
                                value={newCategory}
                                onChange={handleNewCategoryChange}
                            />
                            <Button
                                onClick={handleAddCategory}
                            >
                                Add Category
                            </Button>
                        </div>
                    )}
                    <Button
                        gradientDuoTone='greenToBlue'
                        outline
                        type='submit'
                    >
                        Apply Filters
                    </Button>
                </form>
            </div>
            <div className='w-full md:w-3/4'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
                    Post Results:
                </h1>
                <div className='p-7'>
                    {
                        !loading && posts.length === 0 && (
                            <div className='flex justify-center items-center mt-5'>
                                <h1 className="text-2xl font-bold">Post Not Found</h1>
                            </div>
                        )
                    }

                    {
                        loading && (
                            <div className='flex justify-center items-center min-h-screen'>
                                <Spinner size='xl' />
                            </div>
                        )
                    }

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                        {
                            posts && posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))
                        }
                    </div>

                    {
                        showMore && (
                            <div className='flex justify-center items-center mt-5'>
                                <Button onClick={handleShowMore} color='light'>Load More</Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Search