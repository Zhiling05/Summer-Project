import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserSelectionPage from './pages/UserSelectionPage';
import * as Sidebar from './pages/sidebar';
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';
import AboutPage from './pages/sidebar/AboutPage'; //zkx
import ContactPage from './pages/sidebar/ContactPage'; //zkx
import SettingsPage from './pages/sidebar/SettingsPage'; //zkx
import { FontSizeProvider, useFontSize } from './pages/sidebar/FontSizeContext'; //zkx

export default function App() {
  return (
    <FontSizeProvider>
      <FontSizeAwareApp />
    </FontSizeProvider>
  );
}

const FontSizeAwareApp = () => {
  const { fontSize } = useFontSize(); // 获取当前字体大小

  // 在组件加载时设置字体大小
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize); // 设置全局 CSS 变量
  }, [fontSize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />
        <Route path="/settings" element={<Sidebar.SettingsPage />} />
        <Route path="/about-us" element={<Sidebar.AboutPage />} />
        <Route path="/contact-us" element={<Sidebar.ContactPage />} />
        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*" element={<GPApp />} />
      </Routes>
    </BrowserRouter>
  );
};
