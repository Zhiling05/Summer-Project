import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import "../styles/bottomnav.css";
import PopupWindow from "./PopupWindow";

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    className="nav-icon"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9.5 12 3l9 6.5" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </svg>
);

const AssessIcon = ({ active }: { active: boolean }) => (
  <svg
    className="nav-icon"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const RecordsIcon = ({ active }: { active: boolean }) => (
  <svg
    className="nav-icon"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const GuideIcon = ({ active }: { active: boolean }) => (
  <svg
    className="nav-icon"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 4.5c2-.5 4-.5 6 0v15c-2-.5-4-.5-6 0z" />
    <path d="M21 4.5c-2-.5-4-.5-6 0v15c2-.5 4-.5 6 0z" />
    <line x1="12" y1="6" x2="12" y2="18" />
  </svg>
);

// Bottom navigation component for optometrist app
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is currently in an ongoing assessment
  const onQuestions = location.pathname.includes("/optometrist/assess/questions/");
  const completed = sessionStorage.getItem("assessmentComplete") === "true";
  const started = sessionStorage.getItem("assessStarted") === "true";
  const hasLast = !!sessionStorage.getItem("lastQuestionId");
  const inOngoingAssess = started && hasLast && onQuestions && !completed;

  // State for leave assessment confirmation popup
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [target, setTarget] = useState<string | null>(null);

  // Navigation guard: show confirmation when leaving ongoing assessment
  const guardNav = (to: string) => (e: React.MouseEvent) => {
    const toIsAssess = to.startsWith("/optometrist/assess/");
    const isLeavingAssess = inOngoingAssess && !toIsAssess;
    if (isLeavingAssess) {
      e.preventDefault();
      setTarget(to);
      setLeaveOpen(true);
      return;
    }
    if (location.pathname !== to) navigate(to);
  };

  // Keep assessment progress and navigate
  const keepProgress = () => {
    setLeaveOpen(false);
    if (target) navigate(target);
  };

  // Discard assessment progress and navigate
  const discardProgress = () => {
    sessionStorage.removeItem("assessStarted");
    sessionStorage.removeItem("lastQuestionId");
    sessionStorage.removeItem("assessmentComplete");
    setLeaveOpen(false);
    if (target) navigate(target);
  };

  // Navigation items configuration
  const items = [
    { label: "Home", to: "/select-role", Icon: HomeIcon },
    { label: "Assess", to: "/optometrist/assess/start-page", Icon: AssessIcon },
    { label: "Records", to: "/optometrist/records", Icon: RecordsIcon },
    { label: "Help", to: "/optometrist/guide", Icon: GuideIcon },
  ];

  return (
    <>
      <nav className="bottom-nav">
        {items.map(({ label, to, Icon }) => {
          // Determine active state for each navigation item
          let active;
          if (label === "Assess") {
            // Special handling for Assess button - active for any assess route
            active = location.pathname.includes("/optometrist/assess");
          } else {
            // Other buttons use startsWith matching
            active = location.pathname.startsWith(to);
          }
          
          return (
            <button
              key={to}
              className={`nav-item${active ? " active" : ""}`}
              onClick={guardNav(to)}
              style={{ position: "relative" }}
            >
              <Icon active={active} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      
      <PopupWindow
        open={leaveOpen}
        onContinue={keepProgress}
        onRestart={discardProgress}
        onClose={() => setLeaveOpen(false)}
        title="Leave assessment?"
        description="Do you want to keep your progress?"
        continueText="Save"
        restartText="Discard"
      />
    </>
  );
};

export default BottomNav;