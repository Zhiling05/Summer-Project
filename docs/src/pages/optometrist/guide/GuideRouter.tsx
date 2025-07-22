import { Routes, Route } from 'react-router-dom';
import GuideHome from './GuideHome';
import ImageGallery from './ImageGallery';

export default function GuideRouter() {
  return (
    <Routes>
      <Route index element={<GuideHome />} />
      <Route path="gallery" element={<ImageGallery />} />
    </Routes>
  );
}