import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchReportText,
  exportAssessment,
  getAssessment,
} from "../../../../api";
import { saveAs } from "file-saver";
import recommendationsData from "../../../../data/recommendations.json";
import "../../../../styles/report.css";
import Header from "../../../../components/Header";
import BottomNav from "../../../../components/BottomNav";

// 完整推荐文本映射
const RECOMMEND_TEXT: Record<string, string> = {
  EMERGENCY_DEPARTMENT: "Send patient to Emergency Department immediately",
  IMMEDIATE: "Immediate referral to Eye Emergency On-Call",
  URGENT_TO_OPH: "Urgent referral to Ophthalmology",
  URGENT_TO_GP_OR_NEUR: "Urgent referral to GP or Neurology",
  TO_GP: "Refer to General Practitioner",
  NO_REFERRAL: "No referral required",
  OTHER_EYE_CONDITIONS_GUIDANCE: "Referral to other department",
};

// 风险级别映射（用于CSS颜色类）
const RISK_TO_LEVEL: Record<string, string> = {
  EMERGENCY_DEPARTMENT: "red",
  IMMEDIATE: "red",
  URGENT_TO_OPH: "orange",
  URGENT_TO_GP_OR_NEUR: "orange",
  TO_GP: "green",
  NO_REFERRAL: "green",
  OTHER_EYE_CONDITIONS_GUIDANCE: "orange",
};

