import { useMemo, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import BackButton from '../../components/BackButton';//zkx
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import { listAssessments } from "../../api";


import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import "../../styles/records.css";
//import recordsJson from "../../data/records.json";
import { AssessmentRecommendations } from "../../types/recommendation";
import Sidebar from '../../components/SideBar'; //zkx：sidebar侧栏

//定义一个类型安全的级别数组，后面的红黄绿卡片要用
const LEVELS: Level[] = ["high", "medium", "low"];
export type Level = "high" | "medium" | "low";

type RiskLabel = NonNullable<AssessmentRecommendations["recommendationType"]>;

/** 把 `"EMERGENCY_DEPARTMENT"` → `"emergency-department"` */
function normalizeRisk(raw: string): RiskLabel {
  return raw.toLowerCase().replace(/_/g, "-") as RiskLabel;
}

interface RawRecord {
  id: string;
  date: string;
  risk: string;
}
type NormalizedRecord = {
  id: string;
  date: string;
  risk: RiskLabel;
};

/** UI 配置 */
const LEVEL_UI: Record<Level, { css: "red" | "orange" | "green"; title: string; desc: string }> = {
  high:   { css: "red",    title: "High Risk",   desc: "Uegent or Immediate Referral Required" },
  medium: { css: "orange", title: "Moderate Risk", desc: "Further Observation Required" },
  low:    { css: "green",  title: "Low Risk",   desc: "No Special Intervention Required" },
};

const RISK_TO_LEVEL: Record<RiskLabel, Level> = {
  "emergency-department":   "high",
  "immediate":              "high",
  "urgent-to-oph":          "medium",
  "urgent-to-gp-or-neur":   "medium",
  "to-gp":                  "low",
  "no-referral":            "low",
  "other-eye-conditions-guidance":    "low",
};

const dateOnly = (iso: string) => iso.slice(0, 10);
type FilterValue = Level | "all";


/*下面写组件了*/
export default function Records() {
  const navigate = useNavigate();

  //把all类型标注为normalized，TS 就知道 rec.risk 属于 RiskLabel，可以安全地写 RISK_TO_LEVEL[rec.risk]，LEVEL_UI[lvl]，stats[lvl] 等索引都不会再报。

//   const localRecords: NormalizedRecord[] = (recordsJson as RawRecord[]).map(r => {
//   const norm = normalizeRisk(r.risk);
//   const finalRisk = (norm in RISK_TO_LEVEL ? norm : "no-referral") as RiskLabel;
//   return { id: r.id, date: r.date, risk: finalRisk };
// });

const [remoteRecs, setRemoteRecs] = useState<NormalizedRecord[]>([]);

useEffect(() => {
  listAssessments(50)
    .then(({ records }) => {
      const normalized = records.map(r => ({
        id:   r.id,
        date: r.date,
        risk: (normalizeRisk(r.risk) as RiskLabel) || "no-referral",
      }));
      setRemoteRecs(normalized);
    })
    .catch(console.error);
}, []);


  //const all: NormalizedRecord[] = remoteRecs.length ? remoteRecs : localRecords;
  const all: NormalizedRecord[] = remoteRecs;   // 为空数组时即表示还没有记录


  // —— 筛选 state ——
  const [level, setLevel] = useState<FilterValue>("all");
  const [from,  setFrom]  = useState<Date | null>(null);
  const [to,    setTo]    = useState<Date | null>(null);

  // —— 统计 ——
  const stats = useMemo(() => {
    const initial = { high: 0, medium: 0, low: 0 } as Record<Level, number>;
    return all.reduce((acc, rec) => {
      const lvl = RISK_TO_LEVEL[rec.risk];
      acc[lvl] += 1;
      return acc;
    }, initial);
  }, [all]);

  // —— 过滤 ——
  const list = useMemo(() => {
    return all.filter((r) => {
      const lvl = RISK_TO_LEVEL[r.risk];
      if (level !== "all" && lvl !== level) return false;

      const recDate = parseISO(r.date);
      if (from && recDate < from) return false;
      if (to   && recDate > to)   return false;
      return true;
    });
  }, [all, level, from, to]);




  return (
      <>
        <Header title="Records" />
        <BackButton />{/* 使用 goback 组件zkx */}
        <Sidebar /> {/* 使用 Sidebar 组件zkx */}
        {/*<div className="page-container">*/}
        <main className="records-main">
          <div className="records-wrapper">
          <h1 className="records-title">Records</h1>

          {/* 统计卡 */}
          <section className="stats-grid">
            {/*{(Object.keys(LEVEL_UI) as Level[]).map((lvl) => (*/}
            {LEVELS.map((lvl) => (
                <article key={lvl} className={`stats-card ${LEVEL_UI[lvl].css}`}>
                  <span className="stats-title">{LEVEL_UI[lvl].title}</span>
                  <span className="stats-num">{stats[lvl]}</span>
                  <span className="stats-desc">{LEVEL_UI[lvl].desc}</span>
                </article>
            ))}
          </section>

          {/* 筛选栏 */}
          <section className="filter-bar">
            <label>
              Risk Level
              <select value={level} onChange={(e) => setLevel(e.target.value as FilterValue)}>
                <option value="all">All</option>
                <option value="high">High Risk</option>
                <option value="medium">Moderate Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </label>
            <label>
              Start Date
              <DatePicker
                  selected={from}
                  onChange={(date) => setFrom(date)}
                  placeholderText="YYYY-MM-DD"
                  dateFormat="yyyy-MM-dd"
                  locale="en-US"
                  isClearable
              />
            </label>
            <label>
              End Date
            <DatePicker
            selected={to}
            onChange={(date) => setTo(date)}
            placeholderText="YYYY-MM-DD"
            dateFormat="yyyy-MM-dd"
            locale="en-US"
            isClearable
            />
            </label>
          </section>

          {/* 表格 */}
          <div className="table-wrapper">
            <table className="records-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Risk Level</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {list.map((r) => {
                const lvl = RISK_TO_LEVEL[r.risk];
                return (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{dateOnly(r.date)}</td>
                      <td>
                        <span className={`tag-pill tag-${LEVEL_UI[lvl].css}`}>{LEVEL_UI[lvl].title}</span>
                      </td>
                      <td>
                        <button
                            className="view-btn"
                            onClick={() => navigate(`/optometrist/assess/recommendations/report-preview/${r.id}`)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                );
              })}
              {list.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>
                      No Matching Records Found
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          </div>
        </main>
        {/*</div>*/}
        <BottomNav />
      </>
  );
}