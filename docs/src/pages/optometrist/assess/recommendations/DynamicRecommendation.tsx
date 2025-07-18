// src/pages/optometrist/assess/DynamicRecommendation.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recommendations from '/src/data/recommendations.json';
import '/src/styles/recommendation.css';

interface ResultRecord {
  id: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  themeColor?: string;
  backgroundColor?: string;
}

const themeMap: Record<string, { bg: string; text: string; border: string }> = {
  IMMEDIATE:            { bg: '#ffebee', text: '#d32f2f', border: '#d32f2f' },
  EMERGENCY_DEPARTMENT: { bg: '#ffe4e6', text: '#d03838', border: '#d03838' },
  URGENT_TO_OPH:        { bg: '#ffebcc', text: '#e67e00', border: '#e67e00' },
  URGENT_TO_GP_OR_NEUR: { bg: '#ffebcc', text: '#e67e00', border: '#e67e00' },
  TO_GP:                { bg: '#e6f0ff', text: '#e67e00', border: '#e67e00' },
  OTHER_EYE_CONDITIONS_GUIDANCE:{ bg: '#e6f0ff', text: '#e67e00', border: '#e67e00' },
  NO_REFERRAL:          { bg: '#d5f5d5', text: '#006747', border: '#006747' },
};

const DynamicRecommendation: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const rec = (recommendations as ResultRecord[]).find(r => r.id === resultId);

  if (!rec) {
    return (
      <div className="recommendation-container">
        <h2>result did not find:{resultId}</h2>
      </div>
    );
  }

  const { bg, text, border } = themeMap[rec.id] || { bg: '#fff', text: '#000', border: '#000' };

  return (
    <div className="recommendation-container" style={{ backgroundColor: bg }}>
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src="/src/assets/NHS_LOGO.jpg" alt="NHS logo" />
          <img className="logo dipp-logo" src="/src/assets/DIPP_Study_logo.png" alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      <main className="recommendation-main" style={{ backgroundColor: bg }}>
        <section className="recommendation-card">
          <h1 className="recommendation-title" style={{ color: text, borderColor: border }}>
            {rec.title}
          </h1>
          <p className="recommendation-description">{rec.description}</p>

          {rec.bulletPoints && (
            <ul className="recommendation-bullets">
              {rec.bulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
            </ul>
          )}

          <div className="recommendation-actions">
            <button style={{ backgroundColor: border }} onClick={() => navigate('/optometrist/assess/')}>
              Return to Home
            </button>
          </div>
        </section>
      </main>

      <footer className="nhs-footer">
        <div className="footer-inner">
          <p>
            Other ways to contact DIPP if you have a hearing problem or need help in other languages&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">
              (opens in a new tab)
            </a>.
          </p>
          <hr />
          <ul className="footer-links">
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Privacy statement
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Terms and conditions
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Accessibility statement
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default DynamicRecommendation;