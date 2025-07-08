<<<<<<< HEAD
import { BrowserRouter, Routes, Route} from 'react-router-dom';

// 进入软件的logo页面
import LogoPage from './pages/LogoPage';

// 角色选择页面
import UserSelectionPage from './pages/UserSelectionPage';

// 各个角色的嵌套路由容器
=======
// docs/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoPage from './pages/LogoPage';
import UserSelectionPage from './pages/UserSelectionPage';
>>>>>>> remotes/origin/Junjie_develop
import OptometristApp from './pages/optometrist/OptometristApp';
import PatientApp from './pages/patient/PatientApp';
import GPApp from './pages/gp/GPApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<LogoPage />} />
        <Route path="/select-role" element={<UserSelectionPage />} />

        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*" element={<GPApp />} />
=======
        {/* 根路径 / 就是我们刚写的 LogoPage */}
        <Route path="/" element={<LogoPage />} />

        {/* 角色选择页，如需保留 */}
        <Route path="/select-role" element={<UserSelectionPage />} />

        {/* 各角色嵌套路由 */}
        <Route path="/optometrist/*" element={<OptometristApp />} />
        <Route path="/patient/*" element={<PatientApp />} />
        <Route path="/gp/*"       element={<GPApp />} />
>>>>>>> remotes/origin/Junjie_develop
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> remotes/origin/Junjie_develop
