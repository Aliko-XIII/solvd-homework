import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import {useNavigate } from "react-router-dom";
import { HospitalContext } from "../App";

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(-1);
    const [sex, setSex] = useState('');

    const { register, role, setRole } = useContext(HospitalContext);

    const navigate = useNavigate();
    useEffect(() => {
        if (role.name != 'guest') {
            navigate('/profile');
        }
    }, [role]);

    const handleSubmit = async e => {
        e.preventDefault();
        const user = register(firstName, lastName, phone, password, age, sex);
        setRole({
            name: 'user'
        });
    };

    return (
        <form onSubmit={handleSubmit} className='registerWrapper'>
            <label htmlFor="firstName" id='firstNameLabel'>First Name:</label>
            <input
                type="text"
                id="firstName"
                className='firstNameInput'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />

            <label htmlFor="lastName" id='lastNameLabel'>Last Name:</label>
            <input
                type="text"
                id="lastName"
                className='lastNameInput'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />

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

            <label htmlFor="age" id='ageLabel'>Age:</label>
            <input
                type="number"
                id="age"
                className='ageInput'
                value={age}
                onChange={e => setAge(parseInt(e.target.value))}
            />

            <label htmlFor="sex" id='sexLabel'>Sex:</label>
            <select
                id="sex"
                className='sexInput'
                value={sex}
                onChange={e => setSex(e.target.value)}
            >
                <option value="">Select...</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
            </select>

            <button type='submit'>Register</button>
        </form>
    );
}

export default Register;
