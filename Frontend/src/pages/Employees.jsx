import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import Slidebar from '../components/Sidebar.jsx';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('An error occurred while fetching employees.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const showCreateForm = () => {
    setEmployeeToEdit(null);
    setIsFormVisible(true);
  };

  const showEditForm = (employee) => {
    setEmployeeToEdit(employee);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEmployeeToEdit(null);
  };

  const handleSuccess = () => {
    setIsFormVisible(false);
    setEmployeeToEdit(null);
    fetchEmployees();
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${employeeId}`);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete employee.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      
      {/* LEFT SIDE – SIDEBAR */}
      <div style={{ width: '250px', background: '#f8f9fa', minHeight: '100vh' }}>
        <Slidebar />
      </div>

      {/* RIGHT SIDE – MAIN CONTENT */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Employee Dashboard</h2>

        {isFormVisible ? (
          <EmployeeForm
            onSuccess={handleSuccess}
            employeeToEdit={employeeToEdit}
            onCancel={handleCancel}
          />
        ) : (
          <button onClick={showCreateForm} className="btn btn-primary">
            Add New Employee
          </button>
        )}
<h3>Employee List</h3>

<div className="table-container">
  <table className="employee-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {employees.length > 0 ? (
        employees.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.firstName} {emp.lastName}</td>
            <td>{emp.email}</td>
            <td>{emp.phone || 'N/A'}</td>
            <td>
              <div className="actions">
                <button 
                  onClick={() => showEditForm(emp)} 
                  className="btn btn-secondary"
                  style={{ marginRight: '8px' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(emp.id)} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        /* Render a row that spans all columns if no data exists */
        <tr>
          <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
            {!isFormVisible && <p>No employees found. Click "Add New Employee" to start.</p>}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
      </div>
    </div>
  );
};

export default Employees;
