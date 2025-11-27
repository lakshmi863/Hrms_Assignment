import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login'; 
import RegisterOrg from './pages/RegisterOrg';
import Home from './pages/Home'; 
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Reports from './pages/Reports';
import Departments from './pages/Departments'; // <--- 1. IMPORT THIS
import Navbar from './components/Navbar';

// ... AppLayout and AuthLayout remain the same ...

const AppLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const AuthLayout = () => (
    <div className="auth-layout">
        <Outlet />
    </div>
);

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrg />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} /> 
        <Route path="/employees" element={<Employees />} />
        <Route path="/teams" element={<Teams />} />
        
        {/* 2. ADD THIS ROUTE */}
        <Route path="/reports" element={<Reports />} /> 
        <Route path="/departments" element={<Departments />} />
      </Route>

      <Route 
        path="*" 
        element={localStorage.getItem('token') ? <Navigate to="/" /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;