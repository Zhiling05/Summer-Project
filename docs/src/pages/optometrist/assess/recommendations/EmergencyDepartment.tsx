import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

export default function EmergencyDepartment() {
  const navigate = useNavigate();

  return (
    <>
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      {/* Pink background section */}
      <div
        style={{
          backgroundColor: "#ffe4e6",
          padding: "2rem 0",
          minHeight: "80vh",
        }}
      >
        <div className="nhsuk-width-container">
          <section className="question-box">
            <h1
              className="nhsuk-heading-l"
              style={{
                color: "#d03838",
                borderBottom: "4px solid #d03838",
                paddingBottom: "0.5rem",
              }}
            >
              Immediate referral
            </h1>
            <p>
              Send patient to <strong>Emergency Department</strong> immediately for further evaluation and management, including but not limited to:
            </p>
            <ul className="nhsuk-list nhsuk-list--bullet">
              <li>Continuous monitoring of vital signs</li>
              <li>Immediate neuroimaging (CT/MRI) as indicated</li>
              <li>Activate urgent neurology or ophthalmology consultation</li>
            </ul>
            <button
              className="continue-button"
              onClick={() => navigate("/optometrist/assess/")}
            >
              Return to Home
            </button>
          </section>
        </div>
      </div>

      <footer className="nhs-footer">
        <div className="footer-inner">
          <p>
            Other ways to contact DIPP if you have a hearing problem or need help in other languages&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">
              (opens in a new tab)
            </a>.
          </p>
          <hr />
          <ul className="footer-links">
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Privacy statement
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Terms and conditions
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Accessibility statement
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
