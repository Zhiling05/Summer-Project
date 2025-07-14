// src/pages/optometrist/assess/AssessRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './StartPage';
import QuestionsRouter from './questions/QuestionsRouter';
import RecommendationsRouter from './recommendations/RecommendationsRouter';

export default function AssessRouter() {
  return (
    <Routes>
      <Route path=""           element={<Navigate to="start-page" replace />} />
      <Route path="start-page" element={<StartPage />} />
      <Route path="questions/*" element={<QuestionsRouter />} />
      <Route path="recommendations/*" element={<RecommendationsRouter />} />
    </Routes>
  );
}