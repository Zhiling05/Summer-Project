// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserSelectionPage from './pages/UserSelectionPage';
import * as Navigation from './pages/navigation';
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<WelcomePage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />
        <Route path="/settings"    element={<Navigation.SettingsPage />} />
        <Route path="/about"       element={<Navigation.AboutPage />} />
        <Route path="/contact"     element={<Navigation.ContactPage />} />

        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*"      element={<PatientApp />} />
        <Route path="/gp/*"           element={<GPApp />} />
      </Routes>
    </BrowserRouter>
  );
}