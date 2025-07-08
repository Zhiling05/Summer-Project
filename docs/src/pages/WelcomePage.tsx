// docs/src/pages/WelcomePage.tsx
import { useNavigate } from 'react-router-dom';
import '../styles/question.css';
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="nhs-header">
        <div
          className="nhs-header__inner"
          style={{ maxWidth: '100%', margin: 0, padding: '12px 24px' }}
        >
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">WelcomePage</span>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="nhsuk-width-container">
          <h1 className="nhsuk-heading-l">WelcomePage</h1>
          <p>context line 1</p>
          <p>context line 2</p>
          <p>context line 3</p>
          <button
            className="continue-button"
            onClick={() => navigate('/select-role')}
          >
            Start now
          </button>
        </div>
      </div>
    </div>
  );
}
