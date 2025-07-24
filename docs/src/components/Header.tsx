// lzl新增文件：Header组件，搭配header.css

import React from 'react';//ycl2
import { useNavigate } from 'react-router-dom';//ycl2
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';
import '../styles/header.css';

interface HeaderProps {
  title: string;
showBack?: boolean; // 是否显示返回按钮，默认不显示 ycl2
}

export default function Header({
  title,
  showBack = false,
}: HeaderProps) {
const navigate = useNavigate();

  return (
    <header className="nhs-header">
      <div className="nhs-header__inner">
        {/* 左侧 Logos ycl2*/}
        <div className="nhs-header__left">
          <img
            className="nhs-logo"
            src={NHSLogo}
            alt="NHS logo"
          />
        <img
            className="dipp-logo"
            src={DIPPLogo}
            alt="DIPP Study logo"
          />
        </div>

        {/* 中间标题 ycl2*/}
        <div className="nhs-header__center">
          {title}
        </div>

        {/* 右侧返回按钮 ycl2*/}
        <div className="nhs-header__right">
          {showBack && (
            <button
              type="button"
              className="nhs-header__back"
              onClick={() => navigate(-1)}
            >
              ← Go back
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
