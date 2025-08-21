import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAssessments } from "../../api";              // 与 Records 相同的请求封装
import "../../styles/records.css";            // 复用按钮/表格/色块样式

// —— 与 Records 保持一致的类型与映射 —— //
type RiskLabel =
    | "emergency-department" | "immediate"
    | "urgent-to-oph" | "urgent-to-gp-or-neur"
    | "to-gp" | "no-referral" | "other-eye-conditions-guidance";
type Level = "high" | "medium" | "low";

const normalizeRisk = (raw: string) =>
    raw.toLowerCase().replace(/_/g, "-") as RiskLabel;

const RISK_TEXT: Record<RiskLabel, string> = {
    "emergency-department": "Emergency Department",
    "immediate": "Immediate",
    "urgent-to-oph": "Urgent to Ophthalmology",
    "urgent-to-gp-or-neur": "Urgent to GP/Neurology",
    "to-gp": "To GP",
    "no-referral": "No Referral",
    "other-eye-conditions-guidance": "Other Eye Conditions Guidance",
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

const LEVEL_UI: Record<Level, { cls: "red"|"orange"|"green"; txt: string }> = {
    high:   { cls: "red",    txt: "High Risk" },
    medium: { cls: "orange", txt: "Moderate Risk" },
    low:    { cls: "green",  txt: "Low Risk" },
};

const ALL_RECS = Object.keys(RISK_TEXT) as RiskLabel[];
const PAGE_SIZE = 20;
const dOnly = (iso?: string) => (iso ?? "").slice(0, 10);

export default function AdminDashboard() {
    const nav = useNavigate();

    // 数据
    type Row = { id: string; date: string; risk: RiskLabel };
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);

    // 过滤（参照 Records：风险等级、日期、转诊结果）
    const [levels, setLevels] = useState<Set<Level>>(new Set());
    const [recs, setRecs] = useState<Set<RiskLabel>>(new Set(ALL_RECS));
    const [from, setFrom] = useState<string>(""); // yyyy-mm-dd
    const [to, setTo]     = useState<string>("");

    // 分页
    const [page, setPage] = useState(1);

    // 取数与整形（与 Records 一致：listAssessments → 规范化）
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                // 后端仅支持单选 riskLevel 与日期；多选在前端过滤
                const params: any = {};
                if (levels.size === 1) params.riskLevel = Array.from(levels)[0];
                else params.riskLevel = "all";
                if (from) params.startDate = from;
                if (to)   params.endDate   = to;

                const { records } = await listAssessments(params);
                // 与 Records 对齐：id、createdAt/date、recommendation/risk
                const data: Row[] = (records || []).map((r: any) => ({
                    id: r.id,
                    date: r.createdAt ?? r.date,
                    risk: normalizeRisk(String(r.recommendation ?? r.risk)),
                }));
                if (mounted) {
                    setRows(data);
                    setPage(1);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [levels, from, to]);

    // 多选转诊结果的前端过滤（Records 风格）
    const filtered = useMemo(() => {
        return rows.filter(r => {
            if (!recs.has(r.risk)) return false;
            // 日期已在后端按天筛过；这里再做一次前端保护（可留空）
            if (from && r.date && r.date.slice(0,10) < from) return false;
            if (to   && r.date && r.date.slice(0,10) > to)   return false;
            if (levels.size) {
                const lvl = RISK_TO_LEVEL[r.risk];
                if (!levels.has(lvl)) return false;
            }
            return true;
        });
    }, [rows, recs, from, to, levels]);

    // 分页（每页 20）
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const pageRows = filtered.slice(start, start + PAGE_SIZE);
    useEffect(() => { setPage(1); }, [filtered.length]);

    // 快捷日期
    const setQuick = (days: number) => {
        const today = new Date();
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startD = new Date(end); startD.setDate(startD.getDate() - (days - 1));
        setFrom(startD.toISOString().slice(0,10));
        setTo(end.toISOString().slice(0,10));
    };

    // 药丸标签
    const pills = useMemo(() => {
        const ps: { key:string; text:string; onRemove:()=>void }[] = [];
        levels.forEach(l => ps.push({
            key: `lvl-${l}`,
            text: `Level: ${LEVEL_UI[l].txt}`,
            onRemove: () => { const s = new Set(levels); s.delete(l); setLevels(s); },
        }));
        if (recs.size !== ALL_RECS.length) {
            recs.forEach(r => ps.push({
                key: `rec-${r}`,
                text: `Referral: ${RISK_TEXT[r]}`,
                onRemove: () => { const s = new Set(recs); s.delete(r); setRecs(s); },
            }));
        }
        if (from || to) {
            ps.push({
                key: "date",
                text: `Date: ${from || ""}${from && to ? " ~ " : ""}${to || ""}`,
                onRemove: () => { setFrom(""); setTo(""); },
            });
        }
        return ps;
    }, [levels, recs, from, to]);

    const resetAll = () => {
        setLevels(new Set());
        setRecs(new Set(ALL_RECS));
        setFrom(""); setTo("");
        setPage(1);
    };
    const toggleLevel = (l: Level) => {
        const s = new Set(levels);
        s.has(l) ? s.delete(l) : s.add(l);
        setLevels(s);
    };
    const toggleRec = (r: RiskLabel) => {
        const s = new Set(recs);
        s.has(r) ? s.delete(r) : s.add(r);
        setRecs(s);
    };

    return (
        <main className="records-main">
            {/* 顶部提示 + 返回 */}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
                <div style={{padding:"8px 12px", background:"#fff3cd", border:"1px solid #ffeeba", color:"#856404", borderRadius:4}}>
                    Administrator view. Data may be sensitive.
                </div>
                <button className="view-btn" onClick={() => nav('/user-selection')}>Go back</button>
            </div>

            <h1 className="records-title">Admin Console</h1>

            {/* 过滤区（参照 Records 的交互） */}
            <section style={{border:"1px solid var(--border-grey)", borderRadius:8, padding:16, background:"var(--lighter-base)", marginBottom:16}}>
                <div style={{display:"flex", gap:16, flexWrap:"wrap", alignItems:"center"}}>
                    {/* 时间 */}
                    <div>
                        <div style={{fontWeight:600, marginBottom:6}}>Time</div>
                        <div style={{display:"flex", gap:8}}>
                            <button className="view-btn" onClick={() => setQuick(7)}>Last 7 days</button>
                            <button className="view-btn" onClick={() => setQuick(30)}>Last 30 days</button>
                            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
                            <span>~</span>
                            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
                        </div>
                    </div>

                    {/* 风险等级 */}
                    <div>
                        <div style={{fontWeight:600, marginBottom:6}}>Risk Level</div>
                        <div style={{display:"flex", gap:8}}>
                            {(["high","medium","low"] as Level[]).map(l => (
                                <button key={l}
                                        onClick={() => toggleLevel(l)}
                                        className={`tag-pill tag-${LEVEL_UI[l].cls}`}
                                        style={{border: levels.has(l) ? "2px solid #333" : "none", color:"#fff"}}>
                                    {LEVEL_UI[l].txt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 转诊结果 */}
                    <div>
                        <div style={{fontWeight:600, marginBottom:6}}>Referral Result</div>
                        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:8, maxWidth:660}}>
                            {ALL_RECS.map(r => (
                                <label key={r} style={{display:"flex", gap:8, alignItems:"center"}}>
                                    <input type="checkbox" checked={recs.has(r)} onChange={() => toggleRec(r)} />
                                    <span>{RISK_TEXT[r]}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{marginLeft:"auto"}}>
                        <button className="view-btn" onClick={resetAll} style={{background:"#6c757d"}}>Reset</button>
                    </div>
                </div>

                {/* 已选药丸 */}
                {pills.length > 0 && (
                    <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:12}}>
                        {pills.map(p => (
                            <span key={p.key} className="tag-pill" style={{background:"#e9ecef", color:"#333", border:"1px solid #ced4da"}}>
                {p.text}
                                <button onClick={p.onRemove} style={{marginLeft:8, border:"none", background:"transparent", cursor:"pointer"}}>×</button>
              </span>
                        ))}
                    </div>
                )}
            </section>

            {/* 表格（列顺序：Id｜Risk Level｜Referral｜Time｜View） */}
            <div className="table-wrapper">
                <table className="records-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Risk Level</th>
                        <th>Referral</th>
                        <th>Time</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={5} style={{textAlign:"center", padding:24}}>Loading…</td></tr>
                    ) : pageRows.length ? (
                        pageRows.map(r => {
                            const lvl = RISK_TO_LEVEL[r.risk];
                            return (
                                <tr key={r.id}>
                                    <td style={{fontFamily:"monospace"}}>{r.id}</td>
                                    <td><span className={`tag-pill tag-${LEVEL_UI[lvl].cls}`}>{LEVEL_UI[lvl].txt}</span></td>
                                    <td>{RISK_TEXT[r.risk]}</td>
                                    <td>{dOnly(r.date)}</td>
                                    <td>
                                        <button className="view-btn" onClick={() => {/* TODO: navigate(`/admin/preview/${r.id}`) */}}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan={5} style={{textAlign:"center", padding:24}}>No Matching Records</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* 分页 */}
            {filtered.length > 0 && (
                <div style={{display:"flex", justifyContent:"center", gap:8, marginTop:16}}>
                    <button className="view-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Previous</button>
                    <span style={{alignSelf:"center"}}>Page {page} / {totalPages}</span>
                    <button className="view-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
                </div>
            )}
        </main>
    );
}
