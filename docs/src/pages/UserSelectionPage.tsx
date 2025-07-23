import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/card.css';

export default function UserSelectionPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--core-blue', '#005eb8');
    root.style.setProperty('--container-max', '960px');
    root.style.setProperty('--space-m', '16px');
    root.style.setProperty('--space-l', '24px');
    root.style.setProperty('--text-inverse', '#ffffff');
  }, []);

  const roles = [
    {
      id: 'gp',
      title: 'I am a GP',
      route: '/gp'
    },
    {
      id: 'ophthalmology',
      title: 'I am an Ophthalmology',
      route: '/ophthalmology'
    },
    {
      id: 'neurologist',
      title: 'I am a Neurologist',
      route: '/neurologist'
    },
    {
      id: 'optometrist',
      title: 'I am an Optometrist',
      route: '/optometrist'
    },
    {
      id: 'patient',
      title: 'I am a Patient',
      route: '/patient'
    }
  ];

  return (
    <>
      <Header title="Select Role" />
      
      <div style={{ 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ 
            maxWidth: '960px', 
            margin: '0 auto', 
            padding: '0 1.5rem',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ 
                fontSize: '2rem',
                fontWeight: '700',
                color: '#212b32',
                margin: '0 0 0.5rem 0'
              }}>
                Select Your Role
              </h1>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              width: '100%',
              alignItems: 'center'
            }}>
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="base-card"
                  onClick={() => navigate(role.route)}
                  style={{
                    padding: '1rem 2rem', 
                    width: '80vw', 
                    maxWidth: '50rem', 
                    minWidth: '20rem' 
                  }}
                >
                  <div className="card-content">
                    <h3 className="card-title">
                      {role.title}
                    </h3>
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
      </div>
    </>
  );
}