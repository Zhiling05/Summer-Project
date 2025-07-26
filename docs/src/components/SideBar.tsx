//docs/src/components/SideBar.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "/src/styles/sidebar.css";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // 控制菜单是否打开

  /* —— 切换 —— */
  const toggle = () => setIsOpen((v) => !v);

  /* —— 点击空白处自动收起 —— */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isOpen &&
        e.target instanceof HTMLElement &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".hamburger-btn") // 如果点击的地方不是侧边栏和汉堡按钮，关闭菜单
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <>
      {/* 汉堡按钮 */}
      <button
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className={`hamburger-btn ${isOpen ? "active" : ""}`}
        onClick={toggle}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/* 遮罩层 */}
      {isOpen && <div className="sidebar-overlay" onClick={toggle} />}

      {/* 侧边栏 */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="sidebar-links">
          <li>
            <Link to="/about-us">About&nbsp;Us</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact&nbsp;Us</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
