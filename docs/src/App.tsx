// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserSelectionPage from './pages/UserSelectionPage';
import * as Sidebar from './pages/sidebar';
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<WelcomePage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />
        <Route path="/settings"    element={<Sidebar.SettingsPage />} />
        <Route path="/about-us"       element={<Sidebar.AboutPage />} />
        <Route path="/contact-us"     element={<Sidebar.ContactPage />} />

        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*"      element={<PatientApp />} />
        <Route path="/gp/*"           element={<GPApp />} />
      </Routes>
    </BrowserRouter>
  );
}