import React from 'react';
import { SetStateAction, createContext, useState, useEffect } from 'react';
import Login from "./Login/Login";

export const HospitalContext = createContext({
    user: {
        name: '',
        surname: '',
        phone: '',
        age: -1,
        sex: '',
        access_token: '',
        refresh_token: ''
    },
    login: (phone, password) => { },
    role: {}
});

const App = ({ dataFetchers, auth }) => {
    const [user, setUser] = useState({});
    const [role, setRole] = useState({});

    /**
     * @param {string} phone 
     * @param {string} password 
     * @returns {object}
     */
    async function login(phone, password) {
        const user = await auth.loginUser(phone, password);
        setUser(user);
    }

    async function logUsers() {
        console.log(await dataFetchers.getUsers());
    }



    return (
        <HospitalContext.Provider value={{ user: user, role: role, login: login }}>
            <h1>Hospital App</h1>
            {user.access_token ?
                <div>
                    <button onClick={logUsers}>GET USERS</button>
                </div> :
                <Login />}

        </HospitalContext.Provider>
    );
}


export default App;