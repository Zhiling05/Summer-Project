import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '/src/styles/sidebar.css';

const AboutPage = () => {
  return <h1>About Us Page</h1>;
};

const ContactPage = () => {
  return <h1>Contact Us Page</h1>;
};

const SideBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuIconVisible, setIsMenuIconVisible] = useState(true);

  const toggleSideBar = () => {
    setIsVisible(!isVisible);
    setIsMenuIconVisible(!isMenuIconVisible); // 切换图标显示状态
  };

  // 监听点击页面的任意地方，收起 sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isVisible && event.target instanceof HTMLElement) {
        // 判断 event.target 是否为 HTMLElement 类型
        if (!event.target.closest('.sidebar') && !event.target.closest('.toggle-btn')) {
          setIsVisible(false);
          setIsMenuIconVisible(true); // 收起时恢复图标显示
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div>
      {/* 按钮控制侧边栏显示与隐藏 */}
      {isMenuIconVisible && (
        <button onClick={toggleSideBar} className="toggle-btn">
          {/* 汉堡菜单图标 */}
          <div className="hamburger-icon">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </button>
      )}

      {/* 侧边栏内容 */}
      {isVisible && (
        <div className="sidebar">
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export { AboutPage, ContactPage };
export default SideBar;
