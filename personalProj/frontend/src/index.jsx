import React from 'react';
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react';
import App from './components/App';
import dataFetchers from '../data.js';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(<StrictMode><App dataFetchers={dataFetchers} /></StrictMode>);