import { useNavigate } from "react-router-dom";
import "../../styles/question.css";
import Header from "../../components/Header";   // lzl: 新增header组件
// import NHSLogo from "../../assets/NHS_LOGO.jpg";
// import DIPPLogo from "../../assets/DIPP_Study_logo.png"; 
import BottomNav from "../../components/BottomNav";
export default function Records() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Records" />

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
          <h1 style={{ 
            color: "#005eb8",
            fontSize: "1.8rem",
            marginBottom: "2rem"
          }}>
            Records
          </h1>

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
                backgroundColor: "#d03838", 
                padding: "1rem",
                borderRadius: "4px",
                textAlign: "center",
                color: "white" 
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>32</div>
                <div>cases</div>
              </div>
              <div style={{ 
                backgroundColor: "#e67e00", 
                padding: "1rem",
                borderRadius: "4px",
                textAlign: "center",
                color: "white" 
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>25</div>
                <div>cases</div>
              </div>
              <div style={{ 
                backgroundColor: "#006747", 
                padding: "1rem",
                borderRadius: "4px",
                textAlign: "center",
                color: "white" 
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>18</div>
                <div>cases</div>
              </div>
            </div>

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

      
      {/* 底部导航 */}
      <BottomNav />
    </>
  );
}