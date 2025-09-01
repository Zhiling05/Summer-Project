import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import StartPage from './assess/StartPage';
import { useNavigate } from 'react-router-dom';
import '../../styles/tutorial.css'; 

type Step = {
  selector: string;
  desc?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
};

/**
 * Tutorial - Interactive onboarding guide for optometrists
 * - Overlays on top of StartPage
 * - Highlights navigation and key actions step by step
 */
export default function Tutorial() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const close = () => {
    localStorage.setItem('seenAssessmentGuide', 'true');
    setVisible(false);
    navigate('/optometrist/assess', { replace: true });
  };

  // Ensure bottom nav tabs and start button have IDs for spotlight targeting
  useEffect(() => {
    const ensureId = (el: Element | null, id: string) => {
      if (el && !el.getAttribute('id')) (el as HTMLElement).id = id;
    };

    const withinNav = (txt: string) =>
      Array.from(document.querySelectorAll('nav *')).find(
        el => (el.textContent || '').trim().toLowerCase() === txt.toLowerCase()
      );
    const byLabel = (label: string) =>
      document.querySelector(`nav [aria-label="${label}"]`) ||
      document.querySelector(`[aria-label="${label}"]`) ||
      document.querySelector(`[title="${label}"]`);

    ensureId(byLabel('Home')   || withinNav('Home')   || null, 'tab-home');
    ensureId(byLabel('Assess') || withinNav('Assess') || null, 'tab-assess');
    ensureId(byLabel('Records')|| withinNav('Records')|| null, 'tab-records');
    ensureId(byLabel('Guide')  || withinNav('Guide')  || null, 'tab-guide');

    const startBtn =
      document.getElementById('start-now') ||
      Array.from(document.querySelectorAll('button, a')).find(
        el => (el.textContent || '').trim() === 'Start now'
      ) ||
      null;
    ensureId(startBtn, 'start-now');
  }, []);

  const steps = useMemo<Step[]>(() => [
    { selector: '#tab-home',        desc: 'Choose your role to enter the section.', placement: 'top', className: 'ag-home' },
    { selector: '#tab-assess',      desc: 'Answer questions to assess the condition.', placement: 'top' },
    { selector: '#tab-records',     desc: 'View history and completed assessments.', placement: 'top' },
    { selector: '#tab-guide',       desc: 'Access help and tutorials for key actions.', placement: 'top', className: 'ag-guide' },
    { selector: '#hamburger-menu',  desc: 'Open the sidebar to access Settings and Contact Us.', placement: 'left' },
    { selector: '#start-now',       desc: 'Click here to start the current assessment.', placement: 'top' },
  ], []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Render StartPage as background */}
      <StartPage />
      {/* Overlay tutorial on top */}
      {visible && (
        <Overlay
          steps={steps}
          index={stepIndex}
          onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
          onNext={() => setStepIndex((i) => (i >= steps.length - 1 ? (close(), i) : i + 1))}
          onSkip={close}
        />
      )}
    </div>
  );
}

/**
 * Overlay - UI layer for tutorial spotlight
 * - Creates dark mask with transparent hole
 * - Shows tooltip bubble near highlighted element
 */
