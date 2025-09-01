import { useEffect, useState } from "react";
import "../../styles/admin.css";
import { useNavigate } from 'react-router-dom';

//日历选择器-DD-MM-YY
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import Header from "../../components/Header.tsx";

import { http, logoutAndDowngrade } from "../../api/index";

registerLocale('en-GB', enGB);

type Level = "high" | "medium" | "low";
type ViewMode = "risk-level" | "referral-type";
type RiskLabel =
    | "emergency-department" | "immediate"
    | "urgent-to-oph" | "urgent-to-gp-or-neur"
    | "to-gp" | "no-referral" | "other-eye-conditions-guidance";

const normalizeRisk = (raw: string) =>
    raw.toLowerCase().replace(/_/g, "-") as RiskLabel;

const RISK_TEXT: Record<RiskLabel, string> = {
    "emergency-department": "Send patient to Emergency Department immediately",
    "immediate": "Immediate referral to Eye Emergency On-Call", 
    "urgent-to-oph": "Urgent referral to Ophthalmologist",
    "urgent-to-gp-or-neur": "Urgent referral to GP or Neurologist",
    "to-gp": "Refer to GP",
    "no-referral": "No referral required",
    "other-eye-conditions-guidance": "Referral to other department",
};

const RISK_TO_LEVEL: Record<RiskLabel, Level> = {
    "emergency-department": "high",
    "immediate": "high",
    "urgent-to-oph": "medium",
    "urgent-to-gp-or-neur": "medium", 
    "to-gp": "low",
    "no-referral": "low",
    "other-eye-conditions-guidance": "medium",
};

const LEVEL_UI: Record<Level, { cls: "red"|"orange"|"green"; txt: string; desc: string }> = {
    high:   { cls: "red",    txt: "High Risk", desc: "Send patient to Emergency Department immediately or Immediate referral to Eye Emergency On-Call" },
    medium: { cls: "orange", txt: "Moderate Risk", desc: "Urgent referral to Ophthalmologist, GP or Neurologist or Referral to other department" },
    low:    { cls: "green",  txt: "Low Risk", desc: "Refer to GP or No referral required" },
};

