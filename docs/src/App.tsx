import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserSelectionPage from './pages/UserSelectionPage';
import * as Sidebar from './pages/sidebar';
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';
import { FontSizeProvider, useFontSize } from './pages/sidebar/FontSizeContext';
import SideBar from './components/SideBar';
import './styles/theme.css';
import { ensureGuest } from './api/index';
import AdminDashboard from "./pages/admin/Admin.tsx";

/**
 * App - root component
 * - Provides font size context and global routing
 * - Hides sidebar on WelcomePage for clean splash screen
 */
export default function App() {
  useEffect(() => { ensureGuest().catch(console.error); }, []);
  return (
    <FontSizeProvider>
      <BrowserRouter>
        <FontSizeAwareApp />
      </BrowserRouter>
    </FontSizeProvider>
  );
}

const FontSizeAwareApp = () => {
  const { fontSize } = useFontSize();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize);
  }, [fontSize]);

  // Hide sidebar on WelcomePage
  const hideSidebar = location.pathname === "/";

  return (
    <>
      {!hideSidebar && <SideBar />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />
        <Route path="/settings" element={<Sidebar.SettingsPage />} />
        <Route path="/contact-us" element={<Sidebar.ContactPage />} />
        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*" element={<GPApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};
