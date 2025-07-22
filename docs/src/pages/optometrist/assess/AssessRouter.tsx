// docs/src/pages/optometrist/assess/AssessRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import StartPage             from './StartPage';
import DynamicQuestion       from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';
import PreviewReport         from './recommendations/PreviewReport';   // ★ 新增

export default function AssessRouter() {
  return (
    <Routes>
      {/* 默认跳到 start-page */}
      <Route path=""           element={<Navigate to="start-page" replace />} />
      <Route path="start-page" element={<StartPage />} />

      {/* 所有题目：由 DynamicQuestion 统一处理 */}
      <Route
        path="questions/:questionId"
        element={<DynamicQuestion />}
      />

      {/* 纯文本报告预览页（供推荐页跳转） */}
      <Route
        path="recommendations/report-preview"
        element={<PreviewReport />}
      />

      {/* 各种推荐结果页 */}
      <Route
        path="recommendations/:resultId"
        element={<DynamicRecommendation />}
      />
    </Routes>
  );
}
