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

type NormalizedRecord = {
  id: string;
  date: string;
  risk: RiskLabel;
};

/** UI 配置 */
const LEVEL_UI: Record<Level, { css: "red" | "orange" | "green"; title: string; desc: string }> = {
  high:   { css: "red",    title: "High Risk",   desc: "Urgent or Immediate Referral Required" },
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

// 分页常量
const PAGE_SIZE = 20;

/*下面写组件了*/
export default function Records() {
  const navigate = useNavigate();

  // —— 数据状态 ——
  const [remoteRecs, setRemoteRecs] = useState<NormalizedRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // —— 分页状态 ——
  const [currentPage, setCurrentPage] = useState(1);

  // —— 筛选状态 ——
  const [level, setLevel] = useState<FilterValue>("all");
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  // 获取所有数据
  useEffect(() => {
    setLoading(true);
    listAssessments() // 移除limit参数，获取所有数据
      .then(({ records }) => {
        const normalized = records.map((r: any) => {
          const date = r.createdAt ?? r.date;            // 统一时间
          const raw  = r.recommendation ?? r.risk;       // 统一推荐
          const risk = (normalizeRisk(String(raw)) as RiskLabel) || "no-referral";
          return { id: r.id, date, risk };
        });
        setRemoteRecs(normalized);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const all: NormalizedRecord[] = remoteRecs;   // 为空数组时即表示还没有记录

  // —— 统计（基于所有数据） ——
  const stats = useMemo(() => {
    const initial = { high: 0, medium: 0, low: 0 } as Record<Level, number>;
    return all.reduce((acc, rec) => {
      const lvl = RISK_TO_LEVEL[rec.risk];
      acc[lvl] += 1;
      return acc;
    }, initial);
  }, [all]);

  // —— 过滤（应用筛选条件） ——
  const filteredList = useMemo(() => {
    return all.filter((r) => {
      const lvl = RISK_TO_LEVEL[r.risk];
      if (level !== "all" && lvl !== level) return false;

      const recDate = parseISO(r.date);
      if (from && recDate < from) return false;
      if (to   && recDate > to)   return false;
      return true;
    });
  }, [all, level, from, to]);

  // —— 分页计算 ——
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPageData = filteredList.slice(startIndex, endIndex);

  // —— 分页控制 ——
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [level, from, to]);

  // 用于显示新提交记录的函数（将来实现增量更新时使用）
  const addNewRecord = (newRecord: NormalizedRecord) => {
    setRemoteRecs(prev => [newRecord, ...prev]); // 插入到顶部
    setCurrentPage(1); // 跳转到第一页显示新记录
  };

  return (
      <>
        <Header title="Records" />
        <BackButton />{/* 使用 goback 组件zkx */}
        <Sidebar /> {/* 使用 Sidebar 组件zkx */}
        
        <main className="records-main">
          <div className="records-wrapper">
            <h1 className="records-title">Records</h1>

            {/* 统计卡 */}
            <section className="stats-grid">
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

            {/* 分页信息 */}
            {!loading && filteredList.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'var(--space-l)',
                fontSize: '0.9rem',
                color: 'var(--text-body)'
              }}>
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredList.length)} of {filteredList.length} records
                </span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}

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
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>
                      Loading records...
                    </td>
                  </tr>
                ) : currentPageData.length > 0 ? (
                  currentPageData.map((r) => {
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
                                onClick={() => navigate(`/optometrist/assess/recommendations/${r.risk.toUpperCase().replace(/-/g, '_')}/${r.id}`)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>
                      No Matching Records Found
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>

            {/* 分页控件 */}
            {!loading && totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--space-m)',
                marginTop: 'var(--space-l)',
                padding: 'var(--space-m) 0'
              }}>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    background: currentPage === 1 ? 'var(--border-grey)' : 'var(--core-blue)',
                    color: currentPage === 1 ? 'var(--text-body)' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Previous
                </button>

                {/* 页码按钮 */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // 显示当前页前后2页
                      return Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages;
                    })
                    .map((page, index, arr) => {
                      // 添加省略号
                      const prevPage = arr[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {showEllipsis && <span style={{ padding: '0 8px' }}>...</span>}
                          <button
                            onClick={() => goToPage(page)}
                            style={{
                              padding: '8px 12px',
                              background: page === currentPage ? 'var(--core-blue)' : 'var(--lighter-base)',
                              color: page === currentPage ? 'white' : 'var(--text-body)',
                              border: page === currentPage ? 'none' : '1px solid var(--border-grey)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              minWidth: '40px'
                            }}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    background: currentPage === totalPages ? 'var(--border-grey)' : 'var(--core-blue)',
                    color: currentPage === totalPages ? 'var(--text-body)' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </main>
        
        <BottomNav />
      </>
  );
}