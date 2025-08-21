import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/card.css';
import '../styles/user-selection.css';
import '../styles/popupwindow.css'; // 添加弹窗样式
import Sidebar from '../components/SideBar'; //zkx：sidebar侧栏

export default function UserSelectionPage() {
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = () => {
    // TODO: Replace with actual password validation
    const correctPassword = 'admin123'; // This should be replaced with actual authentication
    
    if (password === correctPassword) {
      setShowPasswordModal(false);
      navigate('/admin');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  const roles = [
    { id: 'gp', title: 'I am a GP', route: '/gp' },
    { id: 'ophthalmology', title: 'I am an Ophthalmology', route: '/ophthalmology' },
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
              <a 
                href="/admin" 
                className="admin-link"
                onClick={handleAdminClick}
              >
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
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--border-grey, #aeb7bd)',
                  borderRadius: 'var(--radius-s, 4px)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  background: 'var(--lighter-base, #ffffff)',
                  color: 'var(--text-body, #231f20)',
                  marginBottom: '1rem'
                }}
              />
              
              {passwordError && (
                <div style={{
                  color: 'var(--urgent-red, #DA291C)',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  {passwordError}
                </div>
              )}
              
              <div className="cm-actions">
                <button 
                  onClick={handleModalClose}
                  style={{
                    background: 'var(--border-grey, #aeb7bd)',
                    color: 'var(--text-inverse, #ffffff)',
                    border: 'none',
                    borderRadius: 'var(--radius-s, 4px)',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePasswordSubmit}
                  disabled={!password.trim()}
                  style={{
                    background: password.trim() ? 'var(--core-blue, #005eb8)' : '#c5c5c5',
                    color: 'var(--text-inverse, #ffffff)',
                    border: 'none',
                    borderRadius: 'var(--radius-s, 4px)',
                    padding: '0.75rem 1.5rem',
                    cursor: password.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    opacity: password.trim() ? 1 : 0.6
                  }}
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