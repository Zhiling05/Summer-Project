// src/pages/optometrist/assess/recommendations/DynamicRecommendation.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import recommendationsData from '../../../../data/recommendations.json';

import {
  fetchReportText,
  exportAssessment,
  sendReport,
} from '../../../../api';
import { saveAs } from 'file-saver';

import NHSLogo   from '../../../../assets/NHS_LOGO.jpg';
import DIPPLogo  from '../../../../assets/DIPP_Study_logo.png';
import BackButton from '../../../../components/BackButton';
import BottomNav  from '../../../../components/BottomNav';

/* ---------- 类型 ---------- */
interface Recommendation {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  themeColor: string;
  backgroundColor: string;
  actions: string[];
}

interface LocState { assessmentId?: string }

/* ---------- 组件 ---------- */
const DynamicRecommendation: React.FC = () => {
  /* url / state */
  const { resultId } = useParams<{ resultId: string }>();
  const rec = (recommendationsData as Recommendation[])
                .find(r => r.id === resultId);

  const { state } = useLocation() as { state: LocState };
  const assessId  = state?.assessmentId ?? '';   // 可能为空 → 按钮 disabled
  const navigate  = useNavigate();

  /* 报告缓存 */
  const [report, setReport] = useState<string>('');

  /* ---------- handlers ---------- */
  const ensureReport = async () => {
    if (report) return report;
    if (!assessId) throw new Error('no id');
    const txt = await fetchReportText(assessId);
    setReport(txt);
    return txt;
  };

  const handlePreview = async () => {
    try {
      await ensureReport();
      navigate('/optometrist/assess/recommendations/report-preview', {
        state: { text: report },
      });
    } catch (e) { alert((e as Error).message); }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(await ensureReport()); }
    catch (e) { alert('Copy failed'); }
  };

  const handleEmail = async () => {
    try {
      await ensureReport();
      window.location.href =
        'mailto:?subject=DIPP%20Assessment&body=' + encodeURIComponent(report);
    } catch (e) { alert((e as Error).message); }
  };

  const handleDownload = async () => {
    if (!assessId) return;
    const blob = await exportAssessment(assessId, 'txt');
    saveAs(blob, `assessment-${assessId}.txt`);
  };

  /* ---------- 未找到 rec ---------- */
  if (!rec) return <p style={{ padding: 40 }}>Unknown result: {resultId}</p>;

  /* ---------- UI ---------- */
  return (
    <div className="recommendation-container"
         style={{ backgroundColor: rec.backgroundColor }}>
      <BackButton />

      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img src={NHSLogo}  className="logo" alt="NHS"  />
          <img src={DIPPLogo} className="logo" alt="DIPP" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      <main className="recommendation-main">
        <div className="recommendation-card">
          <div className="recommendation-card__header"
               style={{ background: `linear-gradient(135deg,
                        var(--orange-start), ${rec.themeColor})` }}>
            <h2 className="recommendation-title">{rec.title}</h2>
            <p  className="recommendation-subtitle">{rec.id}</p>
          </div>

          <div className="recommendation-body">
            <p>{rec.description}</p>

            <div className="recommendation-actions">
              <button className="btn-primary"
                      disabled={!assessId}
                      onClick={handlePreview}>Preview Report</button>
              <button className="btn-outline"
                      disabled={!assessId}
                      onClick={handleCopy}>Copy Report</button>
              <button className="btn-outline"
                      disabled={!assessId}
                      onClick={handleEmail}>Send Email</button>
              <button className="btn-outline"
                      disabled={!assessId}
                      onClick={handleDownload}>Download TXT</button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DynamicRecommendation;
