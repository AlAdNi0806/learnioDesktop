// Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

import logo from '../../assets/home/logo.jpg'
import Loader from './Loader';

const Login = ({ onSwitch }) => {
    const [pending, setPending] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, onRegister } = useAuth();

    const login = async () => {
        setPending(true);
        setLoginError('');

        if (username.length < 1) {
            setLoginError('Please provide a username');
            setPending(false);
            return;
        } else if (password.length < 1) {
            setLoginError('Please provide a password');
            setPending(false);
            return;
        }

        const result = await onLogin(username, password);
        console.log(result);
        if (result.success === true) {
            setPending(false);
            return;
        } else {
            if (result.message.message) {

                setLoginError(result.message.message);
            } else {
                setLoginError(result.message);
            }
            setPending(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-[100vh] w-full'>

            <div className='flex w-[350px] items-center flex-col p-10 rounded-3xl backdrop-blur-lg bg-indigo-900 bg-opacity-40 border-2 border-violet-800 sm:w-[400px] md:w-[500px]'>

                <div className='h-32 w-32 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 m-[-100px] mb-8'>
                    <img src={logo} className='w-full h-full rounded-full object-fit' />
                </div>
                <h2 className=' text-4xl font-semibold tracking-wide mb-8 text-white'>Login</h2>
                <div className='flex flex-col w-full'>
                    <label className=' text-sm text-indigo-200 mb-2'>
                        Username
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Username"
                        className='h-12 p-4 mb-4 w-full text-md placeholder-indigo-400 bg-indigo-950 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-purple-950'
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <label className=' text-sm text-indigo-200 mb-2'>
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="*****"
                        className='h-12 p-4 mb-2 w-full text-md placeholder-indigo-400 bg-indigo-950 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-purple-950'
                    />
                </div>

                <div className='flex flex-col w-full justify-start'>
                    <p className=' text-red-600 mb-8 text-sm tracking-wide'>
                        {loginError}
                    </p>
                </div>
                <button
                    onClick={login}
                    className='h-12 w-full text-lg font-semibold tracking-wide mb-4 backdrop-blur-lg bg-indigo-700 bg-opacity-20 rounded-lg text-white border-2 border-indigo-500'
                >
                    {pending ? (
                        <Loader />
                    ) : (
                        <p>Login</p>
                    )}
                </button>
                <button
                    onClick={onSwitch}
                    className='text-sm text-white'
                >
                    Don't have an account? Register
                </button>
            </div>
        </div>
    );
};

export default Login;
