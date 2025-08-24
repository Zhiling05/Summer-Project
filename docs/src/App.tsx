// docs/src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserSelectionPage from './pages/UserSelectionPage';
import * as Sidebar from './pages/sidebar';  // 引入你自己的 Sidebar
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';
import ContactPage from './pages/sidebar/ContactPage'; //zkx
import SettingsPage from './pages/sidebar/SettingsPage'; //zkx
import { FontSizeProvider, useFontSize } from './pages/sidebar/FontSizeContext'; //zkx
import SideBar from './components/SideBar';  // 引入你自己写的 SideBar 组件
import './styles/theme.css'; //深浅色主题

import { ensureGuest } from './api/index';
import AdminDashboard from "./pages/admin/Admin.tsx";

export default function App() {
  useEffect(() => { ensureGuest().catch(console.error); }, []); //先设置cookie
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
      {/* 确保在每个页面中都能访问到 SideBar */}
      <SideBar />
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
    </BrowserRouter>
  );
};
