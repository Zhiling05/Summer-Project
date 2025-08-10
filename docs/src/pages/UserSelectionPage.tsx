import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/card.css';
import '../styles/user-selection.css';
import Sidebar from '../components/SideBar'; //zkx：sidebar侧栏
import BackButton from '../components/BackButton';//zkx

export default function UserSelectionPage() {
  const navigate = useNavigate();

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
        <BackButton />
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
          </div>
        </div>
      </>
  );
}