/* ---------- 报告预览组件 ---------- */
const ReportPreview: React.FC<{
  assessmentId: string;
  reportText: string;
  ensureReport: () => Promise<string>;
}> = ({ assessmentId, reportText, ensureReport }) => {
  const [localReportText, setLocalReportText] = useState(reportText);
  const [isLoading, setIsLoading] = useState(false);

  // 当组件挂载时自动加载报告
  useEffect(() => {
    if (assessmentId && !localReportText) {
      setIsLoading(true);
      ensureReport()
        .then(setLocalReportText)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [assessmentId, localReportText, ensureReport]);

  // 同步外部 reportText 变化
  useEffect(() => {
    if (reportText) {
      setLocalReportText(reportText);
    }
  }, [reportText]);

  if (!assessmentId) {
    return <p>Assessment ID missing</p>;
  }

  if (isLoading) {
    return <p>Loading report preview...</p>;
  }

  if (!localReportText) {
    return <p>No report available</p>;
  }

  return (
    <pre style={{ 
      whiteSpace: "pre-wrap", 
      fontFamily: "monospace", 
      fontSize: "0.9rem",
      lineHeight: "1.4",
      margin: 0,
      background: "#f8f9fa",
      padding: "1rem",
      borderRadius: "4px",
      border: "1px solid #e9ecef"
    }}>
      {localReportText}
    </pre>
  );
};

function CollapsibleCard({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article className={`collapse-card${open ? " open" : ""}`}>
      <header className="collapse-card-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="collapse-icon">{open ? "−" : "+"}</span>
      </header>
      {open && <div className="collapse-card-body">{children}</div>}
    </article>
  );
}

/* =============================================================== */

const DynamicRecommendation: React.FC = () => {
  useEffect(() => {
    sessionStorage.removeItem('assessStarted');
    sessionStorage.removeItem('lastQuestionId');
    sessionStorage.removeItem('answerHistory');
    sessionStorage.removeItem('assessmentComplete'); // 保守清掉旧值
    sessionStorage.removeItem('questionTrail'); // DynamicRecommendation 里

  }, []);

  /* —— 路由参数 —— */
  const { resultId, assessmentId } = useParams<{ resultId: string; assessmentId?: string }>();
  const { state } = useLocation() as { state?: { assessmentId?: string } };
  const finalAssessmentId = assessmentId || state?.assessmentId || "";
  
  // 获取推荐详情
  const recommendation = recommendationsData.find(r => r.id === resultId);
  
  // 状态管理
  const [assessment, setAssessment] = useState<any | null>(null);
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(true);

  // 导航
  const navigate = useNavigate();

  // 获取评估数据
  useEffect(() => {
    if (!finalAssessmentId) {
      setLoading(false);
      return;
    }

    getAssessment(finalAssessmentId)
      .then(setAssessment)
      .catch((e) => {
        console.error("Failed to load assessment", e);
        // 如果获取失败，仍然显示页面，但不显示详细信息
      })
      .finally(() => setLoading(false));
  }, [finalAssessmentId]);

  // 报告管理函数
  const ensureReport = async () => {
    if (reportText) return reportText;
    if (!finalAssessmentId) throw new Error("Assessment ID missing");
    const text = await fetchReportText(finalAssessmentId);
    setReportText(text);
    return text;
  };

  // // 打开/关闭邮件模态框
  // const openEmailModal = () => setShowEmailModal(true);
  // const closeEmailModal = () => {
  //   if (!sending) setShowEmailModal(false);
  // };

  // 新增：打开默认邮件客户端函数
  const openDefaultEmailClient = async () => {
    try {
      const reportText = await ensureReport();
      const fullContent = reportText + '\n\n---\nYou can also download this report as a file from our website.';
      const subject = encodeURIComponent('Assessment Report');
      const body = encodeURIComponent(fullContent);
      
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      
      // 移动设备延迟检测
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        setTimeout(() => {
          if (document.hasFocus()) {
            alert('No email app found. Please install an email app and try again.');
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Failed to open email client:', error);
      alert('Failed to open email client. Please install an email app first.');
    }
  };

  // 复制报告
  const handleCopy = async () => {
    if (!finalAssessmentId) {
      alert("Assessment ID missing");
      return;
    }
    
    try {
      const text = await ensureReport();
      await navigator.clipboard.writeText(text);
      alert("Report copied to clipboard!");
    } catch (e) {
      console.error("Failed to copy report", e);
      alert("Failed to copy report. Please try again.");
    }
  };

  // 处理报告下载
  const handleDownload = async () => {
    if (!finalAssessmentId) {
      alert("Assessment ID missing");
      return;
    }
    
    try {
      const blob = await exportAssessment(finalAssessmentId, "txt");
      saveAs(blob, `assessment-${finalAssessmentId}.txt`);
    } catch (e) {
      console.error("Download failed", e);
      alert("Failed to download report. Please try again.");
    }
  };

  // 推荐结果未找到
  if (!recommendation) {
    return (
      <div className="recommendation-container">
        <Header title="Assessment Result" showBack />
        
        <main className="recommendation-main">
          <div className="recommendation-card">
            <div className="recommendation-card__header" style={{ background: "#d32f2f" }}>
              <h2 className="recommendation-title">
                Result Not Found
              </h2>
            </div>
            <div className="recommendation-body">
              <p className="recommendation-description">
                Could not find recommendation with ID: "{resultId}"
              </p>
              <div className="recommendation-actions">
                <button 
                  className="btn-primary"
                  onClick={() => navigate("/optometrist/assess/start-page")}
                >
                  Start New Assessment
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <BottomNav />
      </div>
    );
  }

  // 获取完整推荐文本和颜色类
  const fullRecommendationText = RECOMMEND_TEXT[resultId as keyof typeof RECOMMEND_TEXT] || recommendation.title;
  const colorClass = `report-${RISK_TO_LEVEL[resultId as keyof typeof RISK_TO_LEVEL] || "green"}`;

  /* —— 正常渲染 —— */
  return (
    <div className="recommendation-container">
      <Header title="Assessment Result" showBack />

      <div className="page-container">
        <main className="report-main">
          {/* ——— 推荐结果卡片（参考图二的UI）——— */}
          <article className={`report-card ${colorClass}`}>
            <h2 className="report-title">{fullRecommendationText}</h2>

            <div className="report-btn-group">
              <button onClick={handleCopy} disabled={!finalAssessmentId}>
                📋 Copy
              </button>
              <button onClick={handleDownload} disabled={!finalAssessmentId}>
                ⬇️ Download
              </button>
              <button
                onClick={openDefaultEmailClient}
                disabled={!finalAssessmentId}
                title={!finalAssessmentId ? "Assessment ID missing" : ""}
              >
                ✉️ Email
              </button>
            </div>
          </article>

          {/* ——— 折叠的报告预览区域 ——— */}
          <section className="collapse-wrapper">
            <CollapsibleCard title="Preview Report" defaultOpen={true}>
              <ReportPreview 
                assessmentId={finalAssessmentId} 
                reportText={reportText}
                ensureReport={ensureReport}
              />
            </CollapsibleCard>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default DynamicRecommendation;