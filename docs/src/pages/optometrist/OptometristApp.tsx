// docs/src/pages/optometrist/OptometristApp.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
//import '../../styles/question.css';ZSA 0811 注释掉，因为这个文件已经被融合进theme.css
import '../../styles/theme.css'; // ZSA 0811 确保引入主题
import AssessRouter from './assess/AssessRouter';  
import GuideRouter from './guide/GuideRouter';
import Records from './Records';
import TutorialRouter from './tutorial/TutorialRouter';//zkx

export default function OptometristApp() {
  return (
    <Routes>
      {/* /optometrist → 重定向到 assess/start-page */}
      <Route index element={<Navigate to="assess/start-page" replace />} />
      
      {/* /optometrist/assess/* → AssessRouter (start-page + Q1…Q19 + recommendations) */}
      <Route path="assess/*" element={<AssessRouter />} />
      
      {/* /optometrist/guide → Guide的Home页面 */}
      <Route path="guide/*" element={<GuideRouter />} />   

      {/* /optometrist/records → Records 页面 */}
      <Route path="records" element={<Records />} />
      <Route path="tutorial/*" element={<TutorialRouter />} />
    </Routes>
  );
}