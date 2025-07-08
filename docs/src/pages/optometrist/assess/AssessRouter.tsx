<<<<<<< HEAD

import { Routes, Route } from 'react-router-dom';
=======
import { Routes, Route, Navigate } from 'react-router-dom';
>>>>>>> remotes/origin/Junjie_develop
import RecommendationsRouter from './recommendations/RecommendationsRouter';
import QuestionsRouter from './questions/QuestionsRouter';
import StartPage from './StartPage';

<<<<<<< HEAD

function Assess() {
  return (
    <Routes>
      {/* 点击Assess后出现的开始页面 */}
      <Route path="start-page" element={<StartPage />} />
      <Route path="questions/*" element={<QuestionsRouter />} />

      {/* 6种可能出现的转诊页面，如果前端后续认为只需一个页面，其根据逻辑进行渲染，而不需要提前
      设计好6个页面，可以换成仅一个路径 */}
=======
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
>>>>>>> remotes/origin/Junjie_develop
      <Route path="recommendations/*" element={<RecommendationsRouter />} />
    </Routes>
  );
}
<<<<<<< HEAD

export default Assess;
=======
>>>>>>> remotes/origin/Junjie_develop
