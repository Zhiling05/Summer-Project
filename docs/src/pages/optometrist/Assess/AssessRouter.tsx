
import { Routes, Route } from 'react-router-dom';
import RecommendationsRouter from './recommendations/RecommendationsRouter';
import QuestionsRouter from './questions/QuestionsRouter';
import StartPage from './StartPage';


function Assess() {
  return (
    <Routes>
      {/* 点击Assess后出现的开始页面 */}
      <Route path="startPage" element={<StartPage />} />
      <Route path="questions/*" element={<QuestionsRouter />} />

      {/* 6种可能出现的转诊页面，如果前端后续认为只需一个页面，其根据逻辑进行渲染，而不需要提前
      设计好6个页面，可以换成仅一个路径 */}
      <Route path="recommendations/*" element={<RecommendationsRouter />} />
    </Routes>
  );
}

export default Assess;
