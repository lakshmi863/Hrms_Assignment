import React, { useState } from 'react';
import api from "../services/api";
import { Loader } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isRegistering ? '/register' : '/login';

    try {
      const res = await api.post(endpoint, formData);

      if (isRegistering) {
        alert('Registration successful! Please log in.');
        setIsRegistering(false);
      } else {
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.token); // Navigate or update UI
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>

        {isLoading && !error && (
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            Connecting to server...
          </p>
        )}

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Loader className="spin" size={18} />
                Please Wait...
              </div>
            ) : isRegistering ? (
              'Sign Up'
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {!isLoading && (
          <p
            onClick={() => setIsRegistering(!isRegistering)}
            className="toggle-link"
          >
            {isRegistering
              ? 'Already have an account? Log In'
              : "Don't have an account? Sign Up"}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
