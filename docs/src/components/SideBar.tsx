import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "/src/styles/sidebar.css";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);

  // 监听路径变化
  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    // 进入设置/联系我们页面时关闭侧边栏
    if (['/settings', '/contact-us'].includes(currentPath)) {
      setIsOpen(false);
    } 
    // 从设置/联系我们页面返回时打开侧边栏:ml-citation{ref="7" data="citationList"}
    else if (['/settings', '/contact-us'].includes(prevPath)) {
      setIsOpen(true);
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  // 外部点击关闭
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isOpen &&
        e.target instanceof HTMLElement &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".hamburger-btn")
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  // 判断是否显示汉堡按钮
  const shouldShowHamburger = !['/settings', '/contact-us'].includes(location.pathname);

  return (
    <>
      {shouldShowHamburger && (
        <button
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className={`hamburger-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      )}

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="sidebar-links">
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
