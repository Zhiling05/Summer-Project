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

/** Human-readable recommendation text mapping */
const RECOMMEND_TEXT: Record<string, string> = {
  EMERGENCY_DEPARTMENT: "Send patient to Emergency Department immediately",
  IMMEDIATE: "Immediate referral to Eye Emergency On-Call",
  URGENT_TO_OPH: "Urgent referral to Ophthalmologist",
  URGENT_TO_GP_OR_NEUR: "Urgent referral to GP or Neurology",
  TO_GP: "Refer to GP",
  NO_REFERRAL: "No referral required",
  OTHER_EYE_CONDITIONS_GUIDANCE: "Referral to other department",
};

/** Risk category mapping to color classes (used in UI styling) */
const RISK_TO_LEVEL: Record<string, string> = {
  EMERGENCY_DEPARTMENT: "red",
  IMMEDIATE: "red",
  URGENT_TO_OPH: "orange",
  URGENT_TO_GP_OR_NEUR: "orange",
  TO_GP: "green",
  NO_REFERRAL: "green",
  OTHER_EYE_CONDITIONS_GUIDANCE: "orange",
};

/**
 * ReportPreview - renders report text in a preformatted block
 */
const ReportPreview: React.FC<{
  assessmentId: string;
  reportText: string;
  ensureReport: () => Promise<string>;
}> = ({ assessmentId, reportText, ensureReport }) => {
  const [localReportText, setLocalReportText] = useState(reportText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (assessmentId && !localReportText) {
      setIsLoading(true);
      ensureReport()
        .then(setLocalReportText)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [assessmentId, localReportText, ensureReport]);

  useEffect(() => {
    if (reportText) {
      setLocalReportText(reportText);
    }
  }, [reportText]);

  if (!assessmentId) return <p>Assessment ID missing</p>;
  if (isLoading) return <p>Loading report preview...</p>;
  if (!localReportText) return <p>No report available</p>;

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

/**
 * CollapsibleCard - simple UI wrapper with expandable content
 */
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

/**
 * DynamicRecommendation - shows final recommendation and report
 * - Fetches and displays assessment result
 * - Provides options to copy, download, or email the report
 */
const DynamicRecommendation: React.FC = () => {
  useEffect(() => {
    sessionStorage.removeItem('assessStarted');
    sessionStorage.removeItem('lastQuestionId');
    sessionStorage.removeItem('answerHistory');
    sessionStorage.removeItem('assessmentComplete');
    sessionStorage.removeItem('questionTrail');
  }, []);

  const { resultId, assessmentId } = useParams<{ resultId: string; assessmentId?: string }>();
  const { state } = useLocation() as { state?: { assessmentId?: string } };
  const finalAssessmentId = assessmentId || state?.assessmentId || "";

  const recommendation = recommendationsData.find(r => r.id === resultId);

  const [assessment, setAssessment] = useState<any | null>(null);
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch assessment details
  useEffect(() => {
    if (!finalAssessmentId) {
      setLoading(false);
      return;
    }

    getAssessment(finalAssessmentId)
      .then(setAssessment)
      .catch((e) => {
        console.error("Failed to load assessment", e);
      })
      .finally(() => setLoading(false));
  }, [finalAssessmentId]);

  /** Ensure report text is loaded */
  const ensureReport = async () => {
    if (reportText) return reportText;
    if (!finalAssessmentId) throw new Error("Assessment ID missing");
    const text = await fetchReportText(finalAssessmentId);
    setReportText(text);
    return text;
  };

  /** Open system default email client with pre-filled report */
  const openDefaultEmailClient = async () => {
    try {
      const reportText = await ensureReport();
      const fullContent = reportText + '\n\n---\nYou can also download this report as a file from our website.';
      const subject = encodeURIComponent('Assessment Report');
      const body = encodeURIComponent(fullContent);
      
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      
      // Mobile fallback detection
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

  /** Copy report text to clipboard */
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

  /** Download report as text file */
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

  // Fallback when recommendation not found
  if (!recommendation) {
    return (
      <div className="recommendation-container">
        <Header title="Assessment Result" showBack />
        <main className="recommendation-main">
          <div className="recommendation-card">
            <div className="recommendation-card__header" style={{ background: "#d32f2f" }}>
              <h2 className="recommendation-title">Result Not Found</h2>
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

  const fullRecommendationText = RECOMMEND_TEXT[resultId as keyof typeof RECOMMEND_TEXT] || recommendation.title;
  const colorClass = `report-${RISK_TO_LEVEL[resultId as keyof typeof RISK_TO_LEVEL] || "green"}`;

  return (
    <div className="recommendation-container">
      <Header title="Assessment Result" showBack />

      <div className="page-container">
        <main className="report-main">
          {/* Recommendation card */}
          <article className={`report-card ${colorClass}`}>
            <h2 className="report-title">{fullRecommendationText}</h2>
            <div className="report-btn-group">
              <button onClick={handleCopy} disabled={!finalAssessmentId}>📋 Copy</button>
              <button onClick={handleDownload} disabled={!finalAssessmentId}>⬇️ Download</button>
              <button
                onClick={openDefaultEmailClient}
                disabled={!finalAssessmentId}
                title={!finalAssessmentId ? "Assessment ID missing" : ""}
              >
                ✉️ Email
              </button>
            </div>
          </article>

          {/* Collapsible report preview */}
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
