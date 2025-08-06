// docs/src/pages/optometrist/assess/StartPage.tsx
import { useNavigate } from 'react-router-dom';
import '../../../styles/question.css';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';

export default function StartPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e5ecef' }}>
      {/* Header */}
      <Header title="Assessment" />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '80px', // Leave space for bottom nav
        }}
      >
        <div className="nhsuk-width-container">
          <div style={{ textAlign: 'center' }}>
            <h1 className="nhsuk-heading-l" style={{ marginBottom: '2rem' }}>
              Assessment
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#768692', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              This assessment can help determine appropriate referral recommendations based on the patient's symptoms.
            </p>
            <button
              className="continue-button"
              onClick={() => {
                navigate('../questions/Q1');  // 跳转到第一个问题
              }}
              style={{ 
                fontSize: '1.1rem',
                padding: '16px 32px'
              }}
            >
              Start now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}