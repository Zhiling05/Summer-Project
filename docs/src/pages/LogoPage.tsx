<<<<<<< HEAD
function LogoPage() {
  return <h1>Logo Page</h1>;
}

export default LogoPage;
=======
import { useNavigate } from 'react-router-dom';
import '../styles/question.css';        // 引入 NHS 头尾、按钮 等样式
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';

export default function LogoPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ---------- 顶部栏 ---------- */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Study</span>
        </div>
      </header>

      {/* ========== 主体 ========== */}
      <div className="nhsuk-width-container">
        <main id="maincontent">
          <section className="question-box">
            <h1 className="nhsuk-heading-l">Welcome to the DIPP Study</h1>
            <p className="nhsuk-body">
              This tool will guide you through the DIPP referral pathway assessment,
              helping you identify red-flag symptoms, produce consensus
              recommendations, and ultimately improve patient care.
            </p>
            <ul className="nhsuk-list nhsuk-list--bullet">
              <li>Identify how optometrists manage patients with potential papilloedema</li>
              <li>Co-produce and trial consensus guidelines with PPI input</li>
              <li>Evaluate the impact on NHS resources and patient experience</li>
            </ul>

            <button
              className="continue-button"
              onClick={() => navigate('/optometrist/assess/start-page')}
            >
              Start now
            </button>
          </section>
        </main>
      </div>

      {/* ========== 页脚 ========== */}
      <footer className="nhs-footer">
        <div className="footer-inner">
          <p>
            Other ways to contact DIPP if you have a hearing problem or need help in other languages&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">(opens in a new tab)</a>.
          </p>
          <hr />
          <p>The following links open in a new tab:</p>
          <ul className="footer-links">
            <li><a href="#/" target="_blank" rel="noopener noreferrer">Privacy statement</a></li>
            <li><a href="#/" target="_blank" rel="noopener noreferrer">Terms and conditions</a></li>
            <li><a href="#/" target="_blank" rel="noopener noreferrer">Accessibility statement</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
>>>>>>> remotes/origin/Junjie_develop
