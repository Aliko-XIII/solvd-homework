import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header/Header";
import Login from "./Login/Login";
import Navigation from "./Navigation/Navigation";
import NoPage from "./NoPage/NoPage";
import Register from './Register/Register';
import Config from './Config/Config';
import Profile from './Profile/Profile';
import Role from './Role/Role';
import Organs from './Organs/Organs';
import Symptoms from './Symptoms/Symptoms';
import Specializations from './Specializations/Specializations';
import Appointments from './Appointments/Appointments';

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
    setUser: () => { },
    data: {}
});

const App = ({ dataFetchers, loginUser, registerUser }) => {
    const [user, setUser] = useState({});
    const [role, setRole] = useState({ name: 'guest' });

    function setPatient(patient) {
        setRole({ name: 'patient', ...patient });
    }

    function setDoctor(doctor) {
        setRole({ name: 'doctor', ...doctor });
    }

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

    return (
        <HospitalContext.Provider value={{
            user: user,
            role: role,
            login: login,
            register: register,
            setRole: setRole,
            setUser: setUser,
            data: dataFetchers
        }}>

            <BrowserRouter>
                <Header />
                <Navigation />

                <div className="contentWrapper">
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route exact path="/config" element={<Config updateUser={dataFetchers.updateUser}/>} />
                        <Route exact path="/profile" element={<Profile deleteUser={dataFetchers.deleteUser}/>} />
                        <Route eUxact path="/role" element={<Role setDoctor={setDoctor} setPatient={setPatient} />} />
                        <Route exact path="/organs" element={<Organs />} />
                        <Route exact path="/symptoms" element={<Symptoms />} />
                        <Route exact path="/specializations" element={<Specializations />} />
                        <Route exact path="/appointments" element={<Appointments />} />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </div>

            </BrowserRouter>

        </HospitalContext.Provider>
    );
}


export default App;