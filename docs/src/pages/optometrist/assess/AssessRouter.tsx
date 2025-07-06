import { Routes, Route, Navigate } from 'react-router-dom';
import RecommendationsRouter from './recommendations/RecommendationsRouter';
import QuestionsRouter from './questions/QuestionsRouter';
import StartPage from './StartPage';

export default function AssessRouter() {
  return (
    <Routes>
      {/* 默认：访问 /optometrist/assess/ 时重定向到开始页 */}
      <Route path="" element={<Navigate to="start-page" replace />} />

      {/* 介绍／开始页面 */}
      <Route path="start-page" element={<StartPage />} />

      {/* 问题流程 */}
      <Route path="questions/*" element={<QuestionsRouter />} />

      {/* 转诊建议页面 */}
      <Route path="recommendations/*" element={<RecommendationsRouter />} />
    </Routes>
  );
}
