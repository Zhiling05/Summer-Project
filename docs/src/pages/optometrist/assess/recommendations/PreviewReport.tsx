import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header     from "../../../../components/Header";
import BottomNav  from "../../../../components/BottomNav";
import Sidebar    from "../../../../components/SideBar";
import "../../../../styles/preview-report.css";
import "../../../../styles/recommendation.css";             // 复用弹窗样式

import { getAssessment, fetchReportText, exportAssessment, sendReport } from "../../../../api";
import { saveAs } from "file-saver";


/* ---------- LOCAL 预览：从本地读取 ---------- */
// 如团队只使用其中某一个 key，请保留那一个并删掉其他即可
const LOCAL_KEYS = ["assessmentForPreview", "previewAssessment", "assessment_draft"];
function readLocalAssessment() {
  for (const k of LOCAL_KEYS) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v) {
      try { return JSON.parse(v); } catch {}
    }
  }
  return null;
}

/* ---------- 风险配色 ---------- */
export type Level = "high" | "medium" | "low";
const LEVEL_UI: Record<Level, { css: "red" | "orange" | "green" }> = {
  high:   { css: "red"    },
  medium: { css: "orange" },
  low:    { css: "green"  },
};
const RISK_TO_LEVEL: Record<string, Level> = {
  "emergency-department": "high",
  immediate:              "high",
  "urgent-to-oph":        "medium",
  "urgent-to-gp-or-neur": "medium",
  "to-gp":                "low",
  "no-referral":          "low",
};
const RECOMMEND_TEXT: Record<string, string> = {
  EMERGENCY_DEPARTMENT: "Send patient to Emergency Department immediately",
  IMMEDIATE:            "Immediate referral to Eye Emergency On-Call",
  URGENT_TO_OPH:        "Urgent referral to Ophthalmology",
  URGENT_TO_GP_OR_NEUR: "Urgent referral to GP or Neurology",
  TO_GP:                "Refer to General Practitioner",
  NO_REFERRAL:          "No referral required",
  OTHER_EYE_CONDITIONS_GUIDANCE: "Referral to other department",
};

/* ---------- 折叠卡 ---------- */
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