function Overlay({
  steps,
  index,
  onPrev,
  onNext,
  onSkip,
  nextText = 'Next',
  prevText = 'Previous',
  skipText = '>>Skip',
  finishText = 'Start',
}: {
  steps: Step[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  nextText?: string;
  prevText?: string;
  skipText?: string;
  finishText?: string;
}) {
  const BUBBLE_GAP = 12;       // bubble margin to target
  const BOTTOM_PULLUP = 20;    // pull up bubble when placed bottom
  const HOLE_PADDING = 6;      // padding around spotlight hole
  const HOLE_RADIUS = 12;      // corner radius of spotlight hole

  function roundedRectPath(x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2);
    return [
      `M ${x + rr} ${y}`,
      `H ${x + w - rr}`,
      `A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr}`,
      `V ${y + h - rr}`,
      `A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h}`,
      `H ${x + rr}`,
      `A ${rr} ${rr} 0 0 1 ${x} ${y + h - rr}`,
      `V ${y + rr}`,
      `A ${rr} ${rr} 0 0 1 ${x + rr} ${y}`,
      'Z',
    ].join(' ');
  }

  const isLast = index >= steps.length - 1;
  const step = steps[index];

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [holePath, setHolePath] = useState<string>('');
  const [bubble, setBubble] = useState<{ left: number; top: number; placement: 'top'|'bottom'|'left'|'right' }>(
    { left: 24, top: 24, placement: 'top' }
  );

  // Handle keyboard navigation and scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') (isLast ? onSkip() : onNext());
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = orig;
    };
  }, [onNext, onPrev, onSkip, isLast]);

  const compute = React.useCallback(() => {
    const el = document.querySelector(step.selector) as HTMLElement | null;
    let rect: DOMRect | null = null;
    if (el) {
      const r = el.getBoundingClientRect();
      rect = new DOMRect(r.left + window.scrollX, r.top + window.scrollY, r.width, r.height);
    }
    setTargetRect(rect);

    if (rect) {
      const x = rect.x - HOLE_PADDING;
      const y = rect.y - HOLE_PADDING;
      const w = rect.width + HOLE_PADDING * 2;
      const h = rect.height + HOLE_PADDING * 2;
      setHolePath(roundedRectPath(x, y, w, h, HOLE_RADIUS));
    } else {
      setHolePath('');
    }

    const vw = window.innerWidth;
    const scrollY = window.scrollY;
    const place = step.placement ?? 'bottom';

    let left = 24, top = 24 + scrollY;
    if (rect) {
      const centerX = rect.x + rect.width / 2;
      const EXTRA_DOWN = 30;

      if (place === 'top') {
        top = Math.max(scrollY + 12, rect.y - 172);
        if (step.selector === '#hamburger-menu' || step.selector === '#start-now') {
          top += EXTRA_DOWN;
        }
        if (step.selector === '#start-now') {
          top -= 40;
        }
        left = Math.min(Math.max(12, centerX - 180), vw - 12 - 360);
      } else if (place === 'bottom') {
        top = rect.y + rect.height + BUBBLE_GAP - BOTTOM_PULLUP;
        if (step.selector === '#hamburger-menu' || step.selector === '#start-now') {
          top += EXTRA_DOWN;
        }
        left = Math.min(Math.max(12, centerX - 180), vw - 12 - 360);

        const ESTIMATED_BUBBLE_HEIGHT = 160;
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) {
          const limit = bottomNav.getBoundingClientRect().top + window.scrollY - 12;
          if (top + ESTIMATED_BUBBLE_HEIGHT > limit) {
            top = limit - ESTIMATED_BUBBLE_HEIGHT;
          }
        }
      } else if (place === 'left') {
        top = rect.y + rect.height / 2 + 30;
        if (step.selector === '#hamburger-menu') {
          top += 20;
        }
        left = Math.max(12, rect.x - 12 - 320);
      } else {
        top = rect.y + rect.height / 2 - 80;
        left = Math.min(vw - 12 - 320, rect.x + rect.width + 12);
      }
    }
    setBubble({ left, top, placement: place });
  }, [step]);

  useLayoutEffect(() => {
    compute();
    const onScroll = () => compute();
    const onResize = () => compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [compute]);

  const ui = (
    <div className="ag-root" role="dialog" aria-modal onClick={onSkip}>
      {/* Dark overlay with spotlight hole */}
      <svg className="ag-mask" width="100%" height="100%">
        <defs>
          <mask id="ag-hole">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {holePath && <path d={holePath} fill="black" />}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="var(--overlay-dark)" mask="url(#ag-hole)" />
      </svg>

      <div
        className={`ag-bubble ag-${bubble.placement} ${step.className || ''}`}
        style={{ left: bubble.left, top: bubble.top }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="ag-skip" onClick={onSkip}>{skipText}</button>
        {step.desc && <div className="ag-desc">{step.desc}</div>}

        <div className="ag-actions">
          <div style={{ flex: 1 }} />
          <button className="ag-btn" onClick={onPrev} disabled={index === 0}>{prevText}</button>
          <button className="ag-btn primary" onClick={isLast ? onSkip : onNext}>
            {isLast ? finishText : nextText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
