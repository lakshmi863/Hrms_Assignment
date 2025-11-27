import React from 'react';
import { NavLink } from 'react-router-dom';
//import hrLogo from '../assets/hr-logo.png'; // Make sure this path is correct

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
       <h1>HR Platform</h1>
  </div>
  <ul className="sidebar-nav">
    <li>
      {/* Note: In a real app, you would probably have icons here too */}
      <NavLink to="/employees">Employee Management</NavLink>
    </li>
    <li>
      <NavLink to="/dashboard">Dashboard Overview</NavLink>
    </li>
    <li>
      <NavLink to="/departments">Departments</NavLink>
    </li>
    <li>
      <NavLink to="/reports">Reports</NavLink>
    </li>
  </ul>
  {/* A spacer to push settings to the bottom, if desired */}
  <div style={{ flexGrow: 1 }}></div> 
  <ul className="sidebar-nav">
    <li>
      <NavLink to="/settings">Settings</NavLink>
    </li>
  </ul>
</aside>
  );
};

export default Sidebar;