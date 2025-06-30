import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 一级页面
import UserSelectionPage from './pages/UserSelectionPage';

// 模块路由组件
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* 用户选择页（统一入口） */}
        <Route path="/" element={<UserSelectionPage />} />

        {/* 各角色应用的嵌套路由容器 */}
        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*" element={<GPApp />} />
      </Routes>
    </Router>
  );
}

export default App;