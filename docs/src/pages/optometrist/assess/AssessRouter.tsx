import { Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './StartPage';
// import QuestionsRouter from './questions/QuestionsRouter';
import DynamicQuestion from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';

export default function AssessRouter() {
  return (
    <Routes>
      {/* 默认跳到 start-page */}
      <Route path=""           element={<Navigate to="start-page" replace />} />
      <Route path="start-page" element={<StartPage />} />

      {/*
      // ↓ 旧的两条 questions 路由，先注释掉
      // <Route path="questions/*"   element={<QuestionsRouter />} />
      // <Route path="questions/:id" element={<DynamicQuestion />} />
      */}

      {/* 统一由 DynamicQuestion 处理所有 questions/<id> */}
      <Route
        path="questions/:questionId"
        element={<DynamicQuestion />}
      />

      {/* 所有 recommendation 结果页 */}
      <Route
        path="recommendations/:resultId"
        element={<DynamicRecommendation />}
      />
    </Routes>
  );
}
