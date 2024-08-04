import { Button } from 'flowbite-react'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginSucccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    image: result.user.photoURL
                }),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(loginSucccess(data));
                toast.success('Login Successful!');
                navigate('/');
            } else {
                toast.error(data.message || 'Google login failed. Please try again.');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <Button
            type='button'
            gradientDuoTone="purpleToBlue"
            outline
            className=''
            onClick={handleGoogle}
        >
            <FcGoogle className='w-6 h-6 mr-3 bg-white rounded-full' />
            <span className='text-lg  font-semibold'>
                Continue with Google
            </span>
        </Button>
    )
}

export default OAuth