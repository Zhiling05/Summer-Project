import { useEffect, useMemo, useState } from "react";
// import { listAssessments } from "../../api";
import "../../styles/admin.css";
// import BackButton from "../../components/BackButton";

import { useNavigate } from 'react-router-dom';

//日历选择器-DD-MM-YY
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import Header from "../../components/Header.tsx";

import { http, logoutAndDowngrade } from "../../api/index";

registerLocale('en-GB', enGB);


type RiskLabel =
    | "emergency-department" | "immediate"
    | "urgent-to-oph" | "urgent-to-gp-or-neur"
    | "to-gp" | "no-referral" | "other-eye-conditions-guidance";
type Level = "high" | "medium" | "low";
type Row = { id: string; date: string; risk: RiskLabel };

const normalizeRisk = (raw: string) =>
    raw.toLowerCase().replace(/_/g, "-") as RiskLabel;

const RISK_TEXT: Record<RiskLabel, string> = {
    "emergency-department": "Referral to Emergency Department",
    "immediate": "Immediate referral",
    "urgent-to-oph": "Urgent Referral to Ophthalmology",
    "urgent-to-gp-or-neur": "Urgent Referral to GP or Neurology",
    "to-gp": "Referral to GP",
    "no-referral": "No Referral",
    "other-eye-conditions-guidance": "Other Eye Conditions Guidance Required",
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
    const onExitAdmin = async () => {
        await logoutAndDowngrade();  // /logout → /guest?force=true
        nav('/select-role');
        };

    // 数据
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);

    // 过滤
    const [levels, setLevels] = useState<Set<Level>>(new Set());
    const [recs, setRecs]     = useState<Set<RiskLabel>>(new Set(ALL_RECS));
    const [from, setFrom] = useState<string>("");
    const [to, setTo]     = useState<string>("");
    const [fromDate, setFromDate] = useState<Date|null>(null);
    const [toDate, setToDate]     = useState<Date|null>(null);

    const toApi = (d: Date|null) => d ? format(d, 'yyyy-MM-dd') : '';

    // 分页
    const [page, setPage] = useState(1);

    // 拉取与整形（与 Records 一致）
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (levels.size === 1) params.riskLevel = Array.from(levels)[0];
                else params.riskLevel = "all";
                if (from) params.startDate = from;
                if (to)   params.endDate   = to;

                // // const { records } = await listAssessments(params);
                // const { records } = await listAssessments(undefined, { ...params, scope: 'all' });
                //
                // const data: Row[] = (records || []).map((r: any) => ({
                //     id: r.id,
                //     date: r.createdAt ?? r.date,
                //     risk: normalizeRisk(String(r.recommendation ?? r.risk)),
                // }));
                const qs = new URLSearchParams({ ...params, scope: 'all' }).toString();
                const json: any = await http(`/assessments?${qs}`);
                const arr  = Array.isArray(json) ? json : (json?.records ?? []);
                const data: Row[] = arr.map((r: any) => ({
                       id:   r.id ?? r._id ?? r.customId,
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

    // 前端继续做“转诊结果”多选与二次日期保护
    const filtered = useMemo(() => {
        return rows.filter(r => {
            if (!recs.has(r.risk)) return false;
            if (from && r.date && r.date.slice(0,10) < from) return false;
            if (to   && r.date && r.date.slice(0,10) > to)   return false;
            if (levels.size) {
                const lvl = RISK_TO_LEVEL[r.risk];
                if (!levels.has(lvl)) return false;
            }
            return true;
        });
    }, [rows, recs, from, to, levels]);

    // 分页
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const pageRows = filtered.slice(start, start + PAGE_SIZE);
    useEffect(() => { setPage(1); }, [filtered.length]);

    // 快捷日期
    // const setQuick = (days: number) => {
    //     const today = new Date();
    //     const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    //     const startD = new Date(end); startD.setDate(startD.getDate() - (days - 1));
    //     setFrom(startD.toISOString().slice(0,10));
    //     setTo(end.toISOString().slice(0,10));
    // };
    const setQuick = (days: number) => {
        const today = new Date();
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startD = new Date(end); startD.setDate(startD.getDate() - (days - 1));

        setFromDate(startD); setFrom(toApi(startD));
        setToDate(end);      setTo(toApi(end));
    };


    // 药丸
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
    const toggleLevel = (level: Level) => {
        const set = new Set(levels);
        set.has(level) ? set.delete(level) : set.add(level);
        setLevels(set);
    };
    const toggleRec = (risk: RiskLabel) => {
        const set = new Set(recs);
        set.has(risk) ? set.delete(risk) : set.add(risk);
        setRecs(set);
    };

    async function loadAllForAdmin(params: { riskLevel?: string; startDate?: string; endDate?: string }) {
        const qs = new URLSearchParams({
            ...(params.riskLevel ? { riskLevel: params.riskLevel } : {}),
            ...(params.startDate ? { startDate: params.startDate } : {}),
            ...(params.endDate ? { endDate: params.endDate } : {}),
            scope: 'all', // 仅 admin 界面加
        }).toString();

        const json: any = await http(`/assessments?${qs}`);
        const list = Array.isArray(json) ? json : (json?.records ?? []);

        const rows = list.map((r: any) => ({
            id:   r.id ?? r._id ?? r.customId,
            date: r.date ?? r.createdAt,
            risk: String(r.risk ?? r.recommendation ?? 'no-referral').toLowerCase().replace(/_/g, '-'),
        }));

        setRows(rows); // 确保上方 useState<[...]> 是 rows，而非 data/records
    }



    return (
        <>
            <Header title="Admin Console" />
            <button className="exit-button" onClick={onExitAdmin}>← Exit</button>

        <main className="admin-main">
            <div className="admin-wrapper">

                <h1 className="admin-title">Admin Console</h1>

                {/* 过滤选择区*/}
                <section className="admin-filter">
                    <div className="admin-row">
                        <div className="admin-label">Time</div>
                        <div className="admin-controls controls-inline">
                            <button className="view-btn" onClick={() => setQuick(7)}>Last 7 days</button>
                            <button className="view-btn" onClick={() => setQuick(30)}>Last 30 days</button>

                            <span className="dp-sm">
                            <DatePicker
                                selected={fromDate}
                                onChange={(d) => { setFromDate(d); setFrom(toApi(d)); }}
                                dateFormat="dd-MM-yy"
                                placeholderText="DD-MM-YY"
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
                                placeholderText="DD-MM-YY"
                                isClearable
                                locale="en-GB"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                            />
                            </span>
                        </div>
                    </div>


                    {/* Referral Result */}
                    <div className="admin-row">
                        <div className="admin-label">Referral Result</div>
                        <div className="admin-controls rec-list">
                            {ALL_RECS.map(r => (
                                <label key={r} style={{display:"flex", alignItems:"center", gap:8}}>
                                    <input type="checkbox" checked={recs.has(r)} onChange={()=>toggleRec(r)} />
                                    <span>{RISK_TEXT[r]}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Risk Level */}
                    <div className="admin-row">
                        <div className="admin-label">Risk Level</div>
                        <div className="admin-controls risk-buttons">
                            {(["high","medium","low"] as Level[]).map(l => (
                                <button key={l}
                                        onClick={()=>toggleLevel(l)}
                                        className={`tag-pill tag-${LEVEL_UI[l].cls}`}
                                        style={{border: levels.has(l) ? "2px solid #333" : "none", color:"#fff"}}>
                                    {LEVEL_UI[l].txt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar: pills + reset */}
                    <div className="admin-bottom">
                        <div className="admin-pills">
                            {pills.map(p => (
                                <span key={p.key} className="tag-pill" style={{background:"#e9ecef", color:"#333", border:"1px solid #ced4da"}}>
          {p.text}
                                    <button onClick={p.onRemove} style={{marginLeft:8, border:"none", background:"transparent", cursor:"pointer"}}>×</button>
        </span>
                            ))}
                        </div>
                        <button className="view-btn reset-btn" onClick={resetAll}>Reset</button>
                    </div>
                </section>


                {/* 表格 */}
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Risk Level</th>
                            <th>Referral</th>
                            <th>Time</th>
                            {/*<th></th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ textAlign: "center", padding: 24 }}>Loading…</td></tr>
                        ) : pageRows.length ? (
                            pageRows.map((r) => {
                                const lvl = RISK_TO_LEVEL[r.risk];
                                return (
                                    <tr key={r.id}>
                                        <td className="admin-cell-id" style={{ fontFamily: "monospace" }}>{r.id}</td>
                                        <td className="admin-cell-risk">
                                            <span className={`tag-pill tag-${LEVEL_UI[lvl].cls} no-wrap`}>{LEVEL_UI[lvl].txt}</span>
                                        </td>
                                        <td className="admin-cell-ref">{RISK_TEXT[r.risk]}</td>
                                        <td className="admin-cell-time">{dOnly(r.date)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan={4} style={{ textAlign: "center", padding: 24 }}>No Matching Records</td></tr>
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

            </div>
        </main>
        </>
    );
}
