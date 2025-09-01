import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from '../../components/BackButton';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
import { http } from "../../api/index";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import "../../styles/records.css";
import { AssessmentRecommendations } from "../../types/recommendation";
import Sidebar from '../../components/SideBar'; 
import DatePicker, { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('en-GB', enGB);

const LEVELS: Level[] = ["high", "medium", "low"];
export type Level = "high" | "medium" | "low";

type RiskLabel = NonNullable<AssessmentRecommendations["recommendationType"]>;

function normalizeRisk(raw: string): RiskLabel {
  return raw.toLowerCase().replace(/_/g, "-") as RiskLabel;
}

type NormalizedRecord = {
  id: string;
  date: string;
  risk: RiskLabel;
};

/** UI configuration for risk levels */
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
  "other-eye-conditions-guidance": "medium",
};

const formatDateForDisplay = (iso: string) => {
  const date = parseISO(iso);
  return format(date, 'dd-MM-yyyy');
};
type FilterValue = Level | "all";

const PAGE_SIZE = 20;

/**
 * Records - Assessment history page
 * - Displays all past assessments
 * - Supports filtering, pagination, and quick navigation to details
 */
export default function Records() {
  const navigate = useNavigate();
  const [remoteRecs, setRemoteRecs] = useState<NormalizedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [level, setLevel] = useState<FilterValue>("all");
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  // Fetch all records
  useEffect(() => {
    setLoading(true);
    http('/assessments')
      .then((json: any) => {
        const arr = Array.isArray(json) ? json : (json?.records ?? []);
        const normalized = arr.map((r: any) => {
          const date = r.createdAt ?? r.date;
          const raw  = r.recommendation ?? r.risk;
          const risk = (normalizeRisk(String(raw)) as RiskLabel) || "no-referral";
          return { id: r.id, date, risk };
        });
        setRemoteRecs(normalized);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const all: NormalizedRecord[] = remoteRecs;  

  // Compute statistics (based on all records)
  const stats = useMemo(() => {
    const initial = { high: 0, medium: 0, low: 0 } as Record<Level, number>;
    return all.reduce((acc, rec) => {
      const lvl = RISK_TO_LEVEL[rec.risk];
      acc[lvl] += 1;
      return acc;
    }, initial);
  }, [all]);

  // Apply filters
  const filteredList = useMemo(() => {
    return all.filter((r) => {
      const lvl = RISK_TO_LEVEL[r.risk];
      if (level !== "all" && lvl !== level) return false;
      const recDate = parseISO(r.date);
      if (from && recDate < from) return false;
      if (to && recDate > to) return false;
      return true;
    });
  }, [all, level, from, to]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPageData = filteredList.slice(startIndex, endIndex);

  // Pagination control
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [level, from, to]);

  /** Append new record (future incremental updates) */
  const addNewRecord = (newRecord: NormalizedRecord) => {
    setRemoteRecs(prev => [newRecord, ...prev]);
    setCurrentPage(1);
  };

  return (
    <>
      <Header title="Records" />
      <BackButton />
      <Sidebar /> 
      
      <main className="records-main">
        <div className="records-wrapper">
          <h1 className="records-title">Records</h1>

          {/* Statistics cards */}
          <section className="stats-grid">
            {LEVELS.map((lvl) => (
              <article key={lvl} className={`stats-card ${LEVEL_UI[lvl].css}`}>
                <span className="stats-title">{LEVEL_UI[lvl].title}</span>
                <span className="stats-num">{stats[lvl]}</span>
                <span className="stats-desc">{LEVEL_UI[lvl].desc}</span>
              </article>
            ))}
          </section>

          {/* Filter bar */}
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
                placeholderText="DD-MM-YY"
                dateFormat="dd-MM-yy"
                locale="en-GB"
                isClearable
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </label>
            <label>
              End Date
              <DatePicker
                selected={to}
                onChange={(date) => setTo(date)}
                placeholderText="DD-MM-YY"
                dateFormat="dd-MM-yy"
                locale="en-GB"
                isClearable
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </label>
          </section>

          {/* Pagination info */}
          {!loading && filteredList.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-l)' }}>
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredList.length)} of {filteredList.length} records
              </span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          )}

          {/* Records table */}
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
                    <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>Loading records...</td>
                  </tr>
                ) : currentPageData.length > 0 ? (
                  currentPageData.map((r) => {
                    const lvl = RISK_TO_LEVEL[r.risk];
                    return (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{formatDateForDisplay(r.date)}</td>
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
                    <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>No Matching Records Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-m)', marginTop: 'var(--space-l)' }}>
              <button onClick={goToPrevPage} disabled={currentPage === 1}>Previous</button>
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
                  .map((page, index, arr) => {
                    const prevPage = arr[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    return (
                      <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {showEllipsis && <span style={{ padding: '0 8px' }}>...</span>}
                        <button
                          onClick={() => goToPage(page)}
                          style={{
                            background: page === currentPage ? 'var(--core-blue)' : 'var(--lighter-base)',
                            color: page === currentPage ? 'white' : 'var(--text-body)',
                          }}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>
              <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </>
  );
}
