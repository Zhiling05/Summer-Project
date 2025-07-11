import { useNavigate } from "react-router-dom";
import "../../../../styles/question.css";
import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

//change 2
export default function EmergencyDepartment() {
  const navigate = useNavigate();

  return (
    <>
      <header className="nhs-header" style={{ 
        backgroundColor: "#005eb8",
        color: "white",
        padding: "12px 0"
      }}>
        <div className="nhs-header__inner" style={{ 
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center"
        }}>
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" style={{ height: "40px" }} />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" style={{ height: "40px", marginLeft: "20px" }} />
          <span className="nhs-header__service" style={{ 
            marginLeft: "auto",
            fontSize: "1.2rem",
            fontWeight: "bold"
          }}>
            DIPP Assessment
          </span>
        </div>
      </header>

      {/* 2. 全屏粉色背景（保持原内容不变） */}
      <div style={{ 
        backgroundColor: "#ffe4e6", // 保持原有粉色
        minHeight: "calc(100vh - 120px)",
        padding: "2rem 0",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        boxSizing: "border-box"
      }}>
        <div style={{ 
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 16px"
        }}>
          <section className="question-box" style={{ 
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            {/* >>> 原内容完全保持不变 <<< */}
            <h1
              className="nhsuk-heading-l"
              style={{
                color: "#d03838",
                borderBottom: "4px solid #d03838",
                paddingBottom: "0.5rem",
              }}
            >
              Immediate Referral
            </h1>
            <p>
              Send patient to <strong>Emergency Department</strong> Context XXXXX
            </p>
            <ul className="nhsuk-list nhsuk-list--bullet">
              <li>Context XXXXX</li>
              <li>Context XXXXX</li>
              <li>Context XXXXX</li>
            </ul>
            <button
              className="continue-button"
              onClick={() => navigate("/optometrist/assess/")}
              style={{ backgroundColor: "#d03838" }} 
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