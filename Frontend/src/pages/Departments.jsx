import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TeamForm from '../components/TeamForm'; // Reusing the create form
import Sidebar from '../components/Sidebar';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch "Teams" from backend but display them as Departments
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/teams');
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load departments.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDepartmentCreated = (newDept) => {
    setDepartments([...departments, newDept]);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this department?")) {
        try {
            await api.delete(`/teams/${id}`);
            setDepartments(departments.filter(d => d.id !== id));
        } catch(err) {
            alert('Failed to delete department.');
        }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {/* 1. LEFT SIDEBAR */}
      <div style={{ width: '250px', background: '#2c3e50', minHeight: '100vh' }}>
        <Sidebar />
      </div>

      {/* 2. MAIN CONTENT */}
      <div style={{ flex: 1, padding: '30px', background: '#f4f6f8' }}>
        <h2 style={{ marginBottom: '20px' }}>Department Management</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Use existing form to create new "Departments" (Teams) */}
        <div style={{ marginBottom: '30px' }}>
          <TeamForm onTeamCreated={handleDepartmentCreated} />
        </div>

        <h3>Existing Departments</h3>
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th>Members Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept.id}>
                    <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>{dept.name}</td>
                    <td>{dept.description || 'N/A'}</td>
                    <td>
                      <span className="badge">
                        {dept.Employees ? dept.Employees.length : 0} Members
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(dept.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    No departments found. Use the form above to create one.
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

export default Departments;