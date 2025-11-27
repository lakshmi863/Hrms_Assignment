import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Statistics state
  const [stats, setStats] = useState({ employees: 0, teams: 0, logs: 0 });
  
  const navigate = useNavigate();

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Logs, Employees, and Teams in parallel to build the report
        const [logsRes, empRes, teamRes] = await Promise.all([
            api.get('/logs'),
            api.get('/employees'),
            api.get('/teams')
        ]);

        setLogs(logsRes.data);
        setStats({
            employees: empRes.data.length,
            teams: teamRes.data.length,
            logs: logsRes.data.length
        });

      } catch (err) {
        console.error('Reports error:', err);
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load report data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Helper: Format Date
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Helper: Badge Colors
  const getBadgeColor = (action) => {
    if (action.includes('create')) return 'green';
    if (action.includes('delete')) return 'red';
    if (action.includes('update')) return 'blue';
    return 'gray';
  };

  const badgeStyle = (color) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: color === 'green' ? '#198754' : 
                     color === 'red' ? '#dc3545' : 
                     color === 'blue' ? '#0d6efd' : '#6c757d'
  });

  if (loading) return <p style={{padding: '20px'}}>Loading Reports...</p>;
  if (error) return <p style={{color: 'red', padding: '20px'}}>{error}</p>;

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', background: '#2c3e50', minHeight: '100vh' }}>
        <Sidebar />
      </div>

      {/* REPORT CONTENT */}
      <div style={{ flex: 1, padding: '30px', background: '#f4f6f8' }}>
        <h2>System Reports & Analytics</h2>
        
        {/* Summary Cards Row */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', marginTop: '20px' }}>
            <div className="content-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Total Employees</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d6efd' }}>{stats.employees}</p>
            </div>
            <div className="content-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Total Teams</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#198754' }}>{stats.teams}</p>
            </div>
            <div className="content-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Activities Logged</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>{stats.logs}</p>
            </div>
        </div>

        <h3>Audit Trail (Logs)</h3>
        <div className="table-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length > 0 ? logs.map(log => (
                        <tr key={log.id}>
                            <td>{formatDate(log.timestamp)}</td>
                            <td>{log.user?.name || 'Unknown'}</td>
                            <td>
                                <span style={badgeStyle(getBadgeColor(log.action))}>
                                    {log.action.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </td>
                            <td style={{ fontSize: '0.85rem', color: '#555' }}>
                                {log.meta ? JSON.stringify(log.meta) : '-'}
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4">No logs found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;