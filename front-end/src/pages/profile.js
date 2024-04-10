import React, { useState, useEffect } from 'react';
import '../css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch('/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api/user/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (editMode) {
    return (
      <form onSubmit={handleSubmit} className="profile-form">
        <label className="profile-label">
          Pseudonyme:
          <input type="text" name="pseudonyme" value={user.pseudonyme} onChange={handleChange} className="profile-input" />
        </label>
        <label className="profile-label">
          Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} className="profile-input" />
        </label>
        <label className="profile-label">
          Password:
          <input type="password" name="password" value={user.password} onChange={handleChange} className="profile-input" />
        </label>
        <input type="submit" value="Submit" className="profile-submit" />
      </form>
    );
  }

  return (
    <div className="profile">
      <h1 className="profile-title">{user.pseudonyme}</h1>
      <p className="profile-email">{user.email}</p>
      <button onClick={handleEdit} className="profile-button">Change Password</button>
    </div>
  );
};

export default Profile;