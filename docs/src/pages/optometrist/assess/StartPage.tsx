import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/theme.css';
import '../../../styles/startpage.css';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';

/**
 * StartPage - Entry point of the assessment module
 * - Redirects to tutorial if user has not seen it
 * - Provides button to start the assessment (first question)
 */
export default function StartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem('seenAssessmentGuide') === 'true';
    if (!seen) {
      navigate('/optometrist/tutorial', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="startpage-page">
      <Header title="Assessment" />

      <main className="startpage-main">
        <div className="startpage-container">
          <h1 className="nhsuk-heading-l startpage-title">Assessment</h1>
          <p className="startpage-desc">
            This assessment can help determine appropriate referral recommendations based on the patient's symptoms.
          </p>
          <button
            id="start-now"
            className="continue-button startpage-button"
            onClick={() => navigate('../questions/Q1')}
          >
            Start Assessment
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
