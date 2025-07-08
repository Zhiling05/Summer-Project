// docs/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoPage from './pages/LogoPage';
import UserSelectionPage from './pages/UserSelectionPage';
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 根路径 / 就是我们刚写的 LogoPage */}
        <Route path="/" element={<LogoPage />} />

        {/* 角色选择页，如需保留 */}
        <Route path="/select-role" element={<UserSelectionPage />} />

        {/* 各角色嵌套路由 */}
        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*"       element={<GPApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