/* ---------- 邮件发送模态框 ---------- */
const EmailModal: React.FC<{
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
}> = ({ open, loading, onClose, onSend }) => {
  if (!open) return null;

  const [email, setEmail] = useState("");

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
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

/* ---------- 主组件 ---------- */
export default function PreviewReport() {
  // const { id } = useParams();
  const { id } = useParams<{ id: string }>();
  const [ass, setAss] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 控制邮件发送模态框
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sending, setSending] = useState(false);

  const openEmailModal  = () => setShowEmailModal(true);
  const closeEmailModal = () => { if (!sending) setShowEmailModal(false); };

  const sendEmail = async (email: string) => {
    if (!ass?.id) return;
    try {
      setSending(true);
      await sendReport(ass.id, email, "txt");
      alert("Email sent!");
      setShowEmailModal(false);
    } catch (e: any) {
      alert("Send failed: " + (e?.message || e));
    } finally {
      setSending(false);
    }
  };

  /* 获取详情（修复点：id==='LOCAL' 时仅读本地，不请求后端） */
  useEffect(() => {
    if (!id) return;

    if (id === "LOCAL") {
      const local = readLocalAssessment();
      if (local) {
        setAss(local);
      } else {
        alert("No local preview data. Please finish the assessment first.");
        setAss(null);
      }
      setLoading(false);
      return;
    }

    // 真实 id 才请求后端
    // fetch(`/api/assessments/${id}`)
    //   .then(r => (r.ok ? r.json() : Promise.reject()))
    //   .then(setAss)
    //   .catch(() => alert("Failed to load assessment."))
    //   .finally(() => setLoading(false));

// 真实 id 通过 index.ts API 加载
    getAssessment(id!)
      .then(setAss)
      .catch(() => alert("Failed to load assessment."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading…</p>;
  if (!ass)    return <p style={{ padding: "2rem" }}>Not found.</p>;

  const RECOMM_TO_LEVEL: Record<string, Level> = {
    EMERGENCY_DEPARTMENT: "high",
    IMMEDIATE:            "high",
    URGENT_TO_OPH:        "medium",
    URGENT_TO_GP_OR_NEUR: "medium",
    TO_GP:                "low",
    NO_REFERRAL:          "low",
    OTHER_EYE_CONDITIONS_GUIDANCE: "low",
  };

  const level: Level =
    RECOMM_TO_LEVEL[ass.recommendation as keyof typeof RECOMM_TO_LEVEL] ?? "low";

  const colourCss = LEVEL_UI[level].css;
  const recText   = RECOMMEND_TEXT[ass.recommendation] || ass.recommendation;

  // 将报告对象转成纯文本（给 LOCAL 的复制/下载用）
  const toPlainText = (a: any) => {
    const lines = [
      `Assessment ID: ${a.id ?? "(LOCAL)"}`,
      `Date: ${a.createdAt ?? ""}`,
      `Role: ${a.role ?? ""}`,
      `Recommendation: ${RECOMMEND_TEXT[a.recommendation] || a.recommendation || ""}`,
      "Symptoms:",
      ...(Array.isArray(a.symptoms) && a.symptoms.length ? a.symptoms : ["(none)"]),
    ];
    return lines.join("\n");
  };

  /* —— 交互按钮 —— */
  const copyReport = async () => {
    if (id === "LOCAL") {
      await navigator.clipboard.writeText(toPlainText(ass));
      alert("Copied!");
      return;
    }
    // const txt = await fetch(`/api/assessments/${id}/report`).then(r => r.text());
    const txt = await fetchReportText(id!);
    await navigator.clipboard.writeText(txt);
    alert("Copied!");
  };

  const download = () => {
    if (id === "LOCAL") {
      const blob = new Blob([toPlainText(ass)], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "assessment.txt";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    // window.open(`/api/assessments/${id}/export?format=txt`, "_blank");
    exportAssessment(id!, "txt")
      .then((blob) => saveAs(blob, `assessment-${id}.txt`))
      .catch(() => alert("Download failed."));
  };

  // 对 LOCAL 禁用邮件发送（需要真实 id）
  const emailDisabled = id === "LOCAL";

  return (
    <>
      <Header title="Assessment Report" />
      <Sidebar />

      <div className="page-container">
        <main className="report-main">
          {/* ——— 风险摘要条 ——— */}
          <article className={`report-card ${colourCss}`}>
            <h2 className="report-title">{recText}</h2>

            <ul className="report-meta">
              <li>Assessment <b>{ass.id ?? "(LOCAL)"}</b></li>
              <li>Date : {ass.createdAt}</li>
              <li>Role : {ass.role}</li>
            </ul>

            <div className="report-btn-group">
              <button onClick={copyReport}>📋 Copy</button>
              <button onClick={download}>⬇️ Download</button>
              <button
                onClick={openEmailModal}
                disabled={emailDisabled}
                title={emailDisabled ? "LOCAL preview cannot send email." : ""}
              >
                ✉️ Email
              </button>
            </div>
          </article>

          {/* ——— 单一 Full-Report 折叠卡 ——— */}
          <section className="collapse-wrapper">
            <CollapsibleCard title="Full Report" defaultOpen>
              {/* Basic */}
              <p style={{ fontWeight: 600, margin: "0 0 .4rem" }}>Basic information</p>
              <ul className="info-list" style={{ marginBottom: "1rem" }}>
                <li><b>ID:</b> {ass.id ?? "(LOCAL)"}</li>
                <li><b>Date:</b> {ass.createdAt}</li>
                <li><b>Role:</b> {ass.role}</li>
              </ul>

              {/* Symptoms */}
              <p style={{ fontWeight: 600, margin: "0 0 .4rem" }}>Patient symptoms</p>
              {ass.symptoms?.length ? (
                <ul className="info-list" style={{ marginBottom: "1rem" }}>
                  {ass.symptoms.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ marginBottom: "1rem" }}>No symptom recorded.</p>
              )}

              {/* Recommendation */}
              <p style={{ fontWeight: 600, margin: "0 0 .4rem" }}>Recommendation</p>
              <p>{recText}</p>
            </CollapsibleCard>
          </section>
        </main>

        <EmailModal
          open={showEmailModal}
          loading={sending}
          onClose={closeEmailModal}
          onSend={sendEmail}
        />
      </div>

      <BottomNav />
    </>
  );
}
