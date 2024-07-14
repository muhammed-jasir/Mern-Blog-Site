import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './components/Header';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about-us' element={<About />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/projects' element={<Projects />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App