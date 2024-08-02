import React, { useContext } from 'react';
import { SetStateAction, createContext, useState, useEffect } from 'react';
import { HospitalContext } from "../App";


const Header = () => {
    const { user, role } = useContext(HospitalContext);

    return (
        <header className='appHeader'>
            <h1>Welcome to the Hospital Appointment App</h1>
            {role.name != 'guest'  ? (
                <h2>{user.firstName + ' ' + user.lastName}</h2>
            ) : (
                <h2>Please, log in or sign up</h2>
            )}
        </header>
    );
};

export default Header;
