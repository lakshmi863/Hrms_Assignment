// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Make sure BrowserRouter is imported
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Make sure <App /> is wrapped by <BrowserRouter> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);