import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', formData);
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Account Settings</h2>
      {status.message && (
        <div style={{ color: status.type === 'success' ? 'green' : 'red', marginBottom: '15px' }}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
        />
        <textarea
          placeholder="Write a short bio about yourself..."
          rows="5"
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileSettings;