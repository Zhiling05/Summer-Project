// docs/src/pages/patient/PatientApp.tsx
import { useNavigate } from 'react-router-dom';
//import '../../styles/question.css';ZSA 0811 注释掉，因为这个文件已经被融合进theme.css
import '../../styles/theme.css'; // ZSA 0811 确保引入主题
import NHSLogo from '../../assets/NHS_LOGO.jpg';
import DIPPLogo from '../../assets/DIPP_Study_logo.png';
import BackButton from '../../components/BackButton';

export default function PatientApp() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 顶部横幅 */}
      <header className="nhs-header">
        <div
          className="nhs-header__inner"
          style={{ maxWidth: '100%', margin: 0, padding: '12px 24px' }}
        >
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">PatientApp</span>
        </div>
      </header>

      {/* 回退按钮 */}
      <BackButton />

      {/* 主体内容区 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="nhsuk-width-container">
          <h1 className="nhsuk-heading-l">PatientApp</h1>
          <p>context line 1</p>
          <p>context line 2</p>
          <p>context line 3</p>
        </div>
      </div>
    </div>
  );
}
