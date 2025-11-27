import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added Link and useNavigate
import api from "../services/api";
import { Loader } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  // We removed isRegistering because Register is a separate page now
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Always point to Login. Registration is handled on a different page.
      const res = await api.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token); 
      navigate('/'); // Redirect to Home after login
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Email or Password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>

        {isLoading && !error && (
          <p style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
            Connecting to server...
          </p>
        )}

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email" 
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Loader className="spin" size={18} />
                Please Wait...
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="toggle-link">
          <p>Don't have an account?</p>
          {/* This now links to the dedicated Register Page */}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>
            Create an Organization
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;