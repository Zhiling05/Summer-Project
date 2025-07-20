// docs/src/pages/optometrist/assess/questions/Q2.tsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Answer } from '../../../../api'                 // ← 类型
import '../../../../styles/question.css'
import BottomNav  from '../../../../components/BottomNav'
import NHSLogo    from '../../../../assets/NHS_LOGO.jpg'
import DIPPLogo   from '../../../../assets/DIPP_Study_logo.png'

interface LocationState {
  answers?: Answer[]
  patientId?: string
}

export default function Q2() {
  const navigate = useNavigate()

  /* 读取上一题带过来的 state ---------------------------------- */
  const { state } = useLocation() as { state: LocationState }
  const prevAnswers: Answer[] = state?.answers ?? []

  /* 如果还没有 patientId，第一次生成一个 ---------------------- */
  const patientId =
    state?.patientId ?? `pid-${Date.now().toString(36)}`

  /* 本题交互 --------------------------------------------------- */
  const [answer, setAnswer] = useState('')

  const question =
    'Has the patient experienced any of the following red-flag symptoms?'
  const opts = [
    'Impaired level or decreased consciousness',
    'Seizures',
    'Stroke-like symptoms',
    'Thunderclap headache',
    'New-onset headache and vomiting',
    'Objective neurological deficit',
    'Worsening headache and fever',
    'None of the above',
  ]

  const handleNext = () => {
    if (!answer) return

    /* 把本题写入新的 answers 数组 */
    const newAnswers: Answer[] = [
      ...prevAnswers,
      { questionId: 'Q2', answer },
    ]

    if (answer !== 'None of the above') {
      /* 红旗症状 → 立即转急诊 */
      navigate('../../recommendations/emergency-department', {
        state: {
          answers: newAnswers,
          patientId,
          recommendation: 'EmergencyDepartment',
        },
      })
    } else {
      /* 正常流程 → 下一题 Q3 */
      navigate('../Q3', {
        state: {
          answers: newAnswers,
          patientId,
        },
      })
    }
  }

  /* ----------------------------  JSX  ---------------------------- */
  return (
    <>
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo}  alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">DIPP Assessment</span>
        </div>
      </header>

      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go back
          </button>

          <section className="question-box">
            <h1 className="nhsuk-heading-l">{question}</h1>
            <p className="hint">Select one option</p>
            <ul className="radio-list">
              {opts.map((opt) => (
                <li key={opt}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="q2"
                      value={opt}
                      checked={answer === opt}
                      onChange={() => setAnswer(opt)}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>

            <button
              className="continue-button"
              disabled={!answer}
              onClick={handleNext}
            >
              Next
            </button>
          </section>
        </main>
      </div>

      <BottomNav />
    </>
  )
}
