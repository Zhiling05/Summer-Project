import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/card.css';
import '../styles/user-selection.css';
import '../styles/popupwindow.css';
import Sidebar from '../components/SideBar';
import { ensureGuest, http } from '../api';

/**
 * UserSelectionPage - role selection screen
 * - Provides entry points for different user types
 * - Includes administrator login with password modal
 */
export default function UserSelectionPage() {
  const navigate = useNavigate();
  useEffect(() => { void ensureGuest(); }, []);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async () => {
    try {
      await http('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      setShowPasswordModal(false);
      navigate('/admin', { state: { from: '/user-selection' } });
    } catch {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePasswordSubmit();
  };

  const roles = [
    { id: 'gp', title: 'I am a GP', route: '/gp' },
    { id: 'ophthalmology', title: 'I am an Ophthalmologist', route: '/ophthalmology' },
    { id: 'neurologist', title: 'I am a Neurologist', route: '/neurologist' },
    { id: 'optometrist', title: 'I am an Optometrist', route: '/optometrist/assess/start-page' },
    { id: 'patient', title: 'I am a Patient', route: '/patient' }
  ];

  return (
    <>
      <Header title="Select Role" />
      <Sidebar />
      <div className="user-selection-page">
        <div className="user-selection-container">
          <div className="user-selection-title-wrapper">
            <h1 className="user-selection-title">Select Your Role</h1>
          </div>
          <div className="user-selection-cards">
            {roles.map((role) => (
              <div
                key={role.id}
                className="base-card user-selection-card"
                onClick={() => navigate(role.route)}
              >
                <div className="card-content">
                  <h3 className="card-title">{role.title}</h3>
                </div>
                <div className="card-arrow-container">
                  <div className="card-arrow-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Administrator Option */}
          <div className="admin-option">
            <a href="/admin" className="admin-link" onClick={handleAdminClick}>
              I am an administrator
            </a>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="cm-overlay" onClick={handleModalClose}>
          <div className="cm-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="cm-title">Administrator Access</h3>
            <p className="cm-desc">Please enter the administrator password</p>

            <input
              type="password"
              className="password-modal-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />

            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}

            <div className="cm-actions">
              <button onClick={handleModalClose} className="btn-cancel">
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={!password.trim()}
                className="btn-continue"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
