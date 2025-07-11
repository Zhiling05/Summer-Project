import { useNavigate } from "react-router-dom";
import "../styles/bottomnav.css"; // 引入底部导航栏样式（路径无误）

// 导入图标（注意 icons 多一层目录）
import HomeIcon from "../assets/icons/Home.svg";
import AssessIcon from "../assets/icons/Assess.svg";
import RecordsIcon from "../assets/icons/Records.svg";
import GuideIcon from "../assets/icons/Guide.svg";

// 底部导航栏组件
const BottomNav = () => {
  const navigate = useNavigate(); // 用于编程式跳转

  return (
    <nav className="bottom-nav">
      {/* 首页按钮 */}
      <button className="nav-item" onClick={() => navigate("/optometrist/home")}>
        <img src={HomeIcon} alt="Home" className="nav-icon" />
        <span>Home</span>
      </button>

      {/* 开始评估 */}
      <button className="nav-item" onClick={() => navigate("/optometrist/assess/start")}>
        <img src={AssessIcon} alt="Assess" className="nav-icon" />
        <span>Assess</span>
      </button>

      {/* 转诊记录 */}
      <button className="nav-item" onClick={() => navigate("/optometrist/records")}>
        <img src={RecordsIcon} alt="Records" className="nav-icon" />
        <span>Records</span>
      </button>

      {/* 工具导览 */}
      <button className="nav-item" onClick={() => navigate("/optometrist/guide")}>
        <img src={GuideIcon} alt="Guide" className="nav-icon" />
        <span>Guide</span>
      </button>
    </nav>
  );
};

export default BottomNav;
