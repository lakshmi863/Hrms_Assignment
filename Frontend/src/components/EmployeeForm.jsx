import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeForm = ({ onSuccess, employeeToEdit, onCancel }) => {
  const isEditMode = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        firstName: employeeToEdit.firstName,
        lastName: employeeToEdit.lastName,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone || '',
      });
    } else {
      // Clear form for "create" mode
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    }
  }, [employeeToEdit, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditMode) {
        await api.put(`/employees/${employeeToEdit.id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      onSuccess(); // Call parent's success handler
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} employee.`);
    }
  };

  return (
    // Use the new, more generic container class
    <div className="form-container">
      <h3>{isEditMode ? 'Edit Employee' : 'Create New Employee'}</h3>
      <form onSubmit={handleSubmit}>
        
        {/* It's good practice to show the main form error at the top */}
        {error && <p className="form-error">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone (Optional):</label>
          <input id="phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        
        {/* Use the new actions container for better layout control */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Update Employee' : 'Create Employee'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;