import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TeamForm from '../components/TeamForm';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignment, setAssignment] = useState({});
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamsResponse, employeesResponse] = await Promise.all([
        api.get('/teams'),
        api.get('/employees')
      ]);
      setTeams(teamsResponse.data);
      setEmployees(employeesResponse.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch data.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTeamCreated = (newTeam) => {
    setTeams([...teams, newTeam]);
  };

  const handleAssignmentChange = (teamId, employeeId) => {
    setAssignment({ ...assignment, [teamId]: employeeId });
  };
  
  const handleAssignEmployee = async (teamId) => {
    const employeeId = assignment[teamId];
    if (!employeeId) {
      alert('Please select an employee to assign.');
      return;
    }
    try {
      await api.post(`/teams/${teamId}/assign`, { employeeId });
      fetchData(); // Refetch all data to show the new assignment
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign employee.');
    }
  };

  const handleUnassignEmployee = async (teamId, employeeId) => {
    if (window.confirm('Are you sure you want to unassign this employee?')) {
      try {
        await api.delete(`/teams/${teamId}/unassign/${employeeId}`);
        fetchData(); // Refetch data
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to unassign employee.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="content-card">
      <h2>Teams Dashboard</h2>

      <TeamForm onTeamCreated={handleTeamCreated} />
      
      <h3>Team List</h3>
      <div className="card-grid">
        {teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id} className="team-card">
              <h4>{team.name}</h4>
              <p>{team.description || 'No description provided.'}</p>
              
              <div>
                <h5>Assigned Members ({team.Employees?.length || 0})</h5>
                {team.Employees && team.Employees.length > 0 ? (
                  <ul className="member-list">
                    {team.Employees.map(emp => (
                      <li key={emp.id}>
                        {emp.firstName} {emp.lastName}
                        <button 
                          onClick={() => handleUnassignEmployee(team.id, emp.id)} 
                          className="btn btn-danger btn-sm"
                        >
                          Unassign
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No employees are assigned.</p>
                )}
              </div>

              <div className="assignment-controls">
                <select 
                  className="form-select"
                  value={assignment[team.id] || ''}
                  onChange={(e) => handleAssignmentChange(team.id, e.target.value)}
                >
                  <option value="">Select employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
                <button 
                  onClick={() => handleAssignEmployee(team.id)} 
                  className="btn btn-secondary"
                >
                  Assign Employee
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No teams found. Start by creating one!</p>
        )}
      </div>
    </div>
  );
};

export default Teams;