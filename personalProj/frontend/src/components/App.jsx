import React from 'react';
import { SetStateAction, createContext, useState, useEffect } from 'react';

export const HospitalContext = createContext({
    user: {},
    role: {}
});

const App = ({ dataFetchers }) => {
    const [user, setUser] = useState({});
    const [role, setRole] = useState({});

    


    return (
        <HospitalContext.Provider value={{ user: user, role: role }}>
            <h1>Hospital App</h1>
            {user.id == undefined ? 'shit' : 'not shit'}

        </HospitalContext.Provider>
    );
}


export default App;