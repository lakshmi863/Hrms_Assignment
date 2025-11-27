// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Make sure BrowserRouter is imported
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ADD THE "future" PROP HERE: */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);