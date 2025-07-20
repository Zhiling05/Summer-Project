import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { createAssessment, Answer, UserRole } from '../../../../api';
import "../../../../styles/question.css";
import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";


interface LocationState {
  // 假设前一个页面 navigate 时写了：
  // navigate('/optometrist/assess/recommendations/immediate', { state: { answers, patientId } })
  answers: Answer[];
  patientId: string;
  recommendation: string; // 'Immediate'
}

export default function Immediate() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  // 额外一个本地 loading 和 error UI 状态
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果没有答案，从头开始
    if (!state?.answers?.length || !state.patientId) {
      setError('缺少答题数据，请重新开始 Assessment');
      setSaving(false);
      return;
    }

    (async () => {
      try {
        // 调用后端接口保存：answers + recommendation
        await createAssessment({
          role: 'optometrist' as UserRole,
          patientId: state.patientId,
          answers: state.answers,
          recommendation: state.recommendation,
        });
      } catch (e) {
        console.error(e);
        setError((e as Error).message);
      } finally {
        setSaving(false);
      }
    })();
  }, []);

  // 如果正在保存，先给个 loading 提示
  if (saving) {
    return <div>正在保存你的 Assessment…</div>;
  }

  // 如果保存失败，给个错误和重试按钮
  if (error) {
    return (
      <div>
        <p>保存失败：{error}</p>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    );
  }


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

      <div style={{ 
        backgroundColor: "#ffebee",
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
            <h1 style={{ 
              color: "#d32f2f",
              borderBottom: "4px solid #d32f2f",
              paddingBottom: "0.5rem",
              fontSize: "1.5rem",
              marginTop: 0
            }}>
              IMMEDIATE REFERRAL TO EYE EMERGENCY ON CALL
            </h1>
            <p style={{ fontSize: "1.1rem" }}>
              This patient requires immediate ophthalmology review.
            </p>
            <ul style={{ 
              paddingLeft: "20px",
              margin: "1rem 0"
            }}>
              <li>Context XXXXX</li>
              <li>Context XXXXX</li>
              <li>Context XXXXX</li>
            </ul>
            <button
              onClick={() => navigate("/optometrist/assess/")}
              style={{ 
                backgroundColor: "#d32f2f",
                color: "white",
                border: "none",
                padding: "10px 20px",
                fontSize: "1rem",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "2rem"
              }}
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