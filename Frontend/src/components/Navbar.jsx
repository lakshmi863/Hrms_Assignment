import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import companyLogo from '../assets/evallo.png'; // Make sure you're using the white logo

const Navbar = () => {
  const navigate = useNavigate();
  
  // State for hover effects
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // 1. ADD STATE FOR LOGO HOVER
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 2rem',
      backgroundColor: '#2c3e50',
      background: 'linear-gradient(90deg, #1D2B41 0%, #2C3E50 100%)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },

    // 2. DEFINE THE NEW STYLES FOR THE LOGO CONTAINER
    logoContainer: {
      display: 'flex', // Ensures the logo is centered inside the padding
      alignItems: 'center',
      padding: '6px 12px', // Gives space between the logo and the border
      border: '2px solid rgba(236, 240, 241, 0.5)', // Subtle, light-grey semi-transparent border
      borderRadius: '8px', // Rounded corners
      textDecoration: 'none', // Remove underline from the link
      transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
    },
    
    // Style for the logo container when hovered
    logoContainerHover: {
      borderColor: '#4ECCA3', // Changes border color to the active link color
      backgroundColor: 'rgba(78, 204, 163, 0.1)', // Adds a very subtle background glow
    },
    
    // Logo image style itself (no changes here)
    logoImage: {
      height: '32px',
      width: 'auto',
    },
    
    // --- Rest of the styles are unchanged ---
    linksContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
    },
    link: {
      color: '#ECF0F1', 
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '1rem',
      padding: '8px 0',
      position: 'relative',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease-in-out',
    },
    activeLink: {
      color: '#4ECCA3',
      borderBottom: '2px solid #4ECCA3',
    },
    linkHover: {
        color: '#4ECCA3',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.95rem',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease', 
    },
    buttonHover: {
        backgroundColor: '#2980b9',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
  };

  return (
    <header style={styles.navbar}>
      {/* 3. APPLY THE STYLES AND HOVER LOGIC TO THE NavLink */}
      <NavLink 
        to="/"
        style={{ ...styles.logoContainer, ...(isLogoHovered && styles.logoContainerHover) }}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
      >
        <img src={companyLogo} alt="Company Logo" style={styles.logoImage} />
      </NavLink>

      {/* Rest of the navbar JSX remains the same */}
      <div style={styles.linksContainer}>
        <NavLink
          to="/employees"
          style={({ isActive }) => ({ ...styles.link, ...(isActive && styles.activeLink), ...(hoveredLink === 'employees' && !isActive && styles.linkHover) })}
          onMouseEnter={() => setHoveredLink('employees')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Employees
        </NavLink>
        <NavLink
          to="/teams"
          style={({ isActive }) => ({ ...styles.link, ...(isActive && styles.activeLink), ...(hoveredLink === 'teams' && !isActive && styles.linkHover) })}
          onMouseEnter={() => setHoveredLink('teams')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Teams
        </NavLink>
      </div>
      <button
        onClick={handleLogout}
        style={{ ...styles.button, ...(isButtonHovered && styles.buttonHover) }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;