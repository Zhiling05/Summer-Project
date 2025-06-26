import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// ========== 共享页面组件 ==========
const UserSelectionPage = () => <div>用户选择页面</div>;

// ========== 验光师应用组件 ==========
const OptometristHome = () => <div>验光师首页</div>;
const OptometristRecords = () => <div>验光师记录页面</div>;
const OptometristGuide = () => <div>验光师指南页面</div>;

// ========== 评估容器组件 (架构组定义路由结构，前端开发组实现具体页面组件) ==========
const OptometristAssess = () => {
  return (
    <Routes>
      {/* TODO: 前端开发组创建对应的页面组件 */}
      <Route path="/start" element={<div>评估开始页面</div>} />
      <Route path="/q1" element={<div>问题1页面</div>} />
      <Route path="/q2" element={<div>问题2页面</div>} />
      <Route path="/q3" element={<div>问题3页面</div>} />
      <Route path="/result" element={<div>评估结果页面</div>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ========== 主页 ========== */}
        <Route path="/" element={<UserSelectionPage />} />
        
        {/* ========== 验光师应用 ========== */}
        <Route path="/optometrist" element={<OptometristHome />} />
        <Route path="/optometrist/assess" element={<OptometristAssess />} />
        <Route path="/optometrist/records" element={<OptometristRecords />} />
        <Route path="/optometrist/guide" element={<OptometristGuide />} />
      </Routes>
    </Router>
  );
}

export default App;
