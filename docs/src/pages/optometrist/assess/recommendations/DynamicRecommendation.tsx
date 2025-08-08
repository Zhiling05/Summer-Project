// docs/src/pages/optometrist/assess/recommendations/DynamicRecommendation.tsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  fetchReportText,
  exportAssessment,
  sendReport,
} from "../../../../api";
import { saveAs } from "file-saver";

import recommendationsData from "../../../../data/recommendations.json";
import "../../../../styles/recommendation.css";

//import BackButton from "../../../../components/BackButton";
import Header from "../../../../components/Header"; // ycl2

import BottomNav  from "../../../../components/BottomNav";

/* ---------- 邮件发送模态框 ---------- */
const EmailModal: React.FC<{
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
}> = ({ open, loading, onClose, onSend }) => {
  if (!open) return null;

  const [email, setEmail] = React.useState("");

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div
        className="email-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="email-modal__title">Send report via email</h3>

        <input
          type="email"
          placeholder="name@example.com"
          className="email-modal__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="email-modal__actions">
          <button
            className="btn-primary"
            disabled={loading || !email}
            onClick={() => onSend(email)}
          >
            {loading ? "Sending…" : "Send"}
          </button>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- 类型 ---------- */
interface Recommendation {
  id: string;
  title: string;
  themeColor: string;
  backgroundColor: string;
}

/* =============================================================== */

const DynamicRecommendation: React.FC = () => {
  /* —— 路由参数 —— */
  const { resultId } = useParams<{ resultId: string }>();
  const rec = (recommendationsData as Recommendation[]).find(
    (r) => r.id === resultId
  );

  /* —— assessmentId 来自 DynamicQuestion 跳转时的 state —— */
  const { state }   = useLocation() as { state?: { assessmentId?: string } };
  const assessId    = state?.assessmentId ?? "";

  /* —— 缓存纯文本报告 —— */
  const [report,   setReport]   = useState("");
  const [sending,  setSending]  = useState(false);

  // 控制邮件发送模态框显示
  const [showEmailModal, setShowEmailModal] = useState(false);
  const openEmailModal = () => setShowEmailModal(true);
  const closeEmailModal = () => {
    if (!sending) setShowEmailModal(false);
  };

  /** 如果还没拿过报告就去请求一次 */
  const ensureReport = async () => {
    if (report) return report;
    if (!assessId) throw new Error("assessmentId missing");
    const txt = await fetchReportText(assessId);
    setReport(txt);
    return txt;
  };

  /* —— 回调 —— */
  const navigate = useNavigate();

  // 预览
  const handlePreview = async () => {
    try {
      const txt = await ensureReport();
      navigate(
        `/optometrist/assess/recommendations/report-preview/${assessId}`,
        { state: { text: txt } }
      );
    } catch (e) {
      alert("Fetch report failed: " + (e as Error).message);
    }
  };

  // 下载
  const handleDownload = async () => {
    if (!assessId) return;
    try {
      const blob = await exportAssessment(assessId, "txt");
      saveAs(blob, `assessment-${assessId}.txt`);
    } catch (e) {
      alert("Download failed: " + (e as Error).message);
    }
  };

  // 发送邮件（由 EmailModal 调用）
  const sendEmail = async (email: string) => {
    if (!assessId) return;
    try {
      setSending(true);
      await sendReport(assessId, email, "txt");
      alert("邮件已发送！");
      setShowEmailModal(false);
    } catch (e) {
      alert("Send failed: " + (e as Error).message);
    } finally {
      setSending(false);
    }
  };

  /* —— 未找到推荐 id —— */
  if (!rec) {
    return (
      <div className="recommendation-container">
        <Header title="DIPP Assessment" showBack /> {/* ycl-sprint2.2 */}

        <main className="recommendation-main">
          <div className="recommendation-card">
            <h2 className="recommendation-title">did not find “{resultId}”</h2>
          </div>
        </main>

        <footer className="nhs-footer">
          <div className="footer-inner">
            <ul className="footer-links">
              <li><Link to="/">首页</Link></li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }

  /* —— 正常渲染 —— */
  return (
    <div
      className="recommendation-container"
      style={{ backgroundColor: rec.backgroundColor }}
    >
      {/* 顶栏 */}
      {/* <BackButton /> // ycl 移除多余的返回按钮 */}
      <Header title="DIPP Assessment" showBack /> {/* ycl-sprint2.2 */}

      {/* 主体卡片 */}
      <main className="recommendation-main">
        <div className="recommendation-card">
          {/* 渐变头 */}
          <div
            className="recommendation-card__header"
            style={{
              background: `linear-gradient(135deg,var(--orange-start),${rec.themeColor})`,
            }}
          >
            <img src="https://twemoji.maxcdn.com/v/latest/72x72/1f3e5.png" alt="" />
            <h2 className="recommendation-title">{rec.title}</h2>
            <p  className="recommendation-subtitle">{resultId}</p>
          </div>

          {/* 正文 & 按钮 */}
          <div className="recommendation-body">
            {/* <p className="recommendation-description"> ------------lzl: 这里的硬编码我先删除了--------
              Send patient to <strong>Emergency Department</strong>.
            </p> */}

            <div className="recommendation-actions">
              <button className="btn-primary"  onClick={handlePreview}>
                Preview&nbsp;Report
              </button>

              <button className="btn-outline" onClick={handleDownload}>
                Download&nbsp;TXT
              </button>

              <button
                className="btn-outline"
                disabled={sending}
                onClick={openEmailModal}
              >
                Send via Email
              </button>
            </div>
          </div>
        </div>
      </main>
      <EmailModal
        open={showEmailModal}
        loading={sending}
        onClose={closeEmailModal}
        onSend={sendEmail}
      />

      <BottomNav />
    </div>
  );
};

export default DynamicRecommendation;
