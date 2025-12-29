import React, { useState } from 'react';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/reset-password-request', { email });
      setMessage('Check your backend console for the reset token!');
    } catch (err) {
      setMessage('Error sending request.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleRequest}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;