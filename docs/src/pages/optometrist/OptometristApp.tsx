import { Routes, Route, Navigate } from 'react-router-dom';
import '../../styles/theme.css';
import AssessRouter from './assess/AssessRouter';  
import GuideRouter from './guide/GuideRouter';
import Records from './Records';
import Tutorial from './Tutorial';

/**
 * OptometristApp - main router for optometrist side of the app
 * - Defines routes for assessment, guide, records, and tutorial
 */
export default function OptometristApp() {
  return (
    <Routes>
      {/* /optometrist → redirect to assessment start page */}
      <Route index element={<Navigate to="assess/start-page" replace />} />

      {/* /optometrist/assess/* → assessment module (start-page, questions, recommendations) */}
      <Route path="assess/*" element={<AssessRouter />} />

      {/* /optometrist/guide/* → guide module (image gallery, tutorial) */}
      <Route path="guide/*" element={<GuideRouter />} />   

      {/* /optometrist/records → records page */}
      <Route path="records" element={<Records />} />

      {/* /optometrist/tutorial → optometrist tutorial */}
      <Route path="tutorial" element={<Tutorial />} />
    </Routes>
  );
}
