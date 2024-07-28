import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './components/Header';
import FooterComp from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import Posts from './components/Posts';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about-us' element={<About />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<Signup />} />
                <Route element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                </Route>
                <Route element={<AdminPrivateRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/create-post' element={<CreatePost />} />
                </Route>
                <Route path='/posts' element={<Posts />} />
                <Route path='/projects' element={<Projects />} />
            </Routes>
            <FooterComp />
        </BrowserRouter >
    )
}

export default App