import React, { useState } from 'react';
import api from '../services/api';

const TeamForm = ({ onTeamCreated, onCancel }) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!teamName) {
      setError('Team name is required.');
      return;
    }

    try {
      const response = await api.post('/teams', { name: teamName, description });
      onTeamCreated(response.data); // Notify parent component
      setTeamName(''); // Reset form
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team.');
    }
  };

  return (
    <div className="form-container">
      <h3>Create a New Team</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="teamName">Team Name:</label>
          <input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g., Engineering, Marketing"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional):</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this team does"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Team</button>
          {/* Optionally add a cancel button if needed */}
          {/* <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button> */}
        </div>
      </form>
    </div>
  );
};

export default TeamForm;