import { Routes, Route } from 'react-router-dom';
import EmergencyDepartment from './EmergencyDepartment';
import Immediate from './Immediate';
import UrgentToOph from './UrgentToOph';
import UrgentToGpOrNeur from './UrgentToGpOrNeur';
import ToGp from './ToGp';
import NoReferral from './NoReferral';


function RecommendationsRouter() {
  return (
    <Routes>
      <Route path="emergencyDepartment" element={<EmergencyDepartment />} />
      <Route path="immediate" element={<Immediate />} />
      <Route path="urgentToOph" element={<UrgentToOph />} />
      <Route path="urgentToGpOrNeur" element={<UrgentToGpOrNeur />} />
      <Route path="toGp" element={<ToGp />} />
      <Route path="noReferral" element={<NoReferral />} />
    </Routes>
  );
}

export default RecommendationsRouter;
