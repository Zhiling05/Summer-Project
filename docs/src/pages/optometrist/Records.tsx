import { useNavigate } from "react-router-dom";
import "../../styles/question.css";
import NHSLogo from "../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../assets/DIPP_Study_logo.png"; 
export default function Records() {
  const navigate = useNavigate();

  return (
    <>
      {/* 标准蓝色页眉 */}
      <header className="nhs-header" style={{ 
        backgroundColor: "#005eb8",
        color: "white",
        padding: "12px 0"
      }}>
        <div style={{ 
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center"
        }}>
          <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" style={{ height: "40px" }} />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" style={{ height: "40px", marginLeft: "20px" }} />
          <span style={{ 
            marginLeft: "auto",
            fontSize: "1.2rem",
            fontWeight: "bold"
          }}>
            DIPP Assessment
          </span>
        </div>
      </header>

      {/* 全屏浅灰色背景 */}
      <div style={{ 
        backgroundColor: "#f0f4f5",
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
          {/* 标题区域 */}
          <h1 style={{ 
            color: "#005eb8",
            fontSize: "1.8rem",
            marginBottom: "2rem"
          }}>
            Records
          </h1>

          {/* 近期记录区域 */}
          <section style={{ 
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "2rem"
          }}>
            <h2 style={{ 
              color: "#212b32",
              fontSize: "1.4rem",
              borderBottom: "2px solid #d8dde0",
              paddingBottom: "0.5rem",
              marginTop: 0
            }}>
              Recent Assessment Records
            </h2>

            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              margin: "1.5rem 0"
            }}>
              <div style={{ 
                backgroundColor: "#d03838", // 红色
                padding: "1rem",
                borderRadius: "4px",
                textAlign: "center",
                color: "white" // 文字设为白色
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>32</div>
                <div>cases</div>
              </div>
              <div style={{ 
                backgroundColor: "#e67e00", // 橙色
                padding: "1rem",
                borderRadius: "4px",
                textAlign: "center",
                color: "white" // 文字设为白色
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>25</div>
                <div>cases</div>
              </div>
              <div style={{ 
                backgroundColor: "#006747", // 绿色
                padding: "1rem",
                borderRadius: "4px",
                textAlign: "center",
                color: "white" // 文字设为白色
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>18</div>
                <div>cases</div>
              </div>
            </div>

            {/* 记录表格 */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                width: "100%",
                borderCollapse: "collapse"
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #d8dde0"
                  }}>
                    <th style={{ 
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: "600"
                    }}>Date & Result</th>
                    <th style={{ 
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: "600"
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e8edee" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div>2025/06/20 14:32</div>
                      <div style={{ color: "#006747", fontWeight: "500" }}>No referral needed</div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button 
                        onClick={() => navigate("/records/detail")}
                        style={{
                          backgroundColor: "transparent",
                          color: "#005eb8",
                          border: "1px solid #005eb8",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e8edee" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div>2025/06/18 10:05</div>
                      <div style={{ color: "#d32f2f", fontWeight: "500" }}>Send to Emergency Department immediately</div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button 
                        onClick={() => navigate("/records/detail")}
                        style={{
                          backgroundColor: "transparent",
                          color: "#005eb8",
                          border: "1px solid #005eb8",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 16px" }}>
                      <div>2025/06/20 16:20</div>
                      <div style={{ color: "#d32f2f", fontWeight: "500" }}>Send to Emergency Department immediately</div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button 
                        onClick={() => navigate("/records/detail")}
                        style={{
                          backgroundColor: "transparent",
                          color: "#005eb8",
                          border: "1px solid #005eb8",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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