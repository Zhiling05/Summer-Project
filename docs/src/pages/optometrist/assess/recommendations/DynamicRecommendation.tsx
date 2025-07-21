// src/pages/optometrist/assess/recommendations/DynamicRecommendation.tsx

import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import recommendationsData from "../../../../data/recommendations.json";
import "../../../../styles/recommendation.css";

import NHSLogo from "../../../../assets/NHS_LOGO.jpg";
import DIPPLogo from "../../../../assets/DIPP_Study_logo.png";

import BackButton from "../../../../components/BackButton";
import BottomNav from "../../../../components/BottomNav";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  themeColor: string;
  backgroundColor: string;
  actions: string[];
}

const DynamicRecommendation: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const rec = (recommendationsData as Recommendation[]).find(
    (r) => r.id === resultId
  );

  /* ---------- 回调 ---------- */
  const navigate = useNavigate();
  const reportText = rec ? `${rec.title}\n\n${rec.description}` : "";

  const handlePreview = () =>
    navigate("/optometrist/assess/recommendations/report-preview");
  const handleCopy = () => navigator.clipboard.writeText(reportText);
  const handleEmail = () =>
    (window.location.href = `mailto:?subject=DIPP%20Assessment%20Report&body=${encodeURIComponent(
      reportText
    )}`);

  /* ---------- 未找到结果 ---------- */
  if (!rec) {
    return (
      <div className="recommendation-container">
        <header className="nhs-header">
          <div className="nhs-header__inner">
            <img src={NHSLogo} className="logo" alt="NHS" />
            <img src={DIPPLogo} className="logo" alt="DIPP" />
            <span className="nhs-header__service">DIPP Assessment</span>
          </div>
        </header>

        <main className="recommendation-main">
          <div className="recommendation-card">
            <h2 className="recommendation-title">
              did not find “{resultId}”
            </h2>
          </div>
        </main>

        <footer className="nhs-footer">
          <div className="footer-inner">
            <ul className="footer-links">
              <li>
                <Link to="/">首页</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }

  /* ---------- 正常渲染 ---------- */
  return (
    <div
      className="recommendation-container"
      style={{ backgroundColor: rec.backgroundColor }}
    >
      {/* 顶栏 */}
      <BackButton />
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img src={NHSLogo} className="logo" alt="NHS" />
          <img src={DIPPLogo} className="logo" alt="DIPP" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      {/* 主体卡片 */}
      <main className="recommendation-main">
        <div className="recommendation-card">
          {/* 渐变头 */}
          <div
            className="recommendation-card__header"
            style={{
              background: `linear-gradient(135deg, var(--orange-start), ${rec.themeColor})`,
            }}
          >
            <img
              src="https://twemoji.maxcdn.com/v/latest/72x72/1f3e5.png"
              alt=""
            />
            <h2 className="recommendation-title">{rec.title}</h2>
            <p className="recommendation-subtitle">{resultId}</p>
          </div>

          {/* 正文 & 按钮 */}
          <div className="recommendation-body">
            {/* 仅保留一句转诊建议 */}
            <p className="recommendation-description">
              Send patient to <strong>Emergency Department</strong>.
            </p>

            <div className="recommendation-actions">
              <button className="btn-primary" onClick={handlePreview}>
                Preview&nbsp;Report
              </button>
              <button className="btn-outline" onClick={handleCopy}>
                Copy&nbsp;Report
              </button>
              <button className="btn-outline" onClick={handleEmail}>
                Send&nbsp;via&nbsp;Email
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DynamicRecommendation;