import { Routes, Route } from 'react-router-dom';
import Guide from './Guide';
import AssessRouter from './assess/AssessRouter';
import Records from './Records';

function OptometristApp() {
  return (
    <Routes>
      <Route path="guide" element={<Guide />} />
      <Route path="assess/*" element={<AssessRouter />} />
      <Route path="records" element={<Records />} />
    </Routes>
  );
}

export default OptometristApp;
