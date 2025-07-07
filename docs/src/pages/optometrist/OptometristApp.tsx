import { Routes, Route } from 'react-router-dom';
import Guide from './Guide';
import AssessRouter from './assess/AssessRouter';
import Records from './Records';
import TutorialRouter from './tutorial/TutorialRouter';

function OptometristApp() {
  return (
    <Routes>
      <Route path="guide" element={<Guide />} />
      <Route path="assess/*" element={<AssessRouter />} /> 
      <Route path="records" element={<Records />} />
      {/* 新增以下页面组件：教程*/}
      <Route path="/tutorial/*" element={<TutorialRouter />} />  
    </Routes>
  );
}

export default OptometristApp;
