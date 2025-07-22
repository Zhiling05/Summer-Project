// src/pages/optometrist/assess/recommendations/RecommendationsRouter.tsx
import { Routes, Route } from 'react-router-dom';
import DynamicRecommendation from './DynamicRecommendation';

export default function RecommendationsRouter() {
  return (
    <Routes>
      <Route path=":resultId" element={<DynamicRecommendation />} />
    </Routes>
  );
}
