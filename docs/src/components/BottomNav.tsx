import { useNavigate, useLocation } from "react-router-dom";
import "../styles/bottomnav.css"; // 引入底部导航栏样式（路径无误）

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
  const navigate = useNavigate(); // 用于编程式跳转
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const items = [
    // { label: "Home", to: "/optometrist/home", Icon: HomeIcon },
    // { label: "Assess", to: "/optometrist/assess/start", Icon: AssessIcon },
    { label: "Home", to: "/optometrist/home", Icon: HomeIcon },
    { label: "Assess", to: "/optometrist/assess/questions/Q1", Icon: AssessIcon },

    { label: "Records", to: "/optometrist/records", Icon: RecordsIcon },
    { label: "Guide", to: "/optometrist/guide", Icon: GuideIcon },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ label, to, Icon }) => {
        const active = location.pathname.startsWith(to);
        return (
          <button
            key={to}
            className={`nav-item${active ? " active" : ""}`}
            onClick={() => handleNavigation(to)}
            style={{ position: "relative" }}
          >
            <Icon active={active} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
