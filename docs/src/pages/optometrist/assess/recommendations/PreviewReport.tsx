import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Header     from "../../../../components/Header";
import BottomNav  from "../../../../components/BottomNav";
import Sidebar    from "../../../../components/SideBar";
import { fetchReportText, getAssessment } from "../../../../api";

import "../../../../styles/report.css";

/* 推荐结果 ➜ 颜色（同 Records） */
const COLOR_MAP: Record<string, "red" | "orange" | "green"> = {
  EMERGENCY_DEPARTMENT : "red",
  IMMEDIATE            : "red",
  URGENT_TO_OPH        : "orange",
  URGENT_TO_GP_OR_NEUR : "orange",
  TO_GP                : "green",
  NO_REFERRAL          : "green",
};

export default function PreviewReport() {
  const { id = "" } = useParams<{ id: string }>();
  const { state }   = useLocation() as { state?: { text?: string } };

  const [raw,     setRaw]     = useState(state?.text ?? "");
  const [recCode, setRecCode] = useState("");
  const [err,     setErr]     = useState<string | null>(null);

  /* 拉数据（文本 + 详情） */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [txt, detail] = await Promise.all([
          raw ? Promise.resolve(raw) : fetchReportText(id),
          getAssessment(id),
        ]);
        setRaw(txt);
        setRecCode(detail.recommendation);
      } catch (e: any) {
        setErr(e.message || String(e));
      }
    })();
  }, [id]);

  if (err)  return <p style={{ color: "red", padding: "2rem" }}>Error: {err}</p>;
  if (!raw) return <p style={{ padding: "2rem" }}>Loading…</p>;

  /* ---------- 文本拆块 ---------- */
  /* ---------- 文本拆块（兼容没有 Symptoms: 的报告） ---------- */
const SEP  = "\n----------------------------------------\n";
const clean = (s: string) =>
  s.replace(/^[- ]+$/gm, "")        // 清掉横线
   .replace(/\n{3,}/g, "\n\n")      // 连续空行折叠
   .trim();

/* ① meta / 其余 ------------------ */
const firstSep   = raw.indexOf(SEP);
const metaBlock  = clean(raw.slice(0, firstSep));
const afterMeta  = raw.slice(firstSep + SEP.length);

/* ② QA / 其余（Symptoms 可能不存在） */
const [qaRaw = "", restAfterQa = ""] =
      afterMeta.split(/^Symptoms:/m);

const qaBlock = clean(qaRaw);

/* ③ Symptoms / Recommendation ------------------------------ *
 *    如果找不到 Symptoms:，symRaw 为空串，recRaw 就是剩余全文  */
const [symRaw = "", recRawAll = restAfterQa] =
      restAfterQa.split(/^Recommendation:/m);

const symBlock = clean(symRaw);
const recBody  = clean(recRawAll);        // Recommendation 正文

  /* ---------- 卡片数据 ---------- */
const cards = [
  { title: "Basic information",   body: metaBlock },
  { title: "Question responses",  body: qaBlock  },
  symBlock && { title: "Patient symptoms", body: symBlock },
  { title: "Recommendation",      body: recBody },
].filter(Boolean) as {title:string;body:string}[];

  const colorCls = `report-${COLOR_MAP[recCode] ?? "green"}`;

  /* ---------- 渲染 ---------- */
  return (
    <>
      <Header title="Assessment Report" />
      <Sidebar />
      <main className="report-main">
        {cards.map(({ title, body }) => (
          <article key={title} className={`report-card ${colorCls}`}>
            <h2 className="report-heading">{title}</h2>
            <pre className="report-text">{body}</pre>
          </article>
        ))}
      </main>
      <BottomNav />
    </>
  );
}
