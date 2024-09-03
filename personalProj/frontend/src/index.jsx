import React from 'react';
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react';
import App from './components/App';
import dataFetchers from '../apiRequests/data.mjs';
import auth from '../apiRequests/auth.mjs';
import register from '../apiRequests/register.mjs';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(<StrictMode>
    <App
        dataFetchers={dataFetchers}
        loginUser={auth.loginUser}
        registerUser={register.registerUser} />
</StrictMode>);