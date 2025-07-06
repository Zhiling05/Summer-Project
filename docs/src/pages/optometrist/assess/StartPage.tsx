import { useNavigate } from 'react-router-dom';
import '../../../styles/question.css';
import NHSLogo from '../../../assets/NHS_LOGO.jpg';
import DIPPLogo from '../../../assets/DIPP_Study_logo.png';

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ---------- 顶部栏 ---------- */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      {/* ========== 主体 ========== */}
      <div className="nhsuk-width-container">
        <main id="maincontent">
          {/* 返回根路径 */}
          <button className="back-button" onClick={() => navigate('/') }>
            ← Go back
          </button>

          <section className="question-box">
            <h1 className="nhsuk-heading-l">Check your symptoms</h1>
            <p className="nhsuk-body">
              Welcome to the DIPP referral pathway assessment. We’ll ask you a few questions
              about the patient’s symptoms and signs – at the end, you’ll get the recommended
              next steps for referral.
            </p>
            <ul className="nhsuk-list nhsuk-list--bullet">
              <li>Identify red-flag symptoms for immediate action</li>
              <li>Determine if urgent ophthalmology or neurology review is needed</li>
              <li>Offer appropriate follow-up or no referral where safe</li>
            </ul>

            <button
              className="continue-button"
              onClick={() => navigate('../questions/Q1')}
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
