// docs/src/pages/optometrist/assess/recommendations/EmergencyDepartment.tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  createAssessment,
  exportAssessment,
  sendReport,
  Answer,
  UserRole,
} from '../../../../api'
import { saveAs } from 'file-saver'               // ← 新增
import '../../../../styles/question.css'
import NHSLogo  from '../../../../assets/NHS_LOGO.jpg'
import DIPPLogo from '../../../../assets/DIPP_Study_logo.png'

interface LocationState {
  answers: Answer[]
  patientId: string
  recommendation: string           // 'EmergencyDepartment'
}

export default function EmergencyDepartment() {
  const navigate          = useNavigate()
  const { state }         = useLocation() as { state: LocationState }

  /* --- 本地 UI 状态 --- */
  const [saving,  setSaving]  = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [assessId, setId]     = useState<string | null>(null)   // 保存成功后拿到 id
  const [sending, setSending] = useState(false)                 // 发邮件按钮 loading

  /* ---- 首次挂载：保存到后端 ---- */
  useEffect(() => {
    console.log('EmergencyDepartment state =>', state)

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
        setId(id)                 // 记住后端返回的 id
      } catch (e) {
        console.error(e)
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
  if (error)
    return (
      <div>
        <p>保存失败：{error}</p>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    )

  /* ---------- 正常渲染 ---------- */
  return (
    <>
      {/* 顶栏 */}
      <header className="nhs-header" style={{ backgroundColor: '#005eb8', color: 'white', padding: '12px 0' }}>
        <div className="nhs-header__inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <img className="logo nhs-logo"  src={NHSLogo}  alt="NHS logo"  style={{ height: '40px' }} />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" style={{ height: '40px', marginLeft: '20px' }} />
          <span className="nhs-header__service" style={{ marginLeft: 'auto', fontSize: '1.2rem', fontWeight: 'bold' }}>
            DIPP Assessment
          </span>
        </div>
      </header>

      {/* 粉色背景区域 */}
      <div style={{ backgroundColor: '#ffe4e6', minHeight: 'calc(100vh - 120px)', padding: '2rem 0', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px' }}>
          <section className="question-box" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 className="nhsuk-heading-l" style={{ color: '#d03838', borderBottom: '4px solid #d03838', paddingBottom: '0.5rem' }}>
              Immediate Referral
            </h1>
            <p>Send patient to <strong>Emergency Department</strong> Context XXXXX</p>
            <ul className="nhsuk-list nhsuk-list--bullet">
              <li>Context XXXXX</li>
              <li>Context XXXXX</li>
              <li>Context XXXXX</li>
            </ul>

            {/* 动作按钮 */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <button className="continue-button" onClick={() => navigate('/optometrist/assess/')} style={{ backgroundColor: '#d03838' }}>
                Return to Home
              </button>

              <button className="continue-button" disabled={!assessId} onClick={handleDownload}>
                Download TXT
              </button>

              <button className="continue-button" disabled={!assessId || sending} onClick={handleSendMail}>
                {sending ? 'Sending…' : 'Send by Email'}
              </button>
            </div>
          </section>
        </div>
      </div>

      <footer className="nhs-footer">
        <div className="footer-inner">
          <p>
            Other ways to contact DIPP if you have a hearing problem or need help in other languages&nbsp;
            <a href="#/" target="_blank" rel="noopener noreferrer">
              (opens in a new tab)
            </a>.
          </p>
          <hr />
          <ul className="footer-links">
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Privacy statement
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Terms and conditions
              </a>
            </li>
            <li>
              <a href="#/" target="_blank" rel="noopener noreferrer">
                Accessibility statement
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}