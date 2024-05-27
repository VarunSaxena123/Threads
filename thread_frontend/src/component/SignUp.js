import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function SignUp() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.23.204:3000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
      });

      if (response.ok) {
        // Signup successful, redirect to home page
        history.push('/');
      } else {
        // Signup failed, handle error
        console.log('Signup failed');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    }

    // Reset form fields
    setUsername('');
    setPassword('');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #c33764, #1d2671)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '400px',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '5px',
        }}
      >
        <h2 style={{ marginLeft: '120px' }}>Sign Up</h2>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username" style={{ fontWeight: 'bold' }}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <button
          type="submit"
          className="signup-button"
          style={{
            background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
