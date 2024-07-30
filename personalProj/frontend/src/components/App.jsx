import React from 'react';
import { SetStateAction, createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Login from "./Login/Login";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import NoPage from "./NoPage/NoPage";
import Register from './Register/Register';
import Config from './Config/Config';

export const HospitalContext = createContext({
    user: {
        id: '',
        firstName: '',
        lastName: '',
        phone: '',
        age: -1,
        sex: '',
        access_token: '',
        refresh_token: ''
    },
    login: (phone, password) => { },
    register: (firstName, lastName, phone, password, age, sex) => { },
    role: { name },
    setRole: ({ name }) => { },
    setUser: () => { }
});

const App = ({ dataFetchers, loginUser, registerUser }) => {
    const [user, setUser] = useState({});
    const [role, setRole] = useState({ name: 'guest' });

    /**
     * @param {string} phone 
     * @param {string} password 
     * @returns {object}
     */
    async function login(phone, password) {
        const user = await loginUser(phone, password);
        setUser(user);
    }

    async function register(firstName, lastName, phone, password, age, sex) {
        const user = await registerUser(firstName, lastName, phone, password, age, sex);
        setUser(user);
    }

    async function logUsers() {
        console.log(await dataFetchers.getUsers());
    }

    return (
        <HospitalContext.Provider value={{
            user: user,
            role: role,
            login: login,
            register: register,
            setRole: setRole,
            setUser: setUser
        }}>

            <BrowserRouter>
                <Header />
                <Navigation />

                <div className="contentWrapper">
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route exact path="/config"
                            element={<Config updateUser={dataFetchers.updateUser} />} />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </div>

            </BrowserRouter>

        </HospitalContext.Provider>
    );
}


export default App;