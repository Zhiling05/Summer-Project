// docs/src/pages/optometrist/assess/recommendations/EmergencyDepartment.tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  createAssessment,
  exportAssessment,
  sendReport,
  fetchReportText,        // ① NEW —— 在 src/api/index.ts 里已补充
  Answer,
  UserRole,
} from '../../../../api'
import { saveAs } from 'file-saver'
import '../../../../styles/question.css'
import NHSLogo  from '../../../../assets/NHS_LOGO.jpg'
import DIPPLogo from '../../../../assets/DIPP_Study_logo.png'

interface LocationState {
  answers: Answer[]
  patientId: string
  recommendation: string   // 'EmergencyDepartment'
}

export default function EmergencyDepartment() {
  const navigate           = useNavigate()
  const { state }          = useLocation() as { state: LocationState }

  /* --- 本地 UI 状态 --- */
  const [saving,  setSaving]  = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [assessId, setId]     = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  /* ↓ 预览/复制相关 */
  const [report, setReport]   = useState<string>('')   // 文本内容
  const [show,   setShow]     = useState(false)        // 预览面板开关
  const hasReport             = !!report

  /* ---- 首次挂载：保存到后端 ---- */
  useEffect(() => {
    if (!state?.answers?.length || !state.patientId) {
      setError('缺少答题数据，请重新开始 Assessment')
      setSaving(false)
      return
    }

    ;(async () => {
      try {
        const { id } = await createAssessment({
          role: 'optometrist' as UserRole,
          patientId: state.patientId,
          answers: state.answers,
          recommendation: state.recommendation,
        })
        setId(id)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setSaving(false)
      }
    })()
  }, [])

  /* ---- 下载 txt ---- */
  async function handleDownload() {
    if (!assessId) return
    try {
      const blob = await exportAssessment(assessId, 'txt')
      saveAs(blob, `assessment-${assessId}.txt`)
    } catch (e) {
      alert('下载失败：' + (e as Error).message)
    }
  }

  /* ---- 预览 or 复制：第一次点击时请求文本，之后复用缓存 ---- */
  async function ensureReport() {
    if (!assessId) return ''
    if (report) return report
    const txt = await fetchReportText(assessId)
    setReport(txt)
    return txt
  }

  async function handlePreview() {
    try {
      await ensureReport()
      setShow(true)
    } catch (e) {
      alert('获取报告失败：' + (e as Error).message)
    }
  }

  async function handleCopy() {
    try {
      const txt = await ensureReport()
      await navigator.clipboard.writeText(txt)
      alert('已复制到剪贴板')
    } catch (e) {
      alert('复制失败：' + (e as Error).message)
    }
  }

  /* ---- 发邮件 ---- */
  async function handleSendMail() {
    if (!assessId) return
    const email = prompt('Send to email address:')
    if (!email) return
    try {
      setSending(true)
      await sendReport(assessId, email, 'txt')
      alert('邮件已发送！')
    } catch (e) {
      alert('发送失败：' + (e as Error).message)
    } finally {
      setSending(false)
    }
  }

  /* ---- 保存中 / 错误 ---- */
  if (saving) return <div>正在保存你的 Assessment…</div>
  if (error)  return (
    <div>
      <p>保存失败：{error}</p>
      <button onClick={() => window.location.reload()}>重试</button>
    </div>
  )

  /* ---------- 正常渲染 ---------- */
  return (
    <>
      {/* 顶栏 */}
      <header className="nhs-header" style={{ backgroundColor:'#005eb8', color:'#fff', padding:'12px 0' }}>
        <div className="nhs-header__inner" style={{ maxWidth:960, margin:'0 auto', padding:'0 16px',
          display:'flex', alignItems:'center' }}>
          <img className="logo nhs-logo"  src={NHSLogo}  alt="NHS logo"  style={{ height:40 }} />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" style={{ height:40, marginLeft:20 }} />
          <span className="nhs-header__service" style={{ marginLeft:'auto', fontSize:'1.2rem', fontWeight:'bold' }}>
            DIPP Assessment
          </span>
        </div>
      </header>

      {/* 粉色背景区域 */}
      <div style={{ backgroundColor:'#ffe4e6', minHeight:'calc(100vh - 120px)', padding:'2rem 0', width:'100vw',
        marginLeft:'calc(-50vw + 50%)' }}>
        <div style={{ maxWidth:960, margin:'0 auto', padding:'0 16px' }}>
          <section className="question-box" style={{ backgroundColor:'#fff', padding:'2rem',
            borderRadius:4, boxShadow:'0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 className="nhsuk-heading-l" style={{ color:'#d03838', borderBottom:'4px solid #d03838',
              paddingBottom:'0.5rem' }}>
              Immediate Referral
            </h1>
            <p>Send patient to <strong>Emergency Department</strong> Context XXXXX</p>
            <ul className="nhsuk-list nhsuk-list--bullet">
              <li>Context XXXXX</li><li>Context XXXXX</li><li>Context XXXXX</li>
            </ul>

            {/* 动作按钮 */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginTop:'1.5rem' }}>
              <button className="continue-button" style={{ backgroundColor:'#d03838' }}
                onClick={() => navigate('/optometrist/assess/')}>Return to Home</button>

              <button className="continue-button" disabled={!assessId} onClick={handleDownload}>
                Download&nbsp;TXT
              </button>

              <button className="continue-button" disabled={!assessId} onClick={handlePreview}>
                Preview&nbsp;Report
              </button>

              <button className="continue-button" disabled={!assessId} onClick={handleCopy}>
                Copy&nbsp;Report
              </button>

              <button className="continue-button" disabled={!assessId || sending} onClick={handleSendMail}>
                {sending ? 'Sending…' : 'Send&nbsp;by&nbsp;Email'}
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* 预览弹层（极简实现） */}
      {show && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'#fff', padding:24, maxWidth:800, maxHeight:'80vh', overflow:'auto',
            borderRadius:4, whiteSpace:'pre-wrap', lineHeight:1.4, fontFamily:'monospace' }}>
            <h2>Report Preview</h2>
            <pre>{report || 'Loading…'}</pre>
            <div style={{ textAlign:'right', marginTop:12 }}>
              <button className="continue-button" onClick={() => setShow(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
