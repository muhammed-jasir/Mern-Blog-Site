import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/AboutPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Blogs from './pages/Blogs';
import Header from './components/Header';
import FooterComp from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import Posts from './components/Posts';
import UpdatePost from './pages/UpdatePost';
import Users from './components/Users';
import PostPage from './components/PostPage';
import Search from './pages/Search';
import ScrollToTop from './components/ScrollToTop';
import DashComments from './components/DashComments';
import Contact from './pages/Contact';

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about-us' element={<About />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<Signup />} />
                <Route path='/search' element={<Search />} />
                <Route element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                </Route>
                <Route element={<AdminPrivateRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/create-post' element={<CreatePost />} />
                    <Route path='/update-post/:postId' element={<UpdatePost />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/posts' element={<Posts />} />
                    <Route path='/comments' element={<DashComments />} />
                </Route>
                <Route path='/post/:slug' element={<PostPage />} />
                <Route path='/blogs' element={<Blogs />} />
                <Route path='/contact-us' element={<Contact />} />
            </Routes>
            <FooterComp />
        </BrowserRouter >
    )
}

export default App