export default function AdminDashboard() {
    const nav = useNavigate();
    const onExitAdmin = async () => {
        await logoutAndDowngrade();
        nav('/select-role');
    };

    // 数据和状态
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("risk-level"); // 默认按风险等级查看

    // 过滤条件 - 复用现有的时间筛选逻辑
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [fromDate, setFromDate] = useState<Date|null>(null);
    const [toDate, setToDate] = useState<Date|null>(null);

    const toApi = (d: Date|null) => d ? format(d, 'yyyy-MM-dd') : '';

    // 获取数据
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const params: any = { scope: 'all' };
                if (from) params.startDate = from;
                if (to) params.endDate = to;

                const qs = new URLSearchParams(params).toString();
                const json: any = await http(`/assessments?${qs}`);
                const arr = Array.isArray(json) ? json : (json?.records ?? []);

                if (mounted) {
                    setRecords(arr);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [from, to]);

    // 快速日期设置
    const setQuick = (days: number) => {
        const today = new Date();
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startD = new Date(end); startD.setDate(startD.getDate() - (days - 1));

        setFromDate(startD); setFrom(toApi(startD));
        setToDate(end); setTo(toApi(end));
    };

    const resetFilters = () => {
        setFrom("");
        setTo("");
        setFromDate(null);
        setToDate(null);
    };

    // 计算统计数据
    const getStatistics = () => {
        const stats: Record<string, number> = {};
        let totalCount = records.length;

        if (viewMode === "risk-level") {
            // 按风险等级统计
            const levelStats = { high: 0, medium: 0, low: 0 };
            
            records.forEach(record => {
                const risk = normalizeRisk(String(record.recommendation ?? record.risk ?? 'no-referral'));
                const level = RISK_TO_LEVEL[risk];
                levelStats[level]++;
            });

            return { data: levelStats, total: totalCount, mode: "risk-level" };
        } else {
            // 按转诊结果统计
            const referralStats: Record<RiskLabel, number> = {
                "emergency-department": 0,
                "immediate": 0,
                "urgent-to-oph": 0,
                "urgent-to-gp-or-neur": 0,
                "to-gp": 0,
                "no-referral": 0,
                "other-eye-conditions-guidance": 0,
            };

            records.forEach(record => {
                const risk = normalizeRisk(String(record.recommendation ?? record.risk ?? 'no-referral'));
                referralStats[risk]++;
            });

            return { data: referralStats, total: totalCount, mode: "referral-type" };
        }
    };

    const statistics = getStatistics();

    return (
        <>
            <Header title="Admin Console" />
            <button className="exit-button" onClick={onExitAdmin}>← Exit</button>

            <main className="admin-main">
                <div className="admin-wrapper">
                    <h1 className="admin-title">Admin Console - Statistics</h1>

                    {/* 过滤选择区 - 保持原有样式 */}
                    <section className="admin-filter">
                        {/* 视图模式选择 */}
                        <div className="admin-row">
                            <div className="admin-label">View Mode</div>
                            <div className="admin-controls risk-buttons">
                                <button 
                                    onClick={() => setViewMode("risk-level")}
                                    className={`view-btn ${viewMode === "risk-level" ? "active-view" : ""}`}
                                >
                                    Risk Level
                                </button>
                                <button 
                                    onClick={() => setViewMode("referral-type")}
                                    className={`view-btn ${viewMode === "referral-type" ? "active-view" : ""}`}
                                >
                                    Referral Type
                                </button>
                            </div>
                        </div>

                        {/* 时间筛选 - 复用原有逻辑 */}
                        <div className="admin-row">
                            <div className="admin-label">Time Period</div>
                            <div className="admin-controls controls-inline">
                                <button className="view-btn" onClick={() => setQuick(1)}>Today</button>
                                <button className="view-btn" onClick={() => setQuick(7)}>Last 7 days</button>
                                <button className="view-btn" onClick={() => setQuick(30)}>Last 30 days</button>

                                <span className="dp-sm">
                                    <DatePicker
                                        selected={fromDate}
                                        onChange={(d) => { setFromDate(d); setFrom(toApi(d)); }}
                                        dateFormat="dd-MM-yy"
                                        placeholderText="From"
                                        isClearable
                                        locale="en-GB"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                </span>
                                <span>to</span>
                                <span className="dp-sm">
                                    <DatePicker
                                        selected={toDate}
                                        onChange={(d) => { setToDate(d); setTo(toApi(d)); }}
                                        dateFormat="dd-MM-yy"
                                        placeholderText="To"
                                        isClearable
                                        locale="en-GB"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                </span>
                                <button className="view-btn reset-btn" onClick={resetFilters}>Reset</button>
                            </div>
                        </div>

                        {/* 显示选中的筛选条件 */}
                        <div className="admin-bottom">
                            <div className="admin-pills">
                                {viewMode === "risk-level" && (
                                    <span className="tag-pill" style={{background:"#e9ecef", color:"#333", border:"1px solid #ced4da"}}>
                                        View: Risk Level
                                    </span>
                                )}
                                {viewMode === "referral-type" && (
                                    <span className="tag-pill" style={{background:"#e9ecef", color:"#333", border:"1px solid #ced4da"}}>
                                        View: Referral Type
                                    </span>
                                )}
                                {(from || to) && (
                                    <span className="tag-pill" style={{background:"#e9ecef", color:"#333", border:"1px solid #ced4da"}}>
                                        Date: {from || "Start"} ~ {to || "End"}
                                        <button onClick={resetFilters} style={{marginLeft:8, border:"none", background:"transparent", cursor:"pointer"}}>×</button>
                                    </span>
                                )}
                            </div>
                            <div className="total-display">
                                Total: {statistics.total} assessments
                            </div>
                        </div>
                    </section>

                    {/* 统计卡片区域 - 替代原来的表格 */}
                    <div className="stats-cards-container">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-body)" }}>
                                Loading statistics...
                            </div>
                        ) : statistics.total === 0 ? (
                            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-body)" }}>
                                No data available for the selected period
                            </div>
                        ) : (
                            <div className="stats-grid">
                                {viewMode === "risk-level" ? (
                                    // 风险等级视图
                                    (["high", "medium", "low"] as Level[]).map(level => {
                                        const count = (statistics.data as Record<Level, number>)[level];
                                        const percentage = statistics.total > 0 ? Math.round((count / statistics.total) * 100) : 0;
                                        
                                        return (
                                            <div key={level} className={`stat-card stat-${LEVEL_UI[level].cls}`}>
                                                <div className="stat-card-header">
                                                    <h3 className="stat-card-title">{LEVEL_UI[level].txt}</h3>
                                                    <span className="stat-card-percentage">{percentage}%</span>
                                                </div>
                                                <div className="stat-card-number">{count}</div>
                                                <div className="stat-card-desc">{LEVEL_UI[level].desc}</div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    // 转诊结果视图 - 按风险等级排序
                                    Object.entries(statistics.data as Record<RiskLabel, number>)
                                        .filter(([_, count]) => count > 0)
                                        .sort(([riskA], [riskB]) => {
                                            // 按风险等级排序：high -> medium -> low
                                            const levelA = RISK_TO_LEVEL[riskA as RiskLabel];
                                            const levelB = RISK_TO_LEVEL[riskB as RiskLabel];
                                            const levelOrder = { high: 0, medium: 1, low: 2 };
                                            return levelOrder[levelA] - levelOrder[levelB];
                                        })
                                        .map(([risk, count]) => {
                                            const level = RISK_TO_LEVEL[risk as RiskLabel];
                                            const percentage = statistics.total > 0 ? Math.round((count / statistics.total) * 100) : 0;
                                            
                                            return (
                                                <div key={risk} className={`stat-card stat-${LEVEL_UI[level].cls}`}>
                                                    <div className="stat-card-header">
                                                        <h3 className="stat-card-title">{RISK_TEXT[risk as RiskLabel]}</h3>
                                                        <span className="stat-card-percentage">{percentage}%</span>
                                                    </div>
                                                    <div className="stat-card-number">{count}</div>
                                                    <div className="stat-card-desc">
                                                        {LEVEL_UI[level].txt}
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}