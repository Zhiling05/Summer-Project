import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";

import StartPage from './StartPage';
import DynamicQuestion from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';

/**
 * AssessRouter - route controller for optometrist assessment module
 * - Handles start page, question pages, and recommendation results
 * - Auto-resumes unfinished assessments on start page
 */
export default function AssessRouter(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-resume unfinished assessment when entering start-page
  useEffect(() => {
    const path = location.pathname;
    const isStart = path.endsWith('/assess/start-page');
    if (!isStart) return;

    const started = sessionStorage.getItem('assessStarted') === 'true';
    const lastQ = sessionStorage.getItem('lastQuestionId');
    const completed = sessionStorage.getItem('assessmentComplete') === 'true';

    if (started && lastQ && !completed) {
      navigate(`/optometrist/assess/questions/${lastQ}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="" element={<Navigate to="start-page" replace />} />
      <Route path="start-page" element={<StartPage />} />
      <Route path="questions/:questionId" element={<DynamicQuestion />} />
      <Route
        path="recommendations/:resultId/:assessmentId"
        element={<DynamicRecommendation />}
      />
    </Routes>
  );
}
