// docs/src/pages/optometrist/OptometristApp.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../../styles/question.css';
import NHSLogo from '../../assets/NHS_LOGO.jpg';
import DIPPLogo from '../../assets/DIPP_Study_logo.png';
import BackButton from '../../components/BackButton';
import AssessRouter from './assess/AssessRouter';
import Guide from './Guide'; 
import Records from './Records';

export default function OptometristApp() {
  const navigate = useNavigate();

  // 首页
  const Home = () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 顶栏 */}
      <header className="nhs-header">
        <div
          className="nhs-header__inner"
          style={{ maxWidth: '100%', margin: 0, padding: '12px 24px' }}
        >
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">OptometristApp</span>
        </div>
      </header>

      {/* 回退按钮 */}
      <BackButton />

      {/* 主体 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="nhsuk-width-container">
          <h1 className="nhsuk-heading-l">OptometristApp</h1>
          <p>context line 1</p>
          <p>context line 2</p>
          <p>context line 3</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="continue-button" onClick={() => navigate('assess/questions/Q1')}>
              Access Assessment
            </button>
            <button className="continue-button" onClick={() => navigate('records')} 
              style={{ backgroundColor: '#005eb8' }}>
              View Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* /optometrist → Home */}
      <Route index element={<Home />} />
      {/* /optometrist/assess/* → AssessRouter (Q1…Q19 + recommendations) */}
      <Route path="assess/*" element={<AssessRouter />} />
      {/* /optometrist/guide → Guide 页面 */}
      <Route path="guide" element={<Guide />} />

      {/* /optometrist/records → Records 页面 */}
      <Route path="records" element={<Records />} />
    </Routes>
  );
}
