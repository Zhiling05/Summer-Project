// docs/src/pages/UserSelectionPage.tsx
import { useNavigate } from 'react-router-dom';
import '../styles/question.css';

// import NHSLogo from '../assets/NHS_LOGO.jpg';
// import DIPPLogo from '../assets/DIPP_Study_logo.png';
import Header from '../components/Header';   // lzl： 使用Header组件
// 以下这个退回键没有被使用
// import BackButton from '../components/BackButton';

export default function UserSelectionPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/*--------lzl修改：使用header组件--------------------------  */}
      {/* <header className="nhs-header">
        <div
          className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <BackButton />
          <span className="nhs-header__service">Select Role</span>
        </div>
      </header> */}
      <Header title="Select Role" />


      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="nhsuk-width-container">
          <h1 className="nhsuk-heading-l">UserSelectionPage</h1>
          <p>context line 1</p>
          <p>context line 2</p>
          <p>context line 3</p>
          <div
              data-testid="role-selection-container"
              className="responsive-layout" //为了测试代码加的class名
              style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="continue-button"
              onClick={() => navigate('/gp')}
            >
              Doctor
            </button>
            <button
              className="continue-button"
              onClick={() => navigate('/optometrist')}
            >
              Optometrist
            </button>
            <button
              className="continue-button"
              onClick={() => navigate('/patient')}
            >
              Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
