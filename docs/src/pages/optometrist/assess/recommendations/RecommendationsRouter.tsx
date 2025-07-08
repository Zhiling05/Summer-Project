// src/pages/optometrist/assess/recommendations/RecommendationsRouter.tsx
import { Routes, Route } from 'react-router-dom';
import EmergencyDepartment   from './EmergencyDepartment';
import Immediate             from './Immediate';
import UrgentToOph           from './UrgentToOph';
import UrgentToGpOrNeur      from './UrgentToGpOrNeur';
import ToGp                  from './ToGp';
import NoReferral            from './NoReferral';

export default function RecommendationsRouter() {
  return (
    <Routes>
      <Route path="emergency-department" element={<EmergencyDepartment />} />
      <Route path="immediate"             element={<Immediate />} />
      <Route path="urgent-to-oph"         element={<UrgentToOph />} />
      <Route path="urgent-to-gp-or-neur"  element={<UrgentToGpOrNeur />} />
      <Route path="to-gp"                 element={<ToGp />} />
      <Route path="no-referral"           element={<NoReferral />} />
    </Routes>
  );
}