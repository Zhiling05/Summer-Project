import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';
import HumbugLogo from '../assets/humbug.png';
import '../styles/header.css';

interface HeaderProps {
  title: string;
  showBack?: boolean; // 可选参数：显示'Go back'按钮
}

export default function Header({
  title,
  showBack = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // 检查是否有传递的 state，如果有，则跳转到 state 中的路径
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      // 如果没有 state，使用 navigate(-1) 返回上一页
      navigate(-1);
    }
  };

  // 判断是否显示汉堡按钮
  const shouldShowHamburger = ![
    '/settings', // Settings 页面
    '/contact-us', // Contact Us 页面
  ].includes(location.pathname);

  return (
    <header className="nhs-header">
      <div className="nhs-header__left">
        {shouldShowHamburger && (
          <button
            aria-label="Open navigation"
            className="hamburger-btn"
            onClick={() => navigate('/sidebar')} // 假设点击汉堡按钮跳转到侧边栏页面
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        )}
        <img className="humbug-logo" src={HumbugLogo} alt="Humbug logo" />
        <img className="nhs-logo" src={NHSLogo} alt="NHS logo" />
        <img className="dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
        {/*<button
            type="button"
            className="nhs-header__back"
            onClick={handleBack}
          >
            <span className="back-arrow">←</span> //zkx改，把go back移到下面去了
          </button>*/}
      </div>

      <div className="nhs-header__center">
        {title}
      </div>

      <div className="nhs-header__right">
      </div>
    </header>
  );
}