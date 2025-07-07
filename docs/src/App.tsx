import { BrowserRouter, Routes, Route} from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import UserSelectionPage from './pages/UserSelectionPage';

// 新增：设置、联系我们、关于我们 三个页面
import SettingsPage from './pages/navigation/SettingsPage';
import ContactUsPage from './pages/navigation/ContactUsPage';
import AboutUsPage from './pages/navigation/AboutUsPage';

import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome-page" element={<WelcomePage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />

        {/* 新增以下三个页面：都属于导航栏组件，全局直接访问，不区分角色，并创建了一个index.ts，可
        一次性导入，index.ts在pages/navigation/中 */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />

        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*" element={<GPApp />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;