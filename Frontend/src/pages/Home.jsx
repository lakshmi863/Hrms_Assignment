import React from 'react';
import { Link } from 'react-router-dom';

// 1. Import your new hero image
import heroImage from '../assets/hrm.png';

const Home = () => {
  return (
    // The main container. We set the background image with an inline style.
    <div
      className="home-hero-container"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-content">
        <h1>Human Resource Management System (HRMS) </h1>
        <p>
          Streamline your HR processes with our intuitive platform. Manage employees, organize teams, and unlock your organization's full potential.
        </p>
        <Link to="/employees" className="btn btn-primary">
          Manage Employees
        </Link>
      </div>
    </div>
  );
};

export default Home;