import { Routes, Route } from 'react-router-dom';
import GuideHome from './GuideHome';
import ImageGallery from './ImageGallery';
import OptAppTutorial from './OptAppTutorial';

export default function GuideRouter() {
  return (
    <Routes>
      <Route index element={<GuideHome />} />
      <Route path="gallery" element={<ImageGallery />} />

      <Route path="tutorial" element={<OptAppTutorial />} />
    </Routes>
  );
}