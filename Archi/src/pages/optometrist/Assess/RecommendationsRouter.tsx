import { Routes, Route } from 'react-router-dom';
import RecommendEmergencyDepartment from './RecommendEmergencyDepartment';
import RecommendImmediate from './RecommendImmediate';
import RecommendUrgentToOph from './RecommendUrgentToOph';
import RecommendUrgentToGpOrNeur from './RecommendUrgentToGpOrNeur';
import RecommendToGp from './RecommendToGp';
import RecommendNoReferral from './RecommendNoReferral';


function RecommendationsRouter() {
  return (
    <Routes>
      <Route path="emergencyDepartment" element={<RecommendEmergencyDepartment />} />
      <Route path="immediate" element={<RecommendImmediate />} />
      <Route path="urgentToOph" element={<RecommendUrgentToOph />} />
      <Route path="urgentToGpOrNeur" element={<RecommendUrgentToGpOrNeur />} />
      <Route path="toGp" element={<RecommendToGp />} />
      <Route path="noReferral" element={<RecommendNoReferral />} />
    </Routes>
  );
}

export default RecommendationsRouter;
