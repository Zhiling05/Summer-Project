// src/pages/optometrist/assess/AssessRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './StartPage';
import QuestionsRouter from './questions/QuestionsRouter';
import DynamicQuestion from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';

export default function AssessRouter() {
  return (
    <Routes>
      <Route path=""                element={<Navigate to="start-page" replace />} />
      <Route path="start-page"      element={<StartPage />} />
      <Route path="questions/*"     element={<QuestionsRouter />} />
      <Route path="questions/:id"   element={<DynamicQuestion />} />
      {/* ✅ 所有结果页统一由 DynamicRecommendation 渲染 */}
      <Route path=":resultId"       element={<DynamicRecommendation />} />
    </Routes>
  );
}