// src/pages/optometrist/tutorial/TutorialRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Tutorial1 from './Tutorial1';
import Tutorial2 from './Tutorial2';
import Tutorial3 from './Tutorial3';

export default function TutorialRouter() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="1" replace />} />
      <Route path="1" element={<Tutorial1 />} />
      <Route path="2" element={<Tutorial2 />} />
      <Route path="3" element={<Tutorial3 />} />
    </Routes>
  );
}