// docs/src/pages/optometrist/assess/StartPage.tsx
import { useNavigate } from 'react-router-dom';
import '../../../styles/question.css';
import Header from '../../../components/Header';   // lzl新增：使用header组件
// import NHSLogo from '../../../assets/NHS_LOGO.jpg';
// import DIPPLogo from '../../../assets/DIPP_Study_logo.png';
import BackButton from '../../../components/BackButton';

export default function StartPage() {
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
          <span className="nhs-header__service">Assessment</span>
        </div>
      </header> */}
      <Header title="Assessment" />
      <BackButton />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="nhsuk-width-container">
          <h1 className="nhsuk-heading-l">StartPage</h1>
          <p>context line 1</p>
          <p>context line 2</p>
          <p>context line 3</p>
          <button
            className="continue-button"
            onClick={() => navigate('questions/Q1')}
          >
            Start now
          </button>
        </div>
      </div>
    </div>
  );
}
