import { Routes, Route } from 'react-router-dom';
import Guide from './Guide';
import AssessRouter from './assess/AssessRouter';
import Records from './Records';

function OptometristApp() {
  return (
    <Routes>
      <Route path="guide" element={<Guide />} />
<<<<<<< HEAD
      {/* 现在只写了assess的页面路径，其他的后面会慢慢补充 */}
      <Route path="assess/*" element={<AssessRouter />} /> 
=======
      <Route path="assess/*" element={<AssessRouter />} />
>>>>>>> remotes/origin/Junjie_develop
      <Route path="records" element={<Records />} />
    </Routes>
  );
}

export default OptometristApp;
