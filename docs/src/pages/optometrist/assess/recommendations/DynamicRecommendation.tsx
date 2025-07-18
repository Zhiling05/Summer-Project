// src/pages/optometrist/assess/recommendations/DynamicRecommendation.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import recommendationsData from '../../../../data/recommendations.json';
import '../../../../styles/recommendation.css';

// ycl: 从 src/assets 导入 Logo
import NHSLogo from '../../../../assets/NHS_LOGO.jpg'; // ycl
import DIPPLogo from '../../../../assets/DIPP_Study_logo.png'; // ycl

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
  const rec = (recommendationsData as Recommendation[]).find(r => r.id === resultId);

  if (!rec) {
    return (
      <div className="recommendation-page">
        {/* 顶部 NHS & DIPP Study header */}
        <header className="nhs-header">
          <div className="nhs-header__inner">
            <img src={NHSLogo} alt="NHS Logo" className="logo" />
            <img src={DIPPLogo} alt="DIPP Study logo" className="logo dipp-logo" />
            <span className="nhs-header__service">DIPP Assessment</span>
          </div>
        </header>

        <div className="recommendation-main">
          <div className="recommendation-card">
            <h2 className="recommendation-title">未找到推荐结果 “{resultId}”</h2>
          </div>
        </div>
        <div className="nhs-footer">
          <div className="footer-inner">
            <ul className="footer-links">
              <li><Link to="/">首页</Link></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="recommendation-container"
      style={{ backgroundColor: rec.backgroundColor }}
    >
      {/* 顶部 NHS & DIPP Study header */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img src={NHSLogo} alt="NHS Logo" className="logo" /> {/* ycl */}
          <img src={DIPPLogo} alt="DIPP Study logo" className="logo dipp-logo" /> {/* ycl */}
          <span className="nhs-header__service">DIPP Assessment</span> {/* ycl */}
        </div>
      </header>

      {/* 主体内容 */}
      <main className="recommendation-main">
        <div className="recommendation-card">
          <h2
            className="recommendation-title"
            style={{ borderColor: rec.themeColor }}
          >
            {rec.title}
          </h2>
          <p className="recommendation-description">{rec.description}</p>

          {rec.bulletPoints.length > 0 && (
            <ul className="recommendation-bullets">
              {rec.bulletPoints.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          )}

          <div className="recommendation-actions">
            {rec.actions.map((action) => (
              <Link
                key={action}
                to="/"
                className="button"
                style={{
                  backgroundColor: rec.themeColor,
                  color: 'white',                
                  textAlign: 'center',          
                  width: '100%'           
                }}
              >
                {action}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* NHS 页脚 */}
      <footer className="nhs-footer">
        <div className="footer-inner">
          <ul className="footer-links">
            <li><a href="/privacy">隐私政策</a></li>
            <li><a href="/contact">联系我们</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default DynamicRecommendation;
