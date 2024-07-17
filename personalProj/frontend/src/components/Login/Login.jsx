import React, { useContext } from 'react';
import { SetStateAction, createContext, useState, useEffect } from 'react';
import { HospitalContext } from "../App";

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const { user, login } = useContext(HospitalContext);

    const handleSubmit = async e => {
        e.preventDefault();
        login(phone, password);
        console.log('Phone:', phone);
        console.log('Password:', password);
    };

    return (
        <form onSubmit={handleSubmit} className='loginWrapper'>
            <label htmlFor="phone" id='phoneLabel'>Phone:</label>
            <input
                type="tel"
                id="phone"
                className='phoneInput'
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />
            <label htmlFor="password" id='passwordLabel'>Password:</label>
            <input
                type="password"
                className='passwordInput'
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button type='submit'>Login</button>
        </form>
    );
}

export default Login;