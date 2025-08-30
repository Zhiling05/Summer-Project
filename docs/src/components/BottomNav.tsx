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
    {/* left page */}
    <path d="M3 4.5c2-.5 4-.5 6 0v15c-2-.5-4-.5-6 0z" />
    {/* right page */}
    <path d="M21 4.5c-2-.5-4-.5-6 0v15c2-.5 4-.5 6 0z" />
   {/* center crease */}
    <line x1="12" y1="6" x2="12" y2="18" />
  </svg>
);

// 底部导航栏组件
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();


  // 是否处于“进行中的评估题目页”
      const inAssess = location.pathname.startsWith("/optometrist/assess/");
      const onResult = location.pathname.includes("/optometrist/assess/recommendations");
      const completed = sessionStorage.getItem("assessmentComplete") === "true";
      const inOngoingAssess = inAssess && !onResult && !completed;

   // 离开拦截弹窗状态
       const [leaveOpen, setLeaveOpen] = useState(false);
   const [target, setTarget] = useState<string | null>(null);

       // 拦截：从评估页跳到评估外页面 → 弹窗
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
       const keepProgress = () => {
       setLeaveOpen(false);
       if (target) navigate(target);
       };
   const discardProgress = () => {
       sessionStorage.removeItem("assessStarted");
       sessionStorage.removeItem("lastQuestionId");
       sessionStorage.removeItem("assessmentComplete");
       setLeaveOpen(false);
       if (target) navigate(target);
     };

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
        // 特殊处理 Assess 按钮的激活状态判断
        let active;
        if (label === "Assess") {
          // 只要路径包含 /optometrist/assess 就认为是激活状态
          active = location.pathname.includes("/optometrist/assess");
        } else {
          // 其他按钮使用 startsWith 判断
          active = location.pathname.startsWith(to);
        }
        
        return (
          <button
            key={to}
            className={`nav-item${active ? " active" : ""}`}
            // onClick={() => handleNavigation(to)}
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
        onContinue={keepProgress}     // “保留进度”
        onRestart={discardProgress}   // “不保留进度”
        onClose={() => setLeaveOpen(false)}
        title="Leave assessment?"
        description="Do you want to keep your progress?"
        continueText="Save"
        restartText="Disgard"
        />
    </>
  );
};

export default BottomNav;