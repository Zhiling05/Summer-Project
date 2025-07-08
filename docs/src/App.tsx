import { BrowserRouter, Routes, Route} from 'react-router-dom';

// 进入软件的logo页面
import LogoPage from './pages/LogoPage';

// 角色选择页面
import UserSelectionPage from './pages/UserSelectionPage';

// 各个角色的嵌套路由容器
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogoPage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />

        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*" element={<GPApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;