import { useNavigate } from 'react-router-dom';
import '../../styles/question.css';
import BottomNav from '../../components/BottomNav';

import NHSLogo  from '../../assets/NHS_LOGO.jpg';
import DIPPLogo from '../../assets/DIPP_Study_logo.png';

export default function Guide() {
  const nav = useNavigate();

  return (
    <>
      {/* 顶栏（保持通用写法） */}
      <header className="nhs-header">
        <div className="nhs-header__inner">
          <img className="logo nhs-logo" src={NHSLogo}  alt="NHS logo" />
          <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
          <span className="nhs-header__service">Guide</span>
        </div>
      </header>

      {/* ★★★ 与 Records 同级的“全宽灰底” ★★★ */}
      <div
        style={{
          background: 'var(--page-grey)',   // 同一灰色
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)', // 左右拉伸
          minHeight: 'calc(100vh - 64px)', // 64 px 让给 BottomNav
          boxSizing: 'border-box',
          paddingTop: 'var(--space-xl)',
        }}
      >
        {/* 中央内容栅格（960 px 封顶） */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 var(--space-l)' }}>
          

          <h1 className="nhsuk-heading-l" style={{ textAlign: 'center', marginBottom: 'var(--space-l)' }}>
            Guide
          </h1>

          {/* 1. Software instruction */}
          <section className="question-box" style={{ marginBottom: 'var(--space-l)' }}>
            <h2 className="nhsuk-heading-s">Software instruction</h2>
            <ol>
              <li>context line&nbsp;1</li>
              <li>context line&nbsp;2</li>
              <li>context line&nbsp;3</li>
              <li>context line&nbsp;4</li>
            </ol>
          </section>

          {/* 2. Tutorial on Assessment Workflow */}
          <section className="question-box" style={{ marginBottom: 'var(--space-l)' }}>
            <h2 className="nhsuk-heading-s">Tutorial on Assessment Workflow</h2>
            <ol>
              <li>context line&nbsp;1</li>
              <li>context line&nbsp;2</li>
              <li>context line&nbsp;3</li>
              <li>context line&nbsp;4</li>
            </ol>
          </section>

          {/* 3. Reference Image Gallery */}
          <section className="question-box" style={{ marginBottom: 'var(--space-l)' }}>
            <h2 className="nhsuk-heading-s">Reference Image Gallery</h2>
            <div style={{ display: 'flex', gap: 'var(--space-m)', overflowX: 'auto' }}>
              {['context line 1', 'context line 2', 'context line 3'].map(txt => (
                <button key={txt}
                  style={{ flex: '0 0 140px', height: 80,
                           background: 'var(--border-grey)', border: 'none',
                           borderRadius: 'var(--radius-s)', color: 'var(--text-inverse)',
                           fontWeight: 600 }}>
                  {txt}
                </button>
              ))}
            </div>
          </section>

          {/* 4. DIPP Website Link */}
          <section className="question-box" style={{ marginBottom: 'calc(64px + var(--space-xl))' }}>
            <h2 className="nhsuk-heading-s">DIPP Website Link</h2>
            <a
              href="https://www.bristol.ac.uk/primaryhealthcare/researchthemes/dipp-study/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'var(--page-grey)',
                padding: 'var(--space-s) var(--space-m)',
                borderRadius: 'var(--radius-s)',
                color: 'var(--core-blue)',
                fontWeight: 600,
              }}
            >
              Visit DIPP Study website ↗
            </a>
          </section>
        </div>
      </div>

      {/* 底部导航（仍然 fixed） */}
      <BottomNav />
    </>
  );
}